package com.untold.backend.cases.embedding;

import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

@Service
public class KeywordExpansionService {

    private final WebClient webClient;
    private final String model;
    private final JsonMapper jsonMapper;

    public KeywordExpansionService(
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

    public Map<String, String> expandKeywords(List<String> keywords) {
        String keywordListText = String.join(", ", keywords);

        String systemPrompt = """
                너는 추리 게임의 키워드를 확장하는 도우미야.
                
                아래 키워드 목록 각각에 대해, 플레이어가 자연스러운 문장으로 질문했을 때
                그 키워드와 의미적으로 잘 매칭될 수 있도록, 관련된 단어와 표현들을 모아서
                하나의 짧은 설명 문장으로 만들어줘.

                규칙:
                - 각 키워드마다 동의어, 관련 상황, 관련 행동을 포함한 문장을 만들어.
                - 원래 키워드 단어도 반드시 포함시켜.
                - 중요: 목록에 있는 다른 키워드들과 겹치는 표현은 쓰지 마.
                  각 키워드만의 고유하고 구별되는 특징을 중심으로 확장해.

                예시:
                - "가스" → "가스, 질식, 유독가스 중독, 숨을 쉬지 못함, 가스 누출"
                - "도둑" → "도둑, 절도범, 물건을 훔친 사람, 도둑질, 절도"

                키워드 목록: [%s]

                반드시 아래 JSON 형식으로만 답해. 다른 텍스트는 절대 포함하지 마:
                {"키워드1": "확장된 설명 문장", "키워드2": "확장된 설명 문장", ...}
                """.formatted(keywordListText);

        String requestBody = """
                {
                    "model": "%s",
                    "max_tokens": 1000,
                    "system": %s,
                    "messages": [
                        {"role": "user", "content": "위 키워드들을 확장해줘"}
                    ]
                }
                """.formatted(model, toJsonString(systemPrompt));

        String response = webClient.post()
                .uri("/messages")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .timeout(Duration.ofSeconds(30))
                .block();

        return extractExpansions(response);
    }

    private String toJsonString(String text) {
        return jsonMapper.writeValueAsString(text);
    }

    private Map<String, String> extractExpansions(String response) {
        JsonNode root = jsonMapper.readTree(response);
        String rawText = root.path("content").get(0).path("text").asString().trim();
        String cleanText = rawText.replaceAll("```json", "").replaceAll("```", "").trim();

        JsonNode resultJson = jsonMapper.readTree(cleanText);

        Map<String, String> expansions = new java.util.LinkedHashMap<>();
        resultJson.propertyNames().forEach(key ->
                expansions.put(key, resultJson.path(key).asString())
        );
        return expansions;
    }
}