package com.xoxoisme.watched.domain.collection.entity;

import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "collection")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Collection extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @Column(length = 100)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(nullable = false, name = "is_public")
    private boolean isPublic;

    public static Collection create(User user, String name, String description, boolean isPublic) {
        Collection collection = new Collection();
        collection.user = user;
        collection.name = name;
        collection.description = description;
        collection.isPublic = isPublic;
        return collection;
    }

    public void update(String name, String description, boolean isPublic) {
        this.name = name;
        this.description = description;
        this.isPublic = isPublic;
    }
}
