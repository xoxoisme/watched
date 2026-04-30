package com.xoxoisme.watched.domain.watch.service;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.domain.user.repository.UserRepository;
import com.xoxoisme.watched.domain.watch.dto.request.WatchCreateRequest;
import com.xoxoisme.watched.domain.watch.dto.request.WatchUpdateRequest;
import com.xoxoisme.watched.domain.watch.dto.response.WatchResponse;
import com.xoxoisme.watched.domain.watch.entity.Watch;
import com.xoxoisme.watched.domain.watch.repository.WatchRepository;
import com.xoxoisme.watched.global.common.exception.BusinessException;
import com.xoxoisme.watched.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WatchService {

    private final WatchRepository watchRepository;
    private final UserRepository userRepository;
    private final ContentService contentService;

    @Transactional
    public WatchResponse create(Long userId, WatchCreateRequest request) {
        if (watchRepository.existsByUserIdAndContentId(userId, request.contentId())) {
            throw new BusinessException(ErrorCode.WATCH_ALREADY_EXISTS);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Content content = contentService.getEntityById(request.contentId());
        return WatchResponse.from(watchRepository.save(Watch.create(user, content, request.status(), request.watchedAt())));
    }

    public List<WatchResponse> getMyWatches(Long userId) {
        return watchRepository.findByUserId(userId).stream()
                .map(WatchResponse::from)
                .toList();
    }

    @Transactional
    public WatchResponse update(Long userId, Long watchId, WatchUpdateRequest request) {
        Watch watch = getOwnedWatch(watchId, userId);
        watch.update(request.status(), request.watchedAt());
        return WatchResponse.from(watch);
    }

    @Transactional
    public void delete(Long userId, Long watchId) {
        watchRepository.delete(getOwnedWatch(watchId, userId));
    }

    private Watch getOwnedWatch(Long watchId, Long userId) {
        Watch watch = watchRepository.findById(watchId)
                .orElseThrow(() -> new BusinessException(ErrorCode.WATCH_NOT_FOUND));
        if (!watch.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.WATCH_NOT_FOUND);
        }
        return watch;
    }
}
