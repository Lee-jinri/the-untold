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
		
		        규칙:
		        1. 플레이어의 질문이 "예/아니오"로 명확히 답할 수 있는 질문이면, 오직 "예" 또는 "아니오"로만 답해.
		        2. 질문이 사건의 진실과 관련이 없으면 "상관 없는 질문입니다."라고 답해.
		        3. 위 진실에 전혀 언급되지 않은 내용(예: 인물의 가족관계, 성격, 취미 등 서술되지 않은 정보)을 묻는 질문이면 절대 추측하거나 "아니오"로 단정짓지 말고 "상관 없는 질문입니다."라고 답해.
		        4. 질문이 "왜", "어떻게", "누가" 같은 개방형 질문이라 예/아니오로 답할 수 없으면, "예/아니오로 답할 수 있는 질문으로 다시 물어봐 주세요."라고 답해.
		
				질문에 "죽인 사람", "살해자" 같은 표현이 있는데 진실에 따르면 타살이 아니라 자연사/병사인 경우 "아니오"로 명확히 답해. 절대 개방형 질문으로 취급하지 마.

		        절대 진실을 직접 말하지 마. 설명도 하지마. 힌트 주지마.
		        진실에 명시되지 않은 것을 추측해서 답하지 마.
		        
		        추가로, 아래 키워드 목록 중에서 이번 질문이 의미적으로 관련 있는 키워드가 있으면 찾아줘.
		        정확히 같은 단어가 아니라도 비슷한 의미(동의어, 유사 표현)라면 관련 있는 것으로 판단해.
		        키워드 목록: [%s]
		        
		        반드시 아래 JSON 형식으로만 답해. 다른 텍스트는 절대 포함하지 마.
		        {"answer": "여기에 위 규칙에 따른 답변", "matchedKeywords": ["관련된 키워드만 배열로, 없으면 빈 배열"]}
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