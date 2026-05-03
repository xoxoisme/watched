package com.xoxoisme.watched.domain.user.controller;

import com.xoxoisme.watched.domain.user.dto.request.EmailVerifyConfirmDto;
import com.xoxoisme.watched.domain.user.dto.request.EmailVerifyRequestDto;
import com.xoxoisme.watched.domain.user.service.EmailVerificationService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @PostMapping("/verify-request")
    public ApiResponse<Void> requestVerification(@RequestBody @Valid EmailVerifyRequestDto dto) {
        emailVerificationService.sendCode(dto);
        return ApiResponse.ok();
    }

    @PostMapping("/verify-confirm")
    public ApiResponse<Void> confirmVerification(@RequestBody @Valid EmailVerifyConfirmDto dto) {
        emailVerificationService.confirmCode(dto);
        return ApiResponse.ok();
    }
}
