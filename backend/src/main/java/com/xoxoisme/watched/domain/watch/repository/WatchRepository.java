package com.xoxoisme.watched.domain.watch.repository;

import com.xoxoisme.watched.domain.watch.entity.Watch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WatchRepository extends JpaRepository<Watch, Long> {
    List<Watch> findByUserId(Long userId);
    boolean existsByUserIdAndContentId(Long userId, Long contentId);
}
