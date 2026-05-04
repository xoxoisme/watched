package com.xoxoisme.watched.domain.chat.dto.request;

import java.util.List;

public record ChatRequest(List<MessageDto> messages) {
    public record MessageDto(String role, String content) {}
}
