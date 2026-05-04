package com.xoxoisme.watched.domain.collection.repository;

import com.xoxoisme.watched.domain.collection.entity.Collection;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    List<Collection> findByUserId(Long userId);
    List<Collection> findByIsPublicTrue();
    List<Collection> findByIsPublicTrueAndCreatedAtAfter(LocalDateTime from);
}
