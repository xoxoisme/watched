package com.xoxoisme.watched.domain.content.dto;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.entity.ContentType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContentResponse(
        Long id,
        Long tmdbId,
        String title,
        String originalTitle,
        String posterPath,
        LocalDate releaseDate,
        String overview,
        BigDecimal voteAverage,
        ContentType type
) {
    public static ContentResponse from(Content content) {
        return new ContentResponse(
                content.getId(),
                content.getTmdbId(),
                content.getTitle(),
                content.getOriginalTitle(),
                content.getPosterPath(),
                content.getReleaseDate(),
                content.getOverview(),
                content.getVoteAverage(),
                content.getType()
        );
    }
}
