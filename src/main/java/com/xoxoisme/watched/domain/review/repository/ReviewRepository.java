package com.xoxoisme.watched.domain.review.repository;

import com.xoxoisme.watched.domain.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByContentId(Long contentId);
    List<Review> findByUserId(Long userId);
    boolean existsByUserIdAndContentId(Long userId, Long contentId);
}
