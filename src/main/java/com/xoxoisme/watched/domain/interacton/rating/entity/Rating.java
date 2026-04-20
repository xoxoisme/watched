package com.xoxoisme.watched.domain.interacton.rating.entity;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;

@Entity
@Table(
        name = "rating",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id"})
)
public class Rating extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "content_id")
    private Content content;

    @Column(nullable = false)
    private Long score;
}
