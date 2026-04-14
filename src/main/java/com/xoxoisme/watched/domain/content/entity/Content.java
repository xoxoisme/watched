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
    private String title;

    @Column(nullable = false, length = 100, name = "original_title")
    private String originalTitle;

    @Column(nullable = false, length = 255, name = "poster_path")
    private String posterPath;

    @Column(nullable = true, name = "release_date")
    private LocalDateTime releaseDate;  // TMDB api 특성 상 아주 오래된 영화는 null이 존재한다.

    @Column(nullable = false, length = 100)
    private String type;

    @Column(nullable = true, name = "vote_average")
    private BigDecimal voteAverage;
}
