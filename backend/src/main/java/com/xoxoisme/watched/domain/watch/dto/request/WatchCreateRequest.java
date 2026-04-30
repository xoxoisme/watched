package com.xoxoisme.watched.domain.watch.dto.request;

import com.xoxoisme.watched.domain.watch.entity.WatchStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record WatchCreateRequest(
        @NotNull Long contentId,
        @NotNull WatchStatus status,
        LocalDate watchedAt
) {}
