package com.xoxoisme.watched.domain.collection.repository;

import com.xoxoisme.watched.domain.collection.entity.CollectionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CollectionItemRepository extends JpaRepository<CollectionItem, Long> {
    List<CollectionItem> findByCollectionId(Long collectionId);
    boolean existsByCollectionIdAndContentId(Long collectionId, Long contentId);
    void deleteByCollectionId(Long collectionId);
}
