package com.xoxoisme.watched.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())   // 개발 중이라 보안 끔
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll());  // 현재 모든 요청에 대한 접근 권한 허용
        return http.build();
    }
}
