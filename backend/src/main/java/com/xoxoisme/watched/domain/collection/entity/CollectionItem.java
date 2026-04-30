package com.xoxoisme.watched.domain.collection.entity;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "collection_item",
        uniqueConstraints = @UniqueConstraint(columnNames = {"collection_id", "content_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionItem extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "collection_id")
    private Collection collection;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "content_id")
    private Content content;

    public static CollectionItem create(Collection collection, Content content) {
        CollectionItem item = new CollectionItem();
        item.collection = collection;
        item.content = content;
        return item;
    }
}
