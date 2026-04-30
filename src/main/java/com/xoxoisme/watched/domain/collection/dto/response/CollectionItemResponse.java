package com.xoxoisme.watched.domain.collection.dto.response;

import com.xoxoisme.watched.domain.collection.entity.CollectionItem;

public record CollectionItemResponse(
        Long id,
        Long contentId,
        String contentTitle,
        String posterPath
) {
    public static CollectionItemResponse from(CollectionItem item) {
        return new CollectionItemResponse(
                item.getId(),
                item.getContent().getId(),
                item.getContent().getTitle(),
                item.getContent().getPosterPath()
        );
    }
}
