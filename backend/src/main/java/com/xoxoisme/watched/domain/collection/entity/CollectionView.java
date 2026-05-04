package com.xoxoisme.watched.domain.collection.entity;

import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "collection_view")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionView extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "collection_id")
    private Collection collection;

    @Column(name = "viewer_user_id")
    private Long viewerUserId;

    public static CollectionView create(Collection collection, Long viewerUserId) {
        CollectionView view = new CollectionView();
        view.collection = collection;
        view.viewerUserId = viewerUserId;
        return view;
    }
}
