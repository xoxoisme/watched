package com.xoxoisme.watched.domain.interacton.rating.controller;

import com.xoxoisme.watched.domain.interacton.rating.dto.request.RatingCreateRequest;
import com.xoxoisme.watched.domain.interacton.rating.dto.request.RatingUpdateRequest;
import com.xoxoisme.watched.domain.interacton.rating.dto.response.RatingAverageResponse;
import com.xoxoisme.watched.domain.interacton.rating.dto.response.RatingResponse;
import com.xoxoisme.watched.domain.interacton.rating.service.RatingService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RatingResponse> create(@RequestBody @Valid RatingCreateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(ratingService.create(userId, request));
    }

    @GetMapping("/contents/{contentId}")
    public ApiResponse<RatingAverageResponse> getAverageByContent(@PathVariable Long contentId) {
        return ApiResponse.ok(ratingService.getAverageByContent(contentId));
    }

    @PutMapping("/{id}")
    public ApiResponse<RatingResponse> update(@PathVariable Long id, @RequestBody @Valid RatingUpdateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(ratingService.update(userId, id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        ratingService.delete(userId, id);
    }
}
