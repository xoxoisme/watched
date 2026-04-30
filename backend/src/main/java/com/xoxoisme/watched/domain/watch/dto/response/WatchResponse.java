package com.xoxoisme.watched.domain.watch.dto.response;

import com.xoxoisme.watched.domain.watch.entity.Watch;
import com.xoxoisme.watched.domain.watch.entity.WatchStatus;

import java.time.LocalDate;

public record WatchResponse(
        Long id,
        Long contentId,
        String contentTitle,
        String posterPath,
        WatchStatus status,
        LocalDate watchedAt
) {
    public static WatchResponse from(Watch watch) {
        return new WatchResponse(
                watch.getId(),
                watch.getContent().getId(),
                watch.getContent().getTitle(),
                watch.getContent().getPosterPath(),
                watch.getStatus(),
                watch.getWatchedAt()
        );
    }
}
