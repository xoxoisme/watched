package com.xoxoisme.watched.global.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "tmdb")
public record TmdbProperties(String accessToken, String imageBaseUrl) {}
