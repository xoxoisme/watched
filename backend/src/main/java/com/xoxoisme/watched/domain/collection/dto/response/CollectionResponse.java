package com.xoxoisme.watched.domain.collection.dto.response;

import com.xoxoisme.watched.domain.collection.entity.Collection;

import java.util.List;

public record CollectionResponse(
        Long id,
        Long userId,
        String ownerNickname,
        String name,
        String description,
        boolean isPublic,
        long viewCount,
        List<CollectionItemResponse> items
) {
    public static CollectionResponse from(Collection collection, List<CollectionItemResponse> items, long viewCount) {
        return new CollectionResponse(
                collection.getId(),
                collection.getUser().getId(),
                collection.getUser().getNickname(),
                collection.getName(),
                collection.getDescription(),
                collection.isPublic(),
                viewCount,
                items
        );
    }

    public static CollectionResponse from(Collection collection, List<CollectionItemResponse> items) {
        return from(collection, items, collection.getViewCount());
    }

    public static CollectionResponse from(Collection collection) {
        return from(collection, List.of(), collection.getViewCount());
    }
}
