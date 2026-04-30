package com.xoxoisme.watched.domain.content.entity;

import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "content")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Content extends BaseTimeEntity {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 200, name = "original_title")
    private String originalTitle;

    @Column(length = 255, name = "poster_path")
    private String posterPath;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ContentType type;

    @Column(name = "vote_average", precision = 4, scale = 2)
    private BigDecimal voteAverage;

    @Column(name = "tmdb_id", unique = true)
    private Long tmdbId;

    @Column(columnDefinition = "TEXT")
    private String overview;

    public static Content ofTmdb(Long tmdbId, String title, String originalTitle,
                                  String posterPath, LocalDate releaseDate,
                                  String overview, BigDecimal voteAverage, ContentType type) {
        Content content = new Content();
        content.tmdbId = tmdbId;
        content.title = title;
        content.originalTitle = originalTitle;
        content.posterPath = posterPath;
        content.releaseDate = releaseDate;
        content.overview = overview;
        content.voteAverage = voteAverage;
        content.type = type;
        return content;
    }

    public static Content ofUser(String title, String originalTitle, String posterPath,
                                  LocalDate releaseDate, String overview, ContentType type) {
        Content content = new Content();
        content.title = title;
        content.originalTitle = originalTitle;
        content.posterPath = posterPath;
        content.releaseDate = releaseDate;
        content.overview = overview;
        content.type = type;
        return content;
    }
}
