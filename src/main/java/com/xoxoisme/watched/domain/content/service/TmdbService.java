package com.xoxoisme.watched.domain.content.service;

import com.xoxoisme.watched.domain.content.client.TmdbClient;
import com.xoxoisme.watched.domain.content.client.dto.TmdbMovieResult;
import com.xoxoisme.watched.domain.content.client.dto.TmdbTvResult;
import com.xoxoisme.watched.domain.content.dto.TmdbSearchResponse;
import com.xoxoisme.watched.domain.content.entity.Content;
import com.xoxoisme.watched.domain.content.entity.ContentType;
import com.xoxoisme.watched.domain.content.repository.ContentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TmdbService {

    private final TmdbClient tmdbClient;
    private final ContentRepository contentRepository;

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
                parseDate(r.releaseDate()), r.overview(), r.voteAverage(), ContentType.MOVIE
        );
    }

    private TmdbSearchResponse toSearchResponse(TmdbTvResult r) {
        return new TmdbSearchResponse(
                r.id(), r.name(), r.originalName(),
                tmdbClient.buildImageUrl(r.posterPath()),
                parseDate(r.firstAirDate()), r.overview(), r.voteAverage(), ContentType.TV
        );
    }

    private LocalDate parseDate(String date) {
        if (date == null || date.isBlank()) return null;
        return LocalDate.parse(date);
    }
}
