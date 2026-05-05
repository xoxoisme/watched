package com.xoxoisme.watched.domain.collection.repository;

import com.xoxoisme.watched.domain.collection.entity.Collection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface CollectionRepository extends JpaRepository<Collection, Long> {
    Page<Collection> findByUserId(Long userId, Pageable pageable);
    Page<Collection> findByIsPublicTrueOrderByViewCountDesc(Pageable pageable);
    Page<Collection> findByIsPublicTrueAndCreatedAtAfterOrderByViewCountDesc(LocalDateTime from, Pageable pageable);
}
