package com.xoxoisme.watched.domain.collection.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CollectionUpdateRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 1000) String description,
        boolean isPublic
) {}
