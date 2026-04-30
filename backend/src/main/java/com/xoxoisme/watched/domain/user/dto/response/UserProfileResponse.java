package com.xoxoisme.watched.domain.user.dto.response;

import com.xoxoisme.watched.domain.user.entity.User;

import java.time.LocalDate;

public record UserProfileResponse(
        Long id,
        String email,
        String nickname,
        String profileImageUrl,
        LocalDate birthDate
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getNickname(),
                user.getProfileImageUrl(),
                user.getBirthDate()
        );
    }
}
