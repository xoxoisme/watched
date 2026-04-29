package com.xoxoisme.watched.domain.content.controller;

import com.xoxoisme.watched.domain.content.dto.ContentCreateRequest;
import com.xoxoisme.watched.domain.content.dto.ContentResponse;
import com.xoxoisme.watched.domain.content.dto.TmdbSearchResponse;
import com.xoxoisme.watched.domain.content.entity.ContentType;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.content.service.TmdbService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contents")
@RequiredArgsConstructor
public class ContentController {

    private final ContentService contentService;
    private final TmdbService tmdbService;

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
