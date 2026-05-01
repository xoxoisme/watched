package com.xoxoisme.watched.domain.review.repository;

import com.xoxoisme.watched.domain.review.entity.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {
    boolean existsByUserIdAndReviewId(Long userId, Long reviewId);
    long countByReviewId(Long reviewId);
    Optional<ReviewLike> findByUserIdAndReviewId(Long userId, Long reviewId);
}
