package com.xoxoisme.watched.domain.watch.controller;

import com.xoxoisme.watched.domain.watch.dto.request.WatchCreateRequest;
import com.xoxoisme.watched.domain.watch.dto.request.WatchUpdateRequest;
import com.xoxoisme.watched.domain.watch.dto.response.WatchResponse;
import com.xoxoisme.watched.domain.watch.service.WatchService;
import com.xoxoisme.watched.global.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watch")
@RequiredArgsConstructor
public class WatchController {

    private final WatchService watchService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<WatchResponse> create(@RequestBody @Valid WatchCreateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(watchService.create(userId, request));
    }

    @GetMapping("/me")
    public ApiResponse<List<WatchResponse>> getMyWatches(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(watchService.getMyWatches(userId));
    }

    @PutMapping("/{id}")
    public ApiResponse<WatchResponse> update(@PathVariable Long id, @RequestBody @Valid WatchUpdateRequest request, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        return ApiResponse.ok(watchService.update(userId, id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        watchService.delete(userId, id);
    }
}
