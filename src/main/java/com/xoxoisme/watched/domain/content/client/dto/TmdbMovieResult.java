package com.xoxoisme.watched.domain.content.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record TmdbMovieResult(
        @JsonProperty("id") Long id,
        @JsonProperty("title") String title,
        @JsonProperty("original_title") String originalTitle,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("release_date") String releaseDate,
        @JsonProperty("overview") String overview,
        @JsonProperty("vote_average") BigDecimal voteAverage
) {}
