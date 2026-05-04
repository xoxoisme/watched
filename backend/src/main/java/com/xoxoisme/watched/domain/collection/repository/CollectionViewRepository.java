package com.xoxoisme.watched.domain.collection.repository;

import com.xoxoisme.watched.domain.collection.entity.CollectionView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface CollectionViewRepository extends JpaRepository<CollectionView, Long> {
    long countByCollectionIdAndCreatedAtAfter(Long collectionId, LocalDateTime from);

    boolean existsByCollectionIdAndViewerUserIdAndCreatedAtAfter(
            Long collectionId, Long viewerUserId, LocalDateTime from);

    void deleteByCollectionId(Long collectionId);
}
