package com.xoxoisme.watched.domain.content.client;

import com.xoxoisme.watched.domain.content.client.dto.TmdbTvResult;
import com.xoxoisme.watched.domain.content.client.dto.request.TmdbMovieResult;
import com.xoxoisme.watched.domain.content.client.dto.response.TmdbPageResponse;
import com.xoxoisme.watched.global.config.TmdbProperties;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class TmdbClient {

    private static final String BASE_URL = "https://api.themoviedb.org/3";

    private final RestClient restClient;
    private final TmdbProperties properties;

    public TmdbClient(TmdbProperties properties) {
        this.properties = properties;
        this.restClient = RestClient.builder()
                .baseUrl(BASE_URL)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + properties.accessToken())
                .build();
    }

    public TmdbPageResponse<TmdbMovieResult> searchMovies(String query, int page) {
        return restClient.get()
                .uri("/search/movie?query={query}&page={page}&language=ko-KR", query, page)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public TmdbPageResponse<TmdbTvResult> searchTvShows(String query, int page) {
        return restClient.get()
                .uri("/search/tv?query={query}&page={page}&language=ko-KR", query, page)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});
    }

    public TmdbMovieResult getMovie(Long tmdbId) {
        return restClient.get()
                .uri("/movie/{id}?language=ko-KR", tmdbId)
                .retrieve()
                .body(TmdbMovieResult.class);
    }

    public TmdbTvResult getTvShow(Long tmdbId) {
        return restClient.get()
                .uri("/tv/{id}?language=ko-KR", tmdbId)
                .retrieve()
                .body(TmdbTvResult.class);
    }

    public String buildImageUrl(String posterPath) {
        if (posterPath == null) return null;
        return properties.imageBaseUrl() + posterPath;
    }
}
