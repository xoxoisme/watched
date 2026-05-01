package com.xoxoisme.watched.domain.content.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record TmdbTrendingResult(
        @JsonProperty("id") Long id,
        @JsonProperty("media_type") String mediaType,
        @JsonProperty("title") String title,
        @JsonProperty("name") String name,
        @JsonProperty("original_title") String originalTitle,
        @JsonProperty("original_name") String originalName,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("backdrop_path") String backdropPath,
        @JsonProperty("release_date") String releaseDate,
        @JsonProperty("first_air_date") String firstAirDate,
        @JsonProperty("overview") String overview,
        @JsonProperty("vote_average") BigDecimal voteAverage
) {}
