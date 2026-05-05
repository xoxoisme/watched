package com.xoxoisme.watched.global.common.response;

import org.springframework.data.domain.Page;

import java.util.List;

public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        int totalPages,
        long totalElements
) {
    public static <T> PageResponse<T> of(List<T> all, int page, int size) {
        int total = all.size();
        int totalPages = total == 0 ? 0 : (int) Math.ceil((double) total / size);
        int from = Math.min(page * size, total);
        int to = Math.min(from + size, total);
        return new PageResponse<>(all.subList(from, to), page, size, totalPages, total);
    }

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(page.getContent(), page.getNumber(), page.getSize(), page.getTotalPages(), page.getTotalElements());
    }
}
