package com.xoxoisme.watched.domain.interacton.favorite.repository;

import com.xoxoisme.watched.domain.interacton.favorite.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
    boolean existsByUserIdAndContentId(Long userId, Long contentId);
}
