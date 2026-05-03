package com.xoxoisme.watched.domain.collection.controller;

import com.xoxoisme.watched.domain.collection.dto.request.CollectionCreateRequest;
import com.xoxoisme.watched.domain.collection.dto.request.CollectionItemAddRequest;
import com.xoxoisme.watched.domain.collection.dto.request.CollectionUpdateRequest;
import com.xoxoisme.watched.domain.collection.dto.response.CollectionItemResponse;
import com.xoxoisme.watched.domain.collection.dto.response.CollectionResponse;
import com.xoxoisme.watched.domain.collection.service.CollectionService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import com.xoxoisme.watched.global.common.response.PageResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/collections")
@RequiredArgsConstructor
public class CollectionController {

    private final CollectionService collectionService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CollectionResponse> create(@RequestBody @Valid CollectionCreateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(collectionService.create(userId, request));
    }

    @GetMapping("/me")
    public ApiResponse<PageResponse<CollectionResponse>> getMyCollections(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(collectionService.getMyCollections(userId, page, size));
    }

    @GetMapping("/public")
    public ApiResponse<PageResponse<CollectionResponse>> getPublicCollections(
            @RequestParam(defaultValue = "all") String period,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ApiResponse.ok(collectionService.getPublicCollections(period, page, size));
    }

    @GetMapping("/{id}")
    public ApiResponse<CollectionResponse> getById(@PathVariable Long id, Authentication authentication) {
        Long userId = authentication != null ? (Long) authentication.getPrincipal() : null;
        return ApiResponse.ok(collectionService.getById(userId, id));
    }

    @PutMapping("/{id}")
    public ApiResponse<CollectionResponse> update(@PathVariable Long id, @RequestBody @Valid CollectionUpdateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(collectionService.update(userId, id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        collectionService.delete(userId, id);
    }

    @PostMapping("/{id}/items")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<CollectionItemResponse> addItem(@PathVariable Long id, @RequestBody @Valid CollectionItemAddRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(collectionService.addItem(userId, id, request));
    }

    @DeleteMapping("/{id}/items/{itemId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeItem(@PathVariable Long id, @PathVariable Long itemId, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        collectionService.removeItem(userId, id, itemId);
    }
}
