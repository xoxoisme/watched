package com.xoxoisme.watched.domain.interacton.favorite.dto.response;

import com.xoxoisme.watched.domain.interacton.favorite.entity.Favorite;

public record FavoriteResponse(
        Long id,
        Long contentId,
        Long tmdbId,
        String contentTitle,
        String posterPath
) {
    public static FavoriteResponse from(Favorite favorite) {
        return new FavoriteResponse(
                favorite.getId(),
                favorite.getContent().getId(),
                favorite.getContent().getTmdbId(),
                favorite.getContent().getTitle(),
                favorite.getContent().getPosterPath()
        );
    }
}
