package com.xoxoisme.watched.domain.review.service;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.review.dto.request.ReviewCreateRequest;
import com.xoxoisme.watched.domain.review.dto.request.ReviewUpdateRequest;
import com.xoxoisme.watched.domain.review.dto.response.ReviewResponse;
import com.xoxoisme.watched.domain.review.entity.Review;
import com.xoxoisme.watched.domain.review.repository.ReviewRepository;
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
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ContentService contentService;

    @Transactional
    public ReviewResponse create(Long userId, ReviewCreateRequest request) {
        if (reviewRepository.existsByUserIdAndContentId(userId, request.contentId())) {
            throw new BusinessException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        Content content = contentService.getEntityById(request.contentId());
        return ReviewResponse.from(reviewRepository.save(Review.create(user, content, request.reviewContent())));
    }

    public List<ReviewResponse> getByContent(Long contentId) {
        return reviewRepository.findByContentId(contentId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    public List<ReviewResponse> getMyReviews(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(ReviewResponse::from)
                .toList();
    }

    @Transactional
    public ReviewResponse update(Long userId, Long reviewId, ReviewUpdateRequest request) {
        Review review = getOwnedReview(reviewId, userId);
        review.update(request.reviewContent());
        return ReviewResponse.from(review);
    }

    @Transactional
    public void delete(Long userId, Long reviewId) {
        reviewRepository.delete(getOwnedReview(reviewId, userId));
    }

    private Review getOwnedReview(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));
        if (!review.getUser().getId().equals(userId)) {
            throw new BusinessException(ErrorCode.REVIEW_NOT_FOUND);
        }
        return review;
    }
}
