package com.xoxoisme.watched.domain.chat.controller;

import com.xoxoisme.watched.domain.chat.dto.request.ChatRequest;
import com.xoxoisme.watched.domain.chat.dto.response.ChatResponse;
import com.xoxoisme.watched.domain.chat.service.ChatService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ApiResponse<ChatResponse> chat(@RequestBody ChatRequest request) {
        return ApiResponse.ok(chatService.chat(request));
    }
}
