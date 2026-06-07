# watched

> 영화, 드라마, 애니메이션 등 다양한 OTT 콘텐츠의 시청 기록을 관리하고, 평점과 리뷰를 통해 개인 취향을 아카이빙할 수 있는 웹 서비스입니다.
> 백엔드는 직접 설계·구현했으며, 프론트엔드는AI 페어 프로그래밍으로 작업했습니다.

---

<img src="/assets/localhost_3000_ (2).png">

---

## 주요 기능

- **시청 기록** — 콘텐츠별 시청 상태(시청 중 / 완료 / 볼 예정) 관리
- **평점 & 리뷰** — 콘텐츠에 별점과 리뷰 작성, 리뷰 좋아요
- **컬렉션** — 콘텐츠를 모아 공개/비공개 컬렉션 생성, 조회수 기반 탐색
- **즐겨찾기** — 관심 콘텐츠 즐겨찾기 저장
- **TMDB 연동** — 트렌딩·인기 영화/시리즈 자동 수집, 한글 제목 검색
- **AI 챗봇** — 줄거리·장면 설명만으로 영화/시리즈 제목을 찾아주는 Claude API 기반 플로팅 챗봇
- **이메일 인증** — 회원가입 시 SMTP 기반 인증 코드 발송
- **모니터링** — Spring Boot Actuator + Prometheus + Grafana 대시보드로 API 응답시간/JVM 메트릭 실시간 관측

---

## 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| Backend | Java 21, Spring Boot 3.5.13, Spring Data JPA, Spring Security |
| Build | Gradle (Kotlin DSL) |
| Auth | JWT (jjwt 0.12.6) |
| Database | MySQL 8.0 (prod), H2 (dev) |
| Mail | Spring Boot Starter Mail (SMTP) |
| Test | JUnit 5, Spring Security Test |
| API Docs | SpringDoc OpenAPI 2.8.16 (Swagger UI) |
| Monitoring | Spring Boot Actuator, Micrometer, Prometheus, Grafana |
| Load Test | Apache JMeter |
| Frontend | Next.js 14.2 (App Router), React 18, TypeScript 5 |
| UI | Tailwind CSS 3.4, lucide-react, embla-carousel |
| State | Zustand 5 |
| HTTP | Axios (JWT interceptor) |
| External | TMDB API, Anthropic Claude API |

---

## 프로젝트 구조

```
watched/
├── backend/          # Spring Boot API 서버
│   └── src/main/
│       ├── java/com/xoxoisme/watched/
│       │   ├── global/   # SecurityConfig, 전역 예외, ApiResponse, PageResponse, AnthropicProperties
│       │   └── domain/
│       │       ├── user/        # 회원가입, 로그인, 프로필, 이메일 인증
│       │       ├── content/     # 콘텐츠 (TMDB 연동)
│       │       ├── watch/       # 시청 기록
│       │       ├── review/      # 리뷰 & 좋아요
│       │       ├── collection/  # 컬렉션 & 아이템 & 조회수 (viewCount 비정규화)
│       │       ├── chat/        # AI 챗봇 (Claude API)
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
| Actuator Health | http://localhost:8080/actuator/health |
| Prometheus 메트릭 | http://localhost:8080/actuator/prometheus |

> H2 콘솔: JDBC URL `jdbc:h2:mem:testdb` / user `sa` / 비밀번호 없음

### 모니터링 (Prometheus + Grafana)

```bash
# 프로젝트 루트에서
docker-compose -f docker-compose.monitoring.yml up -d
```

| 도구 | URL | 계정 |
|------|-----|------|
| Prometheus | http://localhost:9090 | - |
| Grafana | http://localhost:3001 | admin / admin |

Grafana에서 Data source(`http://prometheus:9090`)를 추가한 뒤 대시보드 ID `12900`(JVM Micrometer)을 import하면 응답시간·JVM 메트릭을 바로 확인할 수 있습니다.

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
| `ANTHROPIC_API_KEY` | Claude API 키 (챗봇용) |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | SMTP 계정 (이메일 인증) |
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
| Chat | `POST /api/chat` (Claude API 기반 영화/시리즈 제목 찾기) |

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

## 성능 개선 사례

### 공개 컬렉션 조회 — 메모리 Slice → DB Pageable + 비정규화

**문제**: `getPublicCollections`가 전체 데이터를 fetch한 뒤 Java 메모리에서 slice하는 구조라 데이터가 늘수록 쿼리 수가 선형으로 증가 (`2N + 1`).

**1차 개선 (Pageable 전환)**: Spring Data JPA `Pageable`로 DB 레벨 LIMIT/OFFSET 적용. 그러나 조회수 정렬이 상관 서브쿼리(`ORDER BY (SELECT COUNT...)`)로 구현되어 row마다 서브쿼리가 실행되어 Max 응답시간이 오히려 증가.

**2차 개선 (비정규화)**: `Collection` 엔티티에 `viewCount` 컬럼 추가 → 단순 `ORDER BY view_count DESC`로 인덱스 활용. `CollectionView` 테이블은 1시간 내 중복 조회 방지 용도로만 유지.

**JMeter 부하 테스트 결과 (500 threads × 5 loops)**

| 방식 | Avg | Min | Max |
|------|-----|-----|-----|
| 메모리 Slice | 10ms | 6ms | 67ms |
| Pageable + viewCount 컬럼 | **4ms** | **1ms** | 45ms |

상세 트러블슈팅은 [`trouble shooting/Slice → Pageable 전환.md`](./trouble%20shooting/Slice%20→%20Pageable%20전환.md) 참고.

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
