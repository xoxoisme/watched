package com.xoxoisme.watched.domain.interacton.favorite.service;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.interacton.favorite.dto.request.FavoriteCreateRequest;
import com.xoxoisme.watched.domain.interacton.favorite.dto.response.FavoriteResponse;
import com.xoxoisme.watched.domain.interacton.favorite.entity.Favorite;
import com.xoxoisme.watched.domain.interacton.favorite.repository.FavoriteRepository;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.domain.user.repository.UserRepository;
import com.xoxoisme.watched.global.common.exception.BusinessException;
import com.xoxoisme.watched.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ContentService contentService;

    @Transactional
    public FavoriteResponse create(Long userId, FavoriteCreateRequest request) {
        if (favoriteRepository.existsByUserIdAndContentId(userId, request.contentId())) {
            throw new BusinessException(ErrorCode.FAVORITE_ALREADY_EXISTS);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Content content = contentService.getEntityById(request.contentId());
        return FavoriteResponse.from(favoriteRepository.save(Favorite.create(user, content)));
    }

    public List<FavoriteResponse> getMyFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    @Transactional
    public void delete(Long userId, Long favoriteId) {
        Favorite favorite = favoriteRepository.findById(favoriteId)
                .orElseThrow(() -> new BusinessException(ErrorCode.FAVORITE_NOT_FOUND));
        if (!favorite.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.FAVORITE_NOT_FOUND);
        }
        favoriteRepository.delete(favorite);
    }
}
