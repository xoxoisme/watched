package com.xoxoisme.watched.domain.user.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record SignupRequest(
        @Email @NotBlank String email,
        @NotBlank @Size(min = 8, max = 20) String password,
        @NotBlank @Size(max = 20) String nickname,
        @NotNull LocalDate birthDate
) {}
