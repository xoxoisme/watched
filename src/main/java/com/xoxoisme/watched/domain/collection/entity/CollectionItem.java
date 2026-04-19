package com.xoxoisme.watched.domain.collection.entity;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;

@Entity
@Table(
        name = "collection_item",
        uniqueConstraints = @UniqueConstraint(columnNames = {"collection_id", "content_id"})
)
public class CollectionItem extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "collection_id")
    private Collection collection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "content_id")
    private Content content;
}
