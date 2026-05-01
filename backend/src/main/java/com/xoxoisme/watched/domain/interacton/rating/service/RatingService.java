package com.xoxoisme.watched.domain.interacton.rating.service;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.interacton.rating.dto.request.RatingCreateRequest;
import com.xoxoisme.watched.domain.interacton.rating.dto.request.RatingUpdateRequest;
import com.xoxoisme.watched.domain.interacton.rating.dto.response.RatingAverageResponse;
import com.xoxoisme.watched.domain.interacton.rating.dto.response.RatingResponse;
import com.xoxoisme.watched.domain.interacton.rating.entity.Rating;
import com.xoxoisme.watched.domain.interacton.rating.repository.RatingRepository;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.domain.user.repository.UserRepository;
import com.xoxoisme.watched.global.common.exception.BusinessException;
import com.xoxoisme.watched.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {

    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;
    private final ContentService contentService;

    @Transactional
    public RatingResponse create(Long userId, RatingCreateRequest request) {
        if (ratingRepository.existsByUserIdAndContentId(userId, request.contentId())) {
            throw new BusinessException(ErrorCode.RATING_ALREADY_EXISTS);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Content content = contentService.getEntityById(request.contentId());
        return RatingResponse.from(ratingRepository.save(Rating.create(user, content, request.score())));
    }

    public RatingResponse getMyRatingForContent(Long userId, Long contentId) {
        return ratingRepository.findByUserIdAndContentId(userId, contentId)
                .map(RatingResponse::from)
                .orElse(null);
    }

    public RatingAverageResponse getAverageByContent(Long contentId) {
        BigDecimal avg = ratingRepository.findAverageScoreByContentId(contentId)
                .orElse(BigDecimal.ZERO);
        return new RatingAverageResponse(contentId, avg);
    }

    @Transactional
    public RatingResponse update(Long userId, Long ratingId, RatingUpdateRequest request) {
        Rating rating = getOwnedRating(ratingId, userId);
        rating.update(request.score());
        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long userId, Long ratingId) {
        ratingRepository.delete(getOwnedRating(ratingId, userId));
    }

    private Rating getOwnedRating(Long ratingId, Long userId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new BusinessException(ErrorCode.RATING_NOT_FOUND));
        if (!rating.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.RATING_NOT_FOUND);
        }
        return rating;
    }
}
