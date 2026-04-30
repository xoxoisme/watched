package com.xoxoisme.watched.domain.review.entity;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "review",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "content_id"})
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Review extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "content_id")
    private Content content;

    @Column(nullable = false, length = 1000, name = "review_content")
    private String reviewContent;

    public static Review create(User user, Content content, String reviewContent) {
        Review review = new Review();
        review.user = user;
        review.content = content;
        review.reviewContent = reviewContent;
        return review;
    }

    public void update(String reviewContent) {
        this.reviewContent = reviewContent;
    }
}
