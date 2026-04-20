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

    @Column(nullable = false, length = 20)
    private String status;  // 현재 시청 상태

    @Column(nullable = true, name = "watched_at")
    private LocalDate watchedAt;    // 시청 일시 기록용(사용자 직접)
}
