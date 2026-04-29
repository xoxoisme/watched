package com.xoxoisme.watched.domain.content.dto;

import com.xoxoisme.watched.domain.content.entity.ContentType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ContentCreateRequest(
        @NotBlank String title,
        @NotBlank String originalTitle,
        String posterPath,
        LocalDate releaseDate,
        String overview,
        @NotNull ContentType type
) {}
