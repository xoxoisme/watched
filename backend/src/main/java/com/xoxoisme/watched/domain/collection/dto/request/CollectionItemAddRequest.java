package com.xoxoisme.watched.domain.collection.dto.request;

import jakarta.validation.constraints.NotNull;

public record CollectionItemAddRequest(
        @NotNull Long contentId
) {}
