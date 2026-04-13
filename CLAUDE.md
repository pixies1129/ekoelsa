# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EKO-ELSA는 한국승강기안전공단 인천서부지사 임직원을 위한 탄소중립 실천 게이미피케이션 모바일 웹앱(PWA)입니다. 에코 미션 인증, 캐릭터 성장, 탄소 저감 통계, 지사 랭킹 등의 기능을 제공합니다.

## Commands

```bash
pnpm install     # 의존성 설치
pnpm dev         # 개발 서버 실행 (localhost:3000)
pnpm build       # 프로덕션 빌드
pnpm start       # 프로덕션 서버 실행
npx vercel --prod  # Vercel 배포
```

## Architecture

단일 **Next.js 16** (App Router) 앱으로, 프론트엔드와 API가 하나의 프로젝트에 통합된 모놀리식 구조입니다.

### 프론트엔드 (app/)
- **단일 페이지 SPA**: `app/page.js`가 전체 앱의 진입점이며 `'use client'`로 동작
- **탭 기반 네비게이션**: `HomeTab`, `MissionsTab`, `RankingTab` (components/Tabs/)
- **모달 시스템**: 7개 모달이 `page.js`의 `modals` state 객체로 중앙 관리됨
- **API 통신**: `lib/api.js`의 `fetcher` 함수가 모든 API 호출을 처리하며, `sessionStorage`의 JWT 토큰을 자동 첨부. API 베이스 URL은 `/api` (동일 Origin)
- **인증 상태**: 토큰은 `sessionStorage(eko_token)`, 사번은 `localStorage(eko_empId)`에 저장
- **미션 완료 상태**: `localStorage(eko_todayMissions)`에 날짜별로 추적
- **QR 미션(m8)**: URL 파라미터 `?mission=m8`로 트리거되며, `page.js`의 useEffect에서 처리

### API Route Handlers (app/api/)
- Next.js Route Handlers로 구현된 서버리스 API
- **Redis** (ioredis)가 유일한 데이터 저장소 — `lib/redis.js`에서 싱글톤 클라이언트 관리
- **인증**: `lib/auth.js`의 `verifyToken`이 Authorization 헤더에서 UUID 토큰을 추출해 Redis에서 검증
- 미션 목록은 `app/api/missions/route.js`에 하드코딩

| 엔드포인트 | 설명 |
|---|---|
| `POST /api/auth/login` | 로그인, 토큰 발급 |
| `POST /api/auth/logout` | 로그아웃, 토큰 삭제 |
| `POST /api/users/onboard` | 회원가입 |
| `GET /api/users/me` | 내 프로필 조회 (인증 필요) |
| `GET /api/missions` | 미션 목록 |
| `POST /api/missions/[id]/verify` | 미션 인증 (인증 필요) |
| `GET /api/rankings` | 랭킹 조회 |
| `POST /api/points/gift` | 포인트 선물 (인증 필요) |

### Redis 키 구조
- `user:{empId}` — 사용자 정보 (hash)
- `token:{uuid}` — 인증 토큰 → empId 매핑 (24h TTL)
- `rankings` — 포인트 기반 sorted set
- `mission:limit:{empId}:{missionId}:{date}` — 일일 미션 제한 (24h TTL)
- `stats:totalCarbon` — 전체 탄소 저감량 합계

### 배포 (Vercel)
`vercel.json`에 `"framework": "nextjs"` 설정. Vercel 대시보드에서 `REDIS_URL` 환경변수 설정 필요.

## Development Notes

- 로컬 개발 시 Redis 서버가 필요합니다 (기본 `localhost:6379`)
- UI 및 코드 주석은 한국어를 기본으로 사용합니다
- Next.js 16은 최신 버전으로, 코드 작성 전 `node_modules/next/dist/docs/`의 가이드를 확인하세요 (AGENTS.md 참조)
- 아이콘은 Lucide React를 사용합니다
- **플랜 생성 지침**: `superpowers` (TDD, plan-writing 등)를 이용한 상세 플랜 생성은 복잡한 기능 구현이나 대규모 리팩토링 시에만 사용자 확인을 거친 후 수행합니다. 단순한 버그 수정, 간단한 UI 변경 등은 플랜 생성 없이 즉시 진행합니다.
