package com.untold.backend.question;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@Service
public class LlmService {
	private final WebClient webClient;
	private final String model;
	private final JsonMapper jsonMapper;

	public LlmService(
			@Value("${anthropic.api-key}") String apiKey, 
			@Value("${anthropic.model}") String model,
			JsonMapper jsonMapper
		) {
		this.model = model;
		this.jsonMapper = jsonMapper;
        this.webClient = WebClient.builder()
        		.baseUrl("https://api.anthropic.com/v1")
        		.defaultHeader("x-api-key", apiKey)
                .defaultHeader("anthropic-version", "2023-06-01")
                .defaultHeader("Content-Type", "application/json")
                .build();
	}

	public LlmAnswer ask(String fullTruth, String questionText, List<String> keywords) {
		String keywordListText = String.join(", ", keywords);
	    String safeFullTruth = fullTruth.replace("%", "%%");
	    String safeQuestionText = questionText.replace("%", "%%");
	    
	    String systemPrompt = """
				너는 추리 게임의 진행자야. 아래는 사건의 전체 진실이야:

				%s

				너의 역할은 플레이어의 질문에 위 진실을 근거로 정확하게 답하는 거야.

				===== 1단계: 질문 유형 판단 =====
				질문의 "말투나 종결 표현"에 속지 말고, "이 질문이 예/아니오로 답변 가능한 명제인가"를 기준으로 판단해.
				다음은 전부 예/아니오형 질문으로 취급해야 해:
				- "~입니까", "~인가요", "~했나요", "~맞나요", "~지요", "~죠", "~일까요" 등 어떤 종결어미든, 결국 하나의 사실을 확인하는 질문이면 예/아니오형이야.
				- "OO가 XX를 했습니까?", "XX를 한 사람이 OO입니까?"처럼 특정 인물/사실을 지목해서 확인하는 질문은, 중간에 "누구"라는 말이 없어도 예/아니오형이야.
				
				다음만 개방형 질문으로 취급해:
				- "왜 그랬나요", "어떻게 했나요", "누가 그랬나요"처럼, 답이 여러 단어/문장으로 설명되어야 하는 질문.

				개방형 질문이면: "예/아니오로 답할 수 있는 질문으로 다시 물어봐 주세요."라고만 답하고 끝내.

				===== 2단계: 예/아니오형 질문의 진실 대조 =====
				질문에 쓰인 단어가 진실 텍스트와 정확히 똑같지 않아도, 의미가 같거나 밀접하게 관련되면 그 사실을 기준으로 판단해.
				예: "동료", "공범", "함께한 사람"은 서로 비슷한 개념으로 취급.
				예: 특정 인물(예: 교주)과 그 인물이 속한 조직(예: 교단)이 함께 어떤 행동을 한 것으로 진실에 나와있다면, 질문이 둘 중 어느 쪽을 지칭하든 그 행동에 대해서는 동일하게 판단해.

				판단 결과:
				- 질문이 진실과 일치하면 "예"
				- 질문이 진실과 명백히 다르면 "아니오"
				- 질문이 진실에 전혀 등장하지 않는, 완전히 무관한 정보(외모, 취미, 좋아하는 것, 가족관계 등 서술 자체가 없는 것)를 물을 때만 "상관 없는 질문입니다."
				
				주의: "상관 없는 질문입니다"는 정말 마지막 수단이야. 질문이 진실의 어떤 사실과 조금이라도 의미적으로 연결된다면, 반드시 예/아니오로 판단해.

				절대 진실을 직접 말하지 마. 설명하지 마. 힌트를 주지 마.

				===== 3단계: 키워드 매칭 (신중하게) =====
				아래 키워드 목록 중에서, 이번 질문이 "직접적으로 지칭하거나 핵심 주제로 다루는" 키워드만 골라줘.
				질문에 등장한 개념과 "밀접하게 연관될 뿐인" 키워드는 포함하지 마.
				
				예를 들어 질문이 "재산 문제 때문에 숨긴 건가요?"라면:
				- "은폐/사망"처럼 질문이 직접 묻는 핵심 개념은 포함
				- "헌금"은 질문에서 직접 묻지 않았으니 제외 (재산 문제라는 동기만 물었을 뿐, 헌금이라는 구체적 행위를 맞춘 게 아님)
				
				키워드 매칭 시 주의: 질문에 "조직/집단"(예: 교단, 단체 이름)만 언급되고 그 안의 "특정 개인"(예: 교주)이 직접 언급되지 않았다면, 그 개인을 가리키는 키워드는 매칭하지 마.

				키워드 목록: [%s]

				반드시 아래 JSON 형식으로만 답해. 다른 텍스트는 절대 포함하지 마:
				{"answer": "여기에 위 규칙에 따른 답변", "matchedKeywords": ["직접 관련된 키워드만 배열로, 없으면 빈 배열"]}
				""".formatted(safeFullTruth, keywordListText);

		String requestBody = """
				{
					"model": "%s",
					"max_tokens": 500,
					"system": %s,
					"messages": [
						{"role": "user", "content": %s}
					]
				}
				""".formatted(
						model,
						toJsonString(systemPrompt),
						toJsonString(safeQuestionText)
					);

		String response = webClient.post()
				.uri("/messages")
				.bodyValue(requestBody)
				.retrieve()
				.bodyToMono(String.class)
				.timeout(Duration.ofSeconds(30))
				.block();
		
		return extractAnswer(response);
	}

	private String toJsonString(String text) {
        return jsonMapper.writeValueAsString(text);
    }

	private LlmAnswer extractAnswer(String response) {
        JsonNode root = jsonMapper.readTree(response);
        String rawText = root.path("content").get(0).path("text").asString().trim();
        System.out.println("=== RAW LLM TEXT ===");
        System.out.println(rawText);
        System.out.println("====================");
        String cleanText = rawText.replaceAll("```json", "").replaceAll("```", "").trim();
        
        JsonNode resultJson = jsonMapper.readTree(cleanText);
        String answer = resultJson.path("answer").asString();
        
        List<String> matchedKeywords = new java.util.ArrayList<>();
        resultJson.path("matchedKeywords").forEach(node -> matchedKeywords.add(node.asString()));
        
        return new LlmAnswer(answer,matchedKeywords);
    }
}