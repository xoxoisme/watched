package com.xoxoisme.watched.domain.interacton.rating.entity;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(
        name = "rating",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rating extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "content_id")
    private Content content;

    @Column(nullable = false, precision = 3, scale = 1)
    private BigDecimal score;

    public static Rating create(User user, Content content, BigDecimal score) {
        Rating rating = new Rating();
        rating.user = user;
        rating.content = content;
        rating.score = score;
        return rating;
    }

    public void update(BigDecimal score) {
        this.score = score;
    }
}
