package com.xoxoisme.watched.domain.content.controller;

import com.xoxoisme.watched.domain.content.dto.request.ContentCreateRequest;
import com.xoxoisme.watched.domain.content.dto.response.ContentResponse;
import com.xoxoisme.watched.domain.content.dto.response.TmdbSearchResponse;
import com.xoxoisme.watched.domain.content.entity.ContentType;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.content.service.TmdbService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;
    private final TmdbService tmdbService;

    @GetMapping("/trending")
    public ApiResponse<List<TmdbSearchResponse>> trending() {
        return ApiResponse.ok(tmdbService.getTrending());
    }

    @GetMapping("/top/movies")
    public ApiResponse<List<TmdbSearchResponse>> topMovies() {
        return ApiResponse.ok(tmdbService.getTopMovies());
    }

    @GetMapping("/top/tv")
    public ApiResponse<List<TmdbSearchResponse>> topTv() {
        return ApiResponse.ok(tmdbService.getTopTv());
    }

    @GetMapping("/recommendations")
    public ApiResponse<List<TmdbSearchResponse>> recommendations(Authentication authentication) {
        Long userId = authentication != null ? (Long) authentication.getPrincipal() : null;
        return ApiResponse.ok(tmdbService.getRecommendations(userId));
    }

    @GetMapping("/search")
    public ApiResponse<List<TmdbSearchResponse>> search(
            @RequestParam String query,
            @RequestParam ContentType type,
            @RequestParam(defaultValue = "1") int page) {
        return ApiResponse.ok(tmdbService.search(query, type, page));
    }

    @GetMapping("/{id}")
    public ApiResponse<ContentResponse> getContent(@PathVariable Long id) {
        return ApiResponse.ok(contentService.getById(id));
    }

    @GetMapping("/tmdb/{tmdbId}")
    public ApiResponse<ContentResponse> getByTmdbId(
            @PathVariable Long tmdbId,
            @RequestParam ContentType type) {
        return ApiResponse.ok(ContentResponse.from(tmdbService.fetchAndSave(tmdbId, type)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ContentResponse> create(@RequestBody @Valid ContentCreateRequest request) {
        return ApiResponse.ok(contentService.create(request));
    }
}
