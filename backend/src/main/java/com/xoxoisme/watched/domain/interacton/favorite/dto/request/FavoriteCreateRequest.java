package com.xoxoisme.watched.domain.interacton.favorite.dto.request;

import jakarta.validation.constraints.NotNull;

public record FavoriteCreateRequest(
        @NotNull Long contentId
) {}
