# watched

> 영화, 드라마, 애니메이션 등 다양한 OTT 콘텐츠의 시청 기록을 관리하고, 평점과 리뷰를 통해 개인 취향을 아카이빙할 수 있는 웹 서비스입니다.

---

<img src="/assets/스크린샷 2026-05-03.png">
<img src="/assets/스크린샷 컬렉션.png">

---

## 주요 기능

- **시청 기록** — 콘텐츠별 시청 상태(시청 중 / 완료 / 볼 예정) 관리
- **평점 & 리뷰** — 콘텐츠에 별점과 리뷰 작성, 리뷰 좋아요
- **컬렉션** — 콘텐츠를 모아 공개/비공개 컬렉션 생성, 조회수 기반 탐색
- **즐겨찾기** — 관심 콘텐츠 즐겨찾기 저장
- **TMDB 연동** — 트렌딩·인기 영화/시리즈 자동 수집, 한글 제목 검색

---

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| Backend | Java 21, Spring Boot 3.5.13, Spring Data JPA, Spring Security |
| Build | Gradle (Kotlin DSL) |
| Auth | JWT (jjwt 0.12.6) |
| Database | MySQL 8.0 (prod), H2 (dev) |
| Test | JUnit 5, Spring Security Test |
| API Docs | SpringDoc OpenAPI 2.8.16 (Swagger UI) |
| Frontend | Next.js 14.2 (App Router), React 18, TypeScript 5 |
| UI | Tailwind CSS 3.4, lucide-react, embla-carousel |
| State | Zustand 5 |
| HTTP | Axios (JWT interceptor) |
| External | TMDB API |

---

## 프로젝트 구조

```
watched/
├── backend/          # Spring Boot API 서버
│   └── src/main/
│       ├── java/com/xoxoisme/watched/
│       │   ├── global/   # SecurityConfig, 전역 예외, ApiResponse, PageResponse
│       │   └── domain/
│       │       ├── user/        # 회원가입, 로그인, 프로필
│       │       ├── content/     # 콘텐츠 (TMDB 연동)
│       │       ├── watch/       # 시청 기록
│       │       ├── review/      # 리뷰 & 좋아요
│       │       ├── collection/  # 컬렉션 & 아이템 & 조회수
│       │       └── interacton/  # rating(평점), favorite(즐겨찾기)
│       └── resources/
│           ├── application.yaml       # 공통 설정
│           ├── application-dev.yaml   # H2 (dev)
│           └── application-prod.yaml  # MySQL (prod)
└── frontend/         # Next.js 클라이언트
    └── src/
        ├── app/         # 페이지 (App Router)
        ├── components/
        ├── lib/         # api.ts(Axios+JWT), auth, content, interaction, collection, types
        └── stores/      # Zustand 전역 상태 (authStore)
```

각 도메인 패키지는 `entity/` · `controller/` · `service/` · `repository/` · `dto/(request|response)` 하위 구조를 따릅니다.

---

## 실행 방법

### Backend

```bash
cd backend

# 개발 환경 (H2 인메모리 DB)
./gradlew bootRun --args='--spring.profiles.active=dev'

# 단일 테스트 실행
./gradlew test --tests "com.xoxoisme.watched.SomeTest"

# 클린 빌드
./gradlew clean build
```

| 도구 | URL |
|------|-----|
| Swagger UI | http://localhost:8080/swagger-ui.html |
| H2 콘솔 | http://localhost:8080/h2-console |

> H2 콘솔: JDBC URL `jdbc:h2:mem:testdb` / user `sa` / 비밀번호 없음

### Frontend

```bash
cd frontend
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

### 환경 변수

민감 정보가 담긴 `application-dev.yaml`, `application-prod.yaml`, `data.sql`은 `.gitignore`로 관리됩니다. 로컬 실행 시 다음 값이 필요합니다.

| 키 | 설명 |
|----|------|
| `TMDB_API_TOKEN` | TMDB API v4 Bearer 토큰 |
| `JWT_SECRET` | JWT 서명 비밀키 (HS256, 최소 32바이트) |
| `MYSQL_*` (prod) | DB 호스트 / 사용자 / 비밀번호 |

---

## API 응답 형식

모든 컨트롤러는 `ApiResponse<T>`로 응답을 통일합니다.

```json
{
  "success": true,
  "data": { ... }
}
```

목록 조회는 `PageResponse<T>`로 페이지네이션됩니다 (기본 12개/페이지).

```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "page": 0,
    "size": 12,
    "totalPages": 3,
    "totalElements": 30
  }
}
```

---

## API 엔드포인트

| 도메인 | 주요 엔드포인트 |
|--------|----------------|
| User | `POST /api/users/signup` · `POST /api/users/login` · `POST /api/users/logout` · `GET/PUT /api/users/me` |
| Content | `GET /api/contents/trending` · `/top/movies` · `/top/tv` · `/recommendations` · `/search` · `GET /api/contents/{id}` · `/tmdb/{tmdbId}` · `POST /api/contents` |
| Watch | `POST /api/watch` · `GET /api/watch/me` · `PUT/DELETE /api/watch/{id}` |
| Review | `POST /api/reviews` · `GET /api/reviews/contents/{contentId}` · `/me` · `PUT/DELETE /api/reviews/{id}` · `POST /api/reviews/{id}/likes` |
| Collection | `POST /api/collections` · `GET /api/collections/me` · `/public?period=today\|month\|year\|all` · `GET/PUT/DELETE /api/collections/{id}` · `POST/DELETE /api/collections/{id}/items` |
| Rating | `POST /api/ratings` · `GET /api/ratings/me/contents/{contentId}` · `/contents/{contentId}` · `PUT/DELETE /api/ratings/{id}` |
| Favorite | `POST /api/favorites` · `GET /api/favorites/me` · `DELETE /api/favorites/{id}` |

---

## 페이지 목록

| 페이지 | 경로 |
|--------|------|
| 홈 (트렌딩 / 인기) | `/` |
| 로그인 / 회원가입 | `/login`, `/signup` |
| 온보딩 | `/onboarding` |
| 내 프로필 | `/me` |
| 시청 기록 | `/my/watch` |
| 내 리뷰 | `/my/reviews` |
| 즐겨찾기 | `/my/favorites` |
| 검색 | `/search` |
| 콘텐츠 상세 (TMDB) | `/contents/[tmdbId]` |
| 콘텐츠 상세 (DB) | `/contents/c/[id]` |
| 내 컬렉션 | `/collections/me` |
| 컬렉션 상세 | `/collections/[id]` |
| 공개 컬렉션 탐색 | `/collections/explore` |

---

## 커밋 컨벤션

| 타입 | 용도 |
|------|------|
| `feat` | 새로운 기능 |
| `fix` | 버그 수정 |
| `refactor` | 리팩토링 |
| `style` | 코드 스타일 / UI 스타일 |
| `docs` | 문서 |
| `test` | 테스트 |
| `chore` | 빌드 · 설정 · 자잘한 변경 |
| `perf` | 성능 개선 |

커밋 메시지는 영어로 작성하며, 한 변경 단위마다 분리해 작성합니다 (예: `feat: Add JWT filter`).
