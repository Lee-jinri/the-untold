package com.untold.backend.question;

import java.time.Duration;

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

	public String ask(String fullTruth, String questionText) {
		String systemPrompt = """
				너는 추리 게임의 진행자야. 아래는 사건의 전체 진실이야:

		        %s
		
		        규칙:
		        1. 플레이어의 질문이 "예/아니오"로 명확히 답할 수 있는 질문이면, 오직 "예" 또는 "아니오"로만 답해.
		        2. 질문이 사건의 진실과 관련이 없으면 "상관 없는 질문입니다."라고 답해.
		        3. 위 진실에 전혀 언급되지 않은 내용(예: 인물의 가족관계, 성격, 취미 등 서술되지 않은 정보)을 묻는 질문이면 절대 추측하거나 "아니오"로 단정짓지 말고 "상관 없는 질문입니다."라고 답해.
		        4. 질문이 "왜", "어떻게", "누가" 같은 개방형 질문이라 예/아니오로 답할 수 없으면, "예/아니오로 답할 수 있는 질문으로 다시 물어봐 주세요."라고 답해.
		
		        절대 진실을 직접 말하지 마. 설명도 하지마. 힌트 주지마.
		        위 세 가지 형식 중 하나로만, 짧게 답해.
				""".formatted(fullTruth);

		String requestBody = """
				{
					"model": "%s",
					"max_tokens": 50,
					"system": %s,
					"messages": [
						{"role": "user", "content": %s}
					]
				}
				""".formatted(
						model,
						toJsonString(systemPrompt),
						toJsonString(questionText)
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

	private String extractAnswer(String response) {
        try {
            JsonNode root = jsonMapper.readTree(response);
            return root.path("content").get(0).path("text").asString().trim();
        } catch (Exception e) {
            throw new RuntimeException("LLM 응답 파싱 실패: " + response, e);
        }
    }
}