package com.xoxoisme.watched.domain.review.dto.response;

import com.xoxoisme.watched.domain.review.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long contentId,
        String contentTitle,
        Long userId,
        String userNickname,
        String reviewContent,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReviewResponse from(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getContent().getId(),
                review.getContent().getTitle(),
                review.getUser().getId(),
                review.getUser().getNickname(),
                review.getReviewContent(),
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
