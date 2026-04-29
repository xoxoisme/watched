package com.xoxoisme.watched.domain.content.client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public record TmdbTvResult(
        @JsonProperty("id") Long id,
        @JsonProperty("name") String name,
        @JsonProperty("original_name") String originalName,
        @JsonProperty("poster_path") String posterPath,
        @JsonProperty("first_air_date") String firstAirDate,
        @JsonProperty("overview") String overview,
        @JsonProperty("vote_average") BigDecimal voteAverage
) {}
