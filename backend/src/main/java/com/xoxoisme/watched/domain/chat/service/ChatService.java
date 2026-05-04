package com.xoxoisme.watched.domain.chat.service;

import com.xoxoisme.watched.domain.chat.dto.request.ChatRequest;
import com.xoxoisme.watched.domain.chat.dto.response.ChatResponse;
import com.xoxoisme.watched.global.config.AnthropicProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ChatService {

    private static final String ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
    private static final String MODEL = "claude-sonnet-4-6";
    private static final String SYSTEM_PROMPT = """
            당신은 영화와 TV 시리즈 제목을 찾아주는 전문가입니다.
            사용자가 제목이 기억나지 않는 작품에 대해 설명하면 알맞은 작품을 찾아주세요.

            응답 규칙:
            - 후보작이 여러 개면 모두 나열하되, 가장 가능성 높은 것을 먼저 제시하세요.
            - 각 작품마다 제목(한국어/영어), 개봉연도, 장르, 한 줄 설명을 알려주세요.
            - 확실하지 않으면 솔직하게 말하고 추가 정보를 물어보세요.
            - 영화인지 드라마인지 모르면 둘 다 고려하세요.
            - 답변은 간결하고 친근하게 해주세요.
            """;

    private final AnthropicProperties anthropicProperties;
    private final RestClient restClient = RestClient.create();

    public ChatResponse chat(ChatRequest request) {
        List<Map<String, String>> messages = request.messages().stream()
                .map(m -> Map.of("role", m.role(), "content", m.content()))
                .toList();

        Map<String, Object> body = Map.of(
                "model", MODEL,
                "max_tokens", 1024,
                "system", SYSTEM_PROMPT,
                "messages", messages
        );

        Map<?, ?> response = restClient.post()
                .uri(ANTHROPIC_API_URL)
                .header("x-api-key", anthropicProperties.apiKey())
                .header("anthropic-version", "2023-06-01")
                .header("Content-Type", "application/json")
                .body(body)
                .retrieve()
                .body(Map.class);

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
        String text = (String) content.get(0).get("text");
        return new ChatResponse(text);
    }
}
