package com.xoxoisme.watched.domain.content.service;

import com.xoxoisme.watched.domain.content.dto.request.ContentCreateRequest;
import com.xoxoisme.watched.domain.content.dto.response.ContentResponse;
import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.repository.ContentRepository;
import com.xoxoisme.watched.global.common.exception.BusinessException;
import com.xoxoisme.watched.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {

    private final ContentRepository contentRepository;

    public ContentResponse getById(Long id) {
        return ContentResponse.from(getEntityById(id));
    }

    @Transactional
    public ContentResponse create(ContentCreateRequest request) {
        Content content = Content.ofUser(
                request.title(), request.originalTitle(),
                request.posterPath(), request.releaseDate(),
                request.overview(), request.type()
        );
        return ContentResponse.from(contentRepository.save(content));
    }

    public Content getEntityById(Long id) {
        return contentRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.CONTENT_NOT_FOUND));
    }
}
