package com.xoxoisme.watched.domain.content.client.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record TmdbPageResponse<T>(
        @JsonProperty("page") int page,
        @JsonProperty("results") List<T> results,
        @JsonProperty("total_pages") int totalPages,
        @JsonProperty("total_results") int totalResults
) {}
