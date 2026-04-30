package com.xoxoisme.watched.domain.interacton.rating.dto.response;

import java.math.BigDecimal;

public record RatingAverageResponse(
        Long contentId,
        BigDecimal averageScore
) {}
