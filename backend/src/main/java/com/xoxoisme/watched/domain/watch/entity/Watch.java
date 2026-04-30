package com.xoxoisme.watched.domain.watch.entity;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "watch")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Watch extends BaseTimeEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(nullable = false, name = "content_id")
    private Content content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WatchStatus status;

    @Column(name = "watched_at")
    private LocalDate watchedAt;

    public static Watch create(User user, Content content, WatchStatus status, LocalDate watchedAt) {
        Watch watch = new Watch();
        watch.user = user;
        watch.content = content;
        watch.status = status;
        watch.watchedAt = watchedAt;
        return watch;
    }

    public void update(WatchStatus status, LocalDate watchedAt) {
        this.status = status;
        this.watchedAt = watchedAt;
    }
}
