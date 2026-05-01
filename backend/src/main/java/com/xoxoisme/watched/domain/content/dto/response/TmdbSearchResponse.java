package com.xoxoisme.watched.domain.content.dto.response;

import com.xoxoisme.watched.domain.content.entity.ContentType;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TmdbSearchResponse(
        Long tmdbId,
        String title,
        String originalTitle,
        String posterUrl,
        String backdropUrl,
        LocalDate releaseDate,
        String overview,
        BigDecimal voteAverage,
        ContentType type
) {}
