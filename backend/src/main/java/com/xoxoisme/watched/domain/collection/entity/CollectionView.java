package com.xoxoisme.watched.domain.collection.entity;

import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "collection_view")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class CollectionView extends BaseTimeEntity {

    @Column(nullable = false, name = "collection_id")
    private Long collectionId;

    @Column(name = "viewer_user_id")
    private Long viewerUserId;

    public static CollectionView create(Long collectionId, Long viewerUserId) {
        CollectionView view = new CollectionView();
        view.collectionId = collectionId;
        view.viewerUserId = viewerUserId;
        return view;
    }
}
