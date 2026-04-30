package com.xoxoisme.watched.domain.interacton.rating.dto.response;

import com.xoxoisme.watched.domain.interacton.rating.entity.Rating;

import java.math.BigDecimal;

public record RatingResponse(
        Long id,
        Long contentId,
        String contentTitle,
        Long userId,
        BigDecimal score
) {
    public static RatingResponse from(Rating rating) {
        return new RatingResponse(
                rating.getId(),
                rating.getContent().getId(),
                rating.getContent().getTitle(),
                rating.getUser().getId(),
                rating.getScore()
        );
    }
}
