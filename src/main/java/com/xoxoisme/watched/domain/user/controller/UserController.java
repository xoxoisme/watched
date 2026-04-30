package com.xoxoisme.watched.domain.user.controller;

import com.xoxoisme.watched.domain.user.dto.LoginRequest;
import com.xoxoisme.watched.domain.user.dto.SignupRequest;
import com.xoxoisme.watched.domain.user.dto.TokenResponse;
import com.xoxoisme.watched.domain.user.dto.request.UserUpdateRequest;
import com.xoxoisme.watched.domain.user.dto.response.UserProfileResponse;
import com.xoxoisme.watched.domain.user.service.UserService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<Void> signup(@RequestBody @Valid SignupRequest request) {
        userService.signup(request);
        return ApiResponse.ok();
    }

    @PostMapping("/login")
    public ApiResponse<TokenResponse> login(@RequestBody @Valid LoginRequest request) {
        return ApiResponse.ok(userService.login(request));
    }

    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getProfile(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(userService.getProfile(userId));
    }

    @PutMapping("/me")
    public ApiResponse<UserProfileResponse> updateProfile(@RequestBody @Valid UserUpdateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(userService.updateProfile(userId, request));
    }
}
