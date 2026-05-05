package com.xoxoisme.watched.domain.collection.service;

import com.xoxoisme.watched.domain.collection.dto.request.CollectionCreateRequest;
import com.xoxoisme.watched.domain.collection.dto.request.CollectionItemAddRequest;
import com.xoxoisme.watched.domain.collection.dto.request.CollectionUpdateRequest;
import com.xoxoisme.watched.domain.collection.dto.response.CollectionItemResponse;
import com.xoxoisme.watched.domain.collection.dto.response.CollectionResponse;
import com.xoxoisme.watched.domain.collection.entity.Collection;
import com.xoxoisme.watched.domain.collection.entity.CollectionItem;
import com.xoxoisme.watched.domain.collection.entity.CollectionView;
import com.xoxoisme.watched.domain.collection.repository.CollectionItemRepository;
import com.xoxoisme.watched.domain.collection.repository.CollectionRepository;
import com.xoxoisme.watched.domain.collection.repository.CollectionViewRepository;
import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.domain.user.repository.UserRepository;
import com.xoxoisme.watched.global.common.exception.BusinessException;
import com.xoxoisme.watched.global.common.exception.ErrorCode;
import com.xoxoisme.watched.global.common.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CollectionService {

    private final CollectionRepository collectionRepository;
    private final CollectionItemRepository collectionItemRepository;
    private final CollectionViewRepository collectionViewRepository;
    private final UserRepository userRepository;
    private final ContentService contentService;

    @Transactional
    public CollectionResponse create(Long userId, CollectionCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return CollectionResponse.from(
                collectionRepository.save(Collection.create(user, request.name(), request.description(), request.isPublic()))
        );
    }

    public PageResponse<CollectionResponse> getMyCollections(Long userId, int page, int size) {
        Page<Collection> collectionPage = collectionRepository.findByUserId(userId, PageRequest.of(page, size));
        return PageResponse.from(collectionPage.map(collection -> {
            List<CollectionItemResponse> items = collectionItemRepository
                    .findByCollectionId(collection.getId()).stream()
                    .map(CollectionItemResponse::from)
                    .toList();
            return CollectionResponse.from(collection, items, collection.getViewCount());
        }));
    }

    @Transactional
    public CollectionResponse getById(Long userId, Long collectionId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND));
        if (!collection.isPublic() && !collection.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.COLLECTION_NOT_FOUND);
        }
        if (userId != null && !collection.getUser().getId().equals(userId)) {
            LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
            boolean recentlyViewed = collectionViewRepository
                    .existsByCollectionIdAndViewerUserIdAndCreatedAtAfter(collectionId, userId, oneHourAgo);
            if (!recentlyViewed) {
                collectionViewRepository.save(CollectionView.create(collection, userId));
                collection.incrementViewCount();
            }
        }
        List<CollectionItemResponse> items = collectionItemRepository.findByCollectionId(collectionId).stream()
                .map(CollectionItemResponse::from)
                .toList();
        return CollectionResponse.from(collection, items, collection.getViewCount());
    }

    public PageResponse<CollectionResponse> getPublicCollections(String period, int page, int size) {
        LocalDateTime from = switch (period) {
            case "today" -> LocalDate.now().atStartOfDay();
            case "month" -> LocalDate.now().withDayOfMonth(1).atStartOfDay();
            case "year" -> LocalDate.now().withDayOfYear(1).atStartOfDay();
            default -> null;
        };

        PageRequest pageable = PageRequest.of(page, size);
        Page<Collection> collectionPage = from == null
                ? collectionRepository.findByIsPublicTrueOrderByViewCountDesc(pageable)
                : collectionRepository.findByIsPublicTrueAndCreatedAtAfterOrderByViewCountDesc(from, pageable);

        return PageResponse.from(collectionPage.map(c -> {
            List<CollectionItemResponse> items = collectionItemRepository.findByCollectionId(c.getId()).stream()
                    .map(CollectionItemResponse::from)
                    .toList();
            return CollectionResponse.from(c, items, c.getViewCount());
        }));
    }

    @Transactional
    public CollectionResponse update(Long userId, Long collectionId, CollectionUpdateRequest request) {
        Collection collection = getOwnedCollection(collectionId, userId);
        collection.update(request.name(), request.description(), request.isPublic());
        return CollectionResponse.from(collection);
    }

    @Transactional
    public void delete(Long userId, Long collectionId) {
        Collection collection = getOwnedCollection(collectionId, userId);
        collectionViewRepository.deleteByCollectionId(collectionId);
        collectionItemRepository.deleteByCollectionId(collectionId);
        collectionRepository.delete(collection);
    }

    @Transactional
    public CollectionItemResponse addItem(Long userId, Long collectionId, CollectionItemAddRequest request) {
        Collection collection = getOwnedCollection(collectionId, userId);
        if (collectionItemRepository.existsByCollectionIdAndContentId(collectionId, request.contentId())) {
            throw new BusinessException(ErrorCode.COLLECTION_ITEM_ALREADY_EXISTS);
        }
        Content content = contentService.getEntityById(request.contentId());
        return CollectionItemResponse.from(collectionItemRepository.save(CollectionItem.create(collection, content)));
    }

    @Transactional
    public void removeItem(Long userId, Long collectionId, Long itemId) {
        getOwnedCollection(collectionId, userId);
        CollectionItem item = collectionItemRepository.findById(itemId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND));
        collectionItemRepository.delete(item);
    }

    private Collection getOwnedCollection(Long collectionId, Long userId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new BusinessException(ErrorCode.COLLECTION_NOT_FOUND));
        if (!collection.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.COLLECTION_NOT_FOUND);
        }
        return collection;
    }
}
