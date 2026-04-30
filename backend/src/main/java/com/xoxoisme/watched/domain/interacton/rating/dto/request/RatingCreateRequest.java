package com.xoxoisme.watched.domain.interacton.rating.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record RatingCreateRequest(
        @NotNull Long contentId,
        @NotNull @DecimalMin("0.0") @DecimalMax("10.0") BigDecimal score
) {}
