# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 절대 규칙

- 모킹 금지: 테스트 시 실제 동작 코드만 사용, mock 라이브러리 절대 쓰지 마세요.
- 오버엔지니어링 금지: 요청된 기능만 구현하고, 불필요한 추가 로직이나 리팩토링 피하세요.
- .env 파일 수정 금지: 환경 변수 파일 직접 변경하지 말고, 확인 후 알려주세요.
- any 타입 금지: TypeScript 사용 시 strict 모드 준수, any 타입 절대 쓰지 마세요.

## 명령어

```bash
./gradlew bootRun       # 애플리케이션 실행
./gradlew build         # 빌드 (컴파일 + 테스트)
./gradlew test          # 전체 테스트 실행
./gradlew test --tests "com.xoxoisme.watched.SomeTest"  # 단일 테스트 실행
./gradlew clean build   # 클린 후 재빌드
```

H2 콘솔: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:testdb`, user: `sa`, 비밀번호 없음)
Swagger UI: `http://localhost:8080/swagger-ui.html`

## 아키텍처

OTT 스트리밍 콘텐츠의 시청 기록, 평점, 리뷰, 컬렉션을 관리하는

**기술 스택**

Language	Java 21
Framework	Spring Boot 3.5.13, Spring Data JPA
Security	Spring Security, JWT, OAuth2 (Kakao, Naver, Google)
Database	MySQL 8.0, H2 (dev)
Test	JUnit 5, TestContainers
Docs	SpringDoc OpenAPI (Swagger)
Api     TMDB api

**패키지 구조** — 도메인 주도 설계, 도메인별 패키지:

```
com.xoxoisme.watched/
├── global/
│   ├── config/SecurityConfig.java
│   └── common/entity/
│       ├── BaseEntity.java        (id: Long, IDENTITY 전략)
│       └── BaseTimeEntity.java    (id + createdAt + updatedAt)
└── domain/
    ├── user/          (User 엔티티: email, password, nickname, birthDate, profileImageUrl)
    ├── content/       (Content 엔티티: title, poster, releaseDate, type, voteAverage — TMDB 데이터)
    ├── watch/         (Watch 엔티티: user+content+status+watchedAt)
    ├── review/        (Review 엔티티: user+content+reviewContent, user+content 유니크)
    ├── collection/    (Collection + CollectionItem 엔티티)
    └── interacton/    (오타 — 기존 패키지명 유지를 위해 그대로 둠)
        ├── rating/    (Rating 엔티티: user+content+score, user+content 유니크)
        └── favorite/  (Favorite 엔티티: user+content, user+content 유니크)
```

각 도메인 패키지는 `entity/`, `controller/`, `service/`, `repository/`, `dto/` 하위 패키지를 가집니다. 현재는 엔티티만 구현되어 있고, controller/service/repository는 스텁 상태입니다.

## 도메인 컨텍스트
- User : 사용자 프로필 관리와 인증에 초점을 둡니다.
- Content : 콘텐츠 관리(TMDB/사용자) 합니다. TMDB api에 있는 데이터를 불러옵니다. 없는 데이터는 사용자가 직접 추가할 수도 있습니다.
- Personl(Watch/Review/Rating/Favorite) : 개인 시청 기록, 리뷰, 평점, 좋아요를 관리합니다.
- Collection(CollectionItem) : 사용자 개인 공유 컬렉션 관리합니다. 

## 코딩 컨벤션
- 컴포넌트 : PascalCase (`User`)
- 유틸/훅 : CamelCase (`userId`)
- API : kebab-case (`api/order-items`)
- 커밋 메세지는 영어로 예시 형식 유지 (`feat: Add user entity`)
- 컨벤션 규칙
  - feat : 새로운 기능에 대한 커밋
  - fix : 버그 수정에 대한 커밋
  - build : 빌드 관련 파일 수정/모듈 설치 또는 삭제에 대한 커밋
  - chore : 그 외 자잘한 수정에 대한 커밋
  - docs : 문서 수정에 대한 커밋
  - style : 코드 스타일에 대한 커밋
  - refactor : 코드 리팩토링에 대한 커밋
  - test : 테스트 코드 수정에 대한 커밋
  - perf : 성능 개선에 대한 커밋

## 핵심 패턴
- 에러는 공통화 `BusinessException`, `ErrorCode`, `GlobalExceptionHandler` 로 관리합니다.