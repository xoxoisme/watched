package com.xoxoisme.watched.domain.content.repository;

import com.xoxoisme.watched.domain.content.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ContentRepository extends JpaRepository<Content, Long> {
    Optional<Content> findByTmdbId(Long tmdbId);
}
