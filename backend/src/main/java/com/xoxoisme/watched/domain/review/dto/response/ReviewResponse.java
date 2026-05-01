package com.xoxoisme.watched.domain.review.dto.response;

import com.xoxoisme.watched.domain.review.entity.Review;

import java.time.LocalDateTime;

public record ReviewResponse(
        Long id,
        Long contentId,
        String contentTitle,
        Long userId,
        String userNickname,
        String userProfileImageUrl,
        String reviewContent,
        long likeCount,
        boolean likedByMe,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static ReviewResponse from(Review review, long likeCount, boolean likedByMe) {
        return new ReviewResponse(
                review.getId(),
                review.getContent().getId(),
                review.getContent().getTitle(),
                review.getUser().getId(),
                review.getUser().getNickname(),
                review.getUser().getProfileImageUrl(),
                review.getReviewContent(),
                likeCount,
                likedByMe,
                review.getCreatedAt(),
                review.getUpdatedAt()
        );
    }
}
