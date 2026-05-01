package com.xoxoisme.watched.domain.review.service;

import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.service.ContentService;
import com.xoxoisme.watched.domain.review.dto.request.ReviewCreateRequest;
import com.xoxoisme.watched.domain.review.dto.request.ReviewUpdateRequest;
import com.xoxoisme.watched.domain.review.dto.response.ReviewLikeResponse;
import com.xoxoisme.watched.domain.review.dto.response.ReviewResponse;
import com.xoxoisme.watched.domain.review.entity.Review;
import com.xoxoisme.watched.domain.review.entity.ReviewLike;
import com.xoxoisme.watched.domain.review.repository.ReviewLikeRepository;
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
    private final ReviewLikeRepository reviewLikeRepository;
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
        Review saved = reviewRepository.save(Review.create(user, content, request.reviewContent()));
        return toResponse(saved, userId);
    }

    public List<ReviewResponse> getByContent(Long contentId, Long userId) {
        return reviewRepository.findByContentId(contentId).stream()
                .map(r -> toResponse(r, userId))
                .toList();
    }

    public List<ReviewResponse> getMyReviews(Long userId) {
        return reviewRepository.findByUserId(userId).stream()
                .map(r -> toResponse(r, userId))
                .toList();
    }

    @Transactional
    public ReviewResponse update(Long userId, Long reviewId, ReviewUpdateRequest request) {
        Review review = getOwnedReview(reviewId, userId);
        review.update(request.reviewContent());
        return toResponse(review, userId);
    }

    @Transactional
    public void delete(Long userId, Long reviewId) {
        reviewRepository.delete(getOwnedReview(reviewId, userId));
    }

    @Transactional
    public ReviewLikeResponse toggleLike(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new BusinessException(ErrorCode.REVIEW_NOT_FOUND));

        boolean alreadyLiked = reviewLikeRepository.existsByUserIdAndReviewId(userId, reviewId);
        if (alreadyLiked) {
            reviewLikeRepository.findByUserIdAndReviewId(userId, reviewId)
                    .ifPresent(reviewLikeRepository::delete);
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
            reviewLikeRepository.save(ReviewLike.create(user, review));
        }

        long likeCount = reviewLikeRepository.countByReviewId(reviewId);
        return new ReviewLikeResponse(likeCount, !alreadyLiked);
    }

    private ReviewResponse toResponse(Review review, Long userId) {
        long likeCount = reviewLikeRepository.countByReviewId(review.getId());
        boolean likedByMe = userId != null && reviewLikeRepository.existsByUserIdAndReviewId(userId, review.getId());
        return ReviewResponse.from(review, likeCount, likedByMe);
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
