package com.xoxoisme.watched.domain.content.service;

import com.xoxoisme.watched.domain.content.client.TmdbClient;
import com.xoxoisme.watched.domain.content.client.dto.TmdbTrendingResult;
import com.xoxoisme.watched.domain.content.client.dto.TmdbTvResult;
import com.xoxoisme.watched.domain.content.client.dto.request.TmdbMovieResult;
import com.xoxoisme.watched.domain.content.dto.response.TmdbSearchResponse;
import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.entity.ContentType;
import com.xoxoisme.watched.domain.content.repository.ContentRepository;
import com.xoxoisme.watched.domain.interacton.favorite.repository.FavoriteRepository;
import com.xoxoisme.watched.domain.watch.entity.WatchStatus;
import com.xoxoisme.watched.domain.watch.repository.WatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TmdbService {

    private final TmdbClient tmdbClient;
    private final ContentRepository contentRepository;
    private final FavoriteRepository favoriteRepository;
    private final WatchRepository watchRepository;

    public List<TmdbSearchResponse> search(String query, ContentType type, int page) {
        if (type == ContentType.MOVIE) {
            return tmdbClient.searchMovies(query, page).results().stream()
                    .map(this::toSearchResponse)
                    .toList();
        }
        return tmdbClient.searchTvShows(query, page).results().stream()
                .map(this::toSearchResponse)
                .toList();
    }

    public List<TmdbSearchResponse> getTrending() {
        return tmdbClient.getTrending().results().stream()
                .filter(r -> r.posterPath() != null && !r.overview().isBlank())
                .filter(r -> "movie".equals(r.mediaType()) || "tv".equals(r.mediaType()))
                .map(this::toSearchResponse)
                .toList();
    }

    public List<TmdbSearchResponse> getTopMovies() {
        return tmdbClient.getTrendingMovies().results().stream()
                .filter(r -> r.posterPath() != null)
                .limit(10)
                .map(this::toSearchResponse)
                .toList();
    }

    public List<TmdbSearchResponse> getTopTv() {
        return tmdbClient.getTrendingTv().results().stream()
                .filter(r -> r.posterPath() != null)
                .limit(10)
                .map(this::toSearchResponse)
                .toList();
    }

    public List<TmdbSearchResponse> getRecommendations(Long userId) {
        if (userId != null) {
            List<Content> seeds = new ArrayList<>();
            favoriteRepository.findByUserId(userId).stream()
                    .map(f -> f.getContent())
                    .filter(c -> c.getTmdbId() != null)
                    .forEach(seeds::add);
            watchRepository.findByUserId(userId).stream()
                    .filter(w -> w.getStatus() == WatchStatus.COMPLETED)
                    .map(w -> w.getContent())
                    .filter(c -> c.getTmdbId() != null)
                    .forEach(seeds::add);

            if (!seeds.isEmpty()) {
                Collections.shuffle(seeds);
                // 최대 3개 씨앗에서 추천을 가져와 합치고 중복 제거
                Map<Long, TmdbSearchResponse> merged = new LinkedHashMap<>();
                int seedCount = Math.min(3, seeds.size());
                for (int i = 0; i < seedCount; i++) {
                    Content seed = seeds.get(i);
                    try {
                        List<TmdbSearchResponse> recs = seed.getType() == ContentType.MOVIE
                                ? tmdbClient.getMovieRecommendations(seed.getTmdbId()).results().stream()
                                    .filter(r -> r.posterPath() != null)
                                    .map(this::toSearchResponse).toList()
                                : tmdbClient.getTvRecommendations(seed.getTmdbId()).results().stream()
                                    .filter(r -> r.posterPath() != null)
                                    .map(this::toSearchResponse).toList();
                        recs.forEach(r -> merged.putIfAbsent(r.tmdbId(), r));
                    } catch (Exception ignored) {}
                }
                if (!merged.isEmpty()) {
                    List<TmdbSearchResponse> result = new ArrayList<>(merged.values());
                    Collections.shuffle(result);
                    return result;
                }
            }
        }
        return getTrending();
    }

    @Transactional
    public Content fetchAndSave(Long tmdbId, ContentType type) {
        return contentRepository.findByTmdbId(tmdbId)
                .orElseGet(() -> contentRepository.save(fetchFromTmdb(tmdbId, type)));
    }

    private Content fetchFromTmdb(Long tmdbId, ContentType type) {
        if (type == ContentType.MOVIE) {
            TmdbMovieResult movie = tmdbClient.getMovie(tmdbId);
            return Content.ofTmdb(
                    tmdbId, movie.title(), movie.originalTitle(),
                    tmdbClient.buildImageUrl(movie.posterPath()),
                    parseDate(movie.releaseDate()), movie.overview(), movie.voteAverage(), ContentType.MOVIE
            );
        }
        TmdbTvResult tv = tmdbClient.getTvShow(tmdbId);
        return Content.ofTmdb(
                tmdbId, tv.name(), tv.originalName(),
                tmdbClient.buildImageUrl(tv.posterPath()),
                parseDate(tv.firstAirDate()), tv.overview(), tv.voteAverage(), ContentType.TV
        );
    }

    private TmdbSearchResponse toSearchResponse(TmdbMovieResult r) {
        return new TmdbSearchResponse(
                r.id(), r.title(), r.originalTitle(),
                tmdbClient.buildImageUrl(r.posterPath()),
                tmdbClient.buildBackdropUrl(r.backdropPath()),
                parseDate(r.releaseDate()), r.overview(), r.voteAverage(), ContentType.MOVIE
        );
    }

    private TmdbSearchResponse toSearchResponse(TmdbTrendingResult r) {
        boolean isMovie = "movie".equals(r.mediaType());
        return new TmdbSearchResponse(
                r.id(),
                isMovie ? r.title() : r.name(),
                isMovie ? r.originalTitle() : r.originalName(),
                tmdbClient.buildImageUrl(r.posterPath()),
                tmdbClient.buildBackdropUrl(r.backdropPath()),
                parseDate(isMovie ? r.releaseDate() : r.firstAirDate()),
                r.overview(),
                r.voteAverage(),
                isMovie ? ContentType.MOVIE : ContentType.TV
        );
    }

    private TmdbSearchResponse toSearchResponse(TmdbTvResult r) {
        return new TmdbSearchResponse(
                r.id(), r.name(), r.originalName(),
                tmdbClient.buildImageUrl(r.posterPath()),
                tmdbClient.buildBackdropUrl(r.backdropPath()),
                parseDate(r.firstAirDate()), r.overview(), r.voteAverage(), ContentType.TV
        );
    }

    private LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) return null;
        return LocalDate.parse(date);
    }
}
