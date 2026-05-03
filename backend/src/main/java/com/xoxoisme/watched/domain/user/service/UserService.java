package com.xoxoisme.watched.domain.user.service;

import com.xoxoisme.watched.domain.user.dto.request.LoginRequest;
import com.xoxoisme.watched.domain.user.dto.request.SignupRequest;
import com.xoxoisme.watched.domain.user.dto.request.UserUpdateRequest;
import com.xoxoisme.watched.domain.user.dto.response.TokenResponse;
import com.xoxoisme.watched.domain.user.dto.response.UserProfileResponse;
import com.xoxoisme.watched.domain.user.entity.User;
import com.xoxoisme.watched.domain.user.repository.UserRepository;
import com.xoxoisme.watched.global.common.exception.BusinessException;
import com.xoxoisme.watched.global.common.exception.ErrorCode;
import com.xoxoisme.watched.global.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailVerificationService emailVerificationService;

    public UserProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        return UserProfileResponse.from(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
        user.update(request.nickname(), request.profileImageUrl());
        return UserProfileResponse.from(user);
    }

    @Transactional
    public void signup(SignupRequest request) {
        if (!emailVerificationService.isVerified(request.email())) {
            throw new BusinessException(ErrorCode.EMAIL_NOT_VERIFIED);
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }
        if (userRepository.existsByNickname(request.nickname())) {
            throw new BusinessException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        User user = User.create(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname(),
                request.birthDate()
        );
        userRepository.save(user);
        emailVerificationService.consumeVerified(request.email());
    }

    public TokenResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BusinessException(ErrorCode.INVALID_INPUT_VALUE);
        }

        return new TokenResponse(jwtTokenProvider.generateToken(user.getId()));
    }
}
