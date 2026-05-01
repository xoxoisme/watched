package com.xoxoisme.watched.domain.review.entity;

import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.global.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "review_like",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "review_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ReviewLike extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "review_id")
    private Review review;

    public static ReviewLike create(User user, Review review) {
        ReviewLike like = new ReviewLike();
        like.user = user;
        like.review = review;
        return like;
    }
}
