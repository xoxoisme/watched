package com.xoxoisme.watched.domain.interacton.rating.repository;

import com.xoxoisme.watched.domain.interacton.rating.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    boolean existsByUserIdAndContentId(Long userId, Long contentId);
    Optional<Rating> findByUserIdAndContentId(Long userId, Long contentId);

    @Query("SELECT AVG(r.score) FROM Rating r WHERE r.content.id = :contentId")
    Optional<BigDecimal> findAverageScoreByContentId(@Param("contentId") Long contentId);
}
