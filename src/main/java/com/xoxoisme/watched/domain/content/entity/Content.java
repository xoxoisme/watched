package com.xoxoisme.watched.domain.content.entity;

import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "contents")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Content extends BaseTimeEntity {

    @Column(nullable = false, length = 100)
    private String title;   // 본 제목

    @Column(nullable = false, length = 100, name = "original_title")
    private String originalTitle;   // 나라별 언어로 해석된 제목

    @Column(nullable = false, length = 255, name = "poster_path")
    private String posterPath;  // TMDB api에서 제공하는 포스터 경로

    @Column(nullable = true, name = "release_date")
    private LocalDateTime releaseDate;  // TMDB api 특성 상 아주 오래된 영화는 null

    @Column(nullable = false, length = 100)
    private String type;

    @Column(nullable = true, name = "vote_average")
    private BigDecimal voteAverage; // TMDB api에서 제공하는 평점
}
