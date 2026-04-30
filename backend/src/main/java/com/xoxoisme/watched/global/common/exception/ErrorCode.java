package com.xoxoisme.watched.global.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // ========== Common ==========
    INVALID_INPUT_VALUE("C001", HttpStatus.BAD_REQUEST, "잘못된 입력값입니다."),
    RESOURCE_NOT_FOUND("C002", HttpStatus.NOT_FOUND, "요청한 리소스를 찾을 수 없습니다."),
    INTERNAL_SERVER_ERROR("C003", HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다."),

    // ========== User ==========
    USER_NOT_FOUND("U001", HttpStatus.NOT_FOUND, "존재하지 않는 사용자입니다."),
    EMAIL_ALREADY_EXISTS("U002", HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
    NICKNAME_ALREADY_EXISTS("U003", HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다."),

    // ========== Content ==========
    CONTENT_NOT_FOUND("CT001", HttpStatus.NOT_FOUND, "존재하지 않는 콘텐츠입니다."),

    // ========== Watch ==========
    WATCH_NOT_FOUND("W001", HttpStatus.NOT_FOUND, "시청 기록을 찾을 수 없습니다."),
    WATCH_ALREADY_EXISTS("W002", HttpStatus.CONFLICT, "이미 등록된 시청 기록입니다."),

    // ========== Review ==========
    REVIEW_NOT_FOUND("RV001", HttpStatus.NOT_FOUND, "존재하지 않는 리뷰입니다."),
    REVIEW_ALREADY_EXISTS("RV002", HttpStatus.CONFLICT, "이미 작성한 리뷰가 있습니다."),

    // ========== Rating ==========
    RATING_NOT_FOUND("RT001", HttpStatus.NOT_FOUND, "존재하지 않는 평점입니다."),
    RATING_ALREADY_EXISTS("RT002", HttpStatus.CONFLICT, "이미 등록한 평점이 있습니다."),

    // ========== Favorite ==========
    FAVORITE_NOT_FOUND("FV001", HttpStatus.NOT_FOUND, "즐겨찾기를 찾을 수 없습니다."),
    FAVORITE_ALREADY_EXISTS("FV002", HttpStatus.CONFLICT, "이미 즐겨찾기에 추가된 콘텐츠입니다."),

    // ========== Collection ==========
    COLLECTION_NOT_FOUND("CL001", HttpStatus.NOT_FOUND, "존재하지 않는 컬렉션입니다."),
    COLLECTION_ITEM_ALREADY_EXISTS("CL002", HttpStatus.CONFLICT, "이미 컬렉션에 추가된 콘텐츠입니다.");

    private final String code;
    private final HttpStatus status;
    private final String message;
}
