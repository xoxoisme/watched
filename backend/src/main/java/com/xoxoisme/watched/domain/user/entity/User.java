package com.xoxoisme.watched.domain.user.entity;

import com.xoxoisme.watched.global.common.entity.BaseTimeEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 60)
    private String password;

    @Column(nullable = true, length = 255, name = "profile_image")
    private String profileImageUrl;

    @Column(nullable = false, length = 20)
    private String nickname;

    @Column(nullable = false, name = "birth_date")
    private LocalDate birthDate;    // TODO: 응답 포맷은 "YYYY-MM-DD" dto에서 설정

    public static User create(String email, String encodedPassword, String nickname, LocalDate birthDate) {
        User user = new User();
        user.email = email;
        user.password = encodedPassword;
        user.nickname = nickname;
        user.birthDate = birthDate;
        return user;
    }

    public void update(String nickname, String profileImageUrl) {
        this.nickname = nickname;
        this.profileImageUrl = profileImageUrl;
    }
}
