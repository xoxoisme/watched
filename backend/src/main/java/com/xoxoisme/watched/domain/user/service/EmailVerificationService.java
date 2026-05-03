package com.xoxoisme.watched.domain.user.service;

import com.xoxoisme.watched.domain.user.dto.request.EmailVerifyConfirmDto;
import com.xoxoisme.watched.domain.user.dto.request.EmailVerifyRequestDto;
import com.xoxoisme.watched.global.common.exception.BusinessException;
import com.xoxoisme.watched.global.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final String CODE_PREFIX = "email:code:";
    private static final String VERIFIED_PREFIX = "email:verified:";
    private static final Duration CODE_TTL = Duration.ofMinutes(5);
    private static final Duration VERIFIED_TTL = Duration.ofMinutes(30);

    private final StringRedisTemplate redisTemplate;
    private final JavaMailSender mailSender;

    public void sendCode(EmailVerifyRequestDto dto) {
        String code = generateCode();
        redisTemplate.opsForValue().set(CODE_PREFIX + dto.email(), code, CODE_TTL);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(dto.email());
        message.setSubject("[Watched] 이메일 인증 코드");
        message.setText("인증 코드: " + code + "\n\n5분 이내에 입력해주세요.");
        mailSender.send(message);
    }

    public void confirmCode(EmailVerifyConfirmDto dto) {
        String key = CODE_PREFIX + dto.email();
        String stored = redisTemplate.opsForValue().get(key);

        if (stored == null) {
            throw new BusinessException(ErrorCode.EMAIL_VERIFY_CODE_EXPIRED);
        }
        if (!stored.equals(dto.code())) {
            throw new BusinessException(ErrorCode.EMAIL_VERIFY_CODE_INVALID);
        }

        redisTemplate.delete(key);
        redisTemplate.opsForValue().set(VERIFIED_PREFIX + dto.email(), "1", VERIFIED_TTL);
    }

    public boolean isVerified(String email) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(VERIFIED_PREFIX + email));
    }

    public void consumeVerified(String email) {
        redisTemplate.delete(VERIFIED_PREFIX + email);
    }

    private String generateCode() {
        return String.format("%06d", new SecureRandom().nextInt(1_000_000));
    }
}
