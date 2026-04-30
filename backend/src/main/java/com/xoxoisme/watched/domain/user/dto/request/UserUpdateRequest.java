package com.xoxoisme.watched.domain.user.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateRequest(
        @NotBlank @Size(max = 20) String nickname,
        String profileImageUrl
) {}
