package com.xoxoisme.watched.domain.review.controller;

import com.xoxoisme.watched.domain.review.dto.request.ReviewCreateRequest;
import com.xoxoisme.watched.domain.review.dto.request.ReviewUpdateRequest;
import com.xoxoisme.watched.domain.review.dto.response.ReviewResponse;
import com.xoxoisme.watched.domain.review.service.ReviewService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<ReviewResponse> create(@RequestBody @Valid ReviewCreateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(reviewService.create(userId, request));
    }

    @GetMapping("/contents/{contentId}")
    public ApiResponse<List<ReviewResponse>> getByContent(@PathVariable Long contentId) {
        return ApiResponse.ok(reviewService.getByContent(contentId));
    }

    @GetMapping("/me")
    public ApiResponse<List<ReviewResponse>> getMyReviews(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(reviewService.getMyReviews(userId));
    }

    @PutMapping("/{id}")
    public ApiResponse<ReviewResponse> update(@PathVariable Long id, @RequestBody @Valid ReviewUpdateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(reviewService.update(userId, id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        reviewService.delete(userId, id);
    }
}
