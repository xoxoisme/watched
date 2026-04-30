package com.xoxoisme.watched.domain.interacton.favorite.controller;

import com.xoxoisme.watched.domain.interacton.favorite.dto.request.FavoriteCreateRequest;
import com.xoxoisme.watched.domain.interacton.favorite.dto.response.FavoriteResponse;
import com.xoxoisme.watched.domain.interacton.favorite.service.FavoriteService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<FavoriteResponse> create(@RequestBody @Valid FavoriteCreateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(favoriteService.create(userId, request));
    }

    @GetMapping("/me")
    public ApiResponse<List<FavoriteResponse>> getMyFavorites(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(favoriteService.getMyFavorites(userId));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        favoriteService.delete(userId, id);
    }
}
