package com.xoxoisme.watched.domain.review.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewCreateRequest(
        @NotNull Long contentId,
        @NotBlank @Size(max = 1000) String reviewContent
) {}
