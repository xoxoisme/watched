package com.xoxoisme.watched.domain.interacton.favorite.entity;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "favorite",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Favorite extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "content_id")
    private Content content;

    public static Favorite create(User user, Content content) {
        Favorite favorite = new Favorite();
        favorite.user = user;
        favorite.content = content;
        return favorite;
    }
}
