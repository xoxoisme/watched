package com.xoxoisme.watched.domain.collection.dto.response;

import com.xoxoisme.watched.domain.collection.entity.Collection;

import java.util.List;

public record CollectionResponse(
        Long id,
        Long userId,
        String name,
        String description,
        boolean isPublic,
        List<CollectionItemResponse> items
) {
    public static CollectionResponse from(Collection collection, List<CollectionItemResponse> items) {
        return new CollectionResponse(
                collection.getId(),
                collection.getUser().getId(),
                collection.getName(),
                collection.getDescription(),
                collection.isPublic(),
                items
        );
    }

    public static CollectionResponse from(Collection collection) {
        return from(collection, List.of());
    }
}
