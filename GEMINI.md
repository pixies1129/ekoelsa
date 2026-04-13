# EKO-ELSA (인천서부지사 탄소중립 실천 앱)

EKO-ELSA는 한국승강기안전공단 인천서부지사 임직원을 위한 탄소중립 실천 및 환경 보호 독려용 모바일 웹 애플리케이션(PWA)입니다. 게임화(Gamification) 요소를 도입하여 일상 속 환경 보호 활동을 재미있게 실천하고 보상을 얻을 수 있도록 설계되었습니다.

## 🚀 프로젝트 개요

- **목적**: 사무실 내 에너지 절약 및 탄소 저감 활동 활성화
- **주요 기능**:
  - **에코 미션**: 계단 이용, 다회용 컵 사용, 페이퍼리스 활동 등 일상 미션 인증
  - **캐릭터 성장**: 획득한 포인트에 따라 '나무', '북극곰', '펭귄' 캐릭터가 4단계로 성장
  - **탄소 저감 통계**: 개인 및 지사 전체의 누적 탄소 저감량을 실시간으로 확인
  - **지사 랭킹**: 지사원 간의 포인트 경쟁 및 선물 기능
  - **PWA 지원**: 모바일 홈 화면 추가 및 오프라인 접근 가능

## 🛠 기술 스택

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Backend**: Next.js API Route Handlers
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Redis](https://redis.io/) (ioredis)
- **Storage**: 브라우저 `localStorage` (일부 상태 저장)
- **Deployment**: [Vercel](https://vercel.com/) (Serverless)

## 📂 주요 파일 구조

- `app/`: 페이지 및 API Route 정의
  - `api/`: 서버리스 API 엔드포인트
- `components/`: 재사용 가능한 UI 컴포넌트 (Tabs, Modals 등)
- `lib/`: Redis 연결, 인증 로직, API 유틸리티
- `public/`: 매니페스트 및 정적 아이콘

## 🏃 실행 및 테스트

본 프로젝트는 Next.js 기반의 모놀리식 구조입니다.

### 사전 준비
- **pnpm**: `npm install -g pnpm`으로 설치 필요
- **Redis**: 로컬 또는 원격 Redis 서버 필요

### 로컬 실행
1. 프로젝트 루트에서 의존성을 설치합니다.
   ```bash
   pnpm install
   ```
2. 개발 서버를 실행합니다.
   ```bash
   pnpm dev
   ```
   - 애플리케이션: `http://localhost:3000`

### 미션 테스트 (QR 코드)
- '폐배터리 수거' 미션은 URL 파라미터 `?mission=m8`을 통해 인증 로직이 트리거됩니다.

## 📝 개발 규칙 및 관례

1. **컴포넌트 기반 구조**: 모든 UI는 `components/`에서 기능별 컴포넌트로 관리합니다.
2. **상태 관리**: React의 `useState`와 `useEffect`를 사용하며, 서버 데이터는 `lib/api.js`를 통해 동기화합니다.
3. **스타일링**: Tailwind CSS v4를 사용하여 반응형 레이아웃을 구현합니다.
4. **언어**: UI 및 소스코드 내 주석은 한국어를 기본으로 사용합니다.
5. **API 통신**: 표준 `fetch` API를 사용하여 백엔드와 통신합니다.
6. **플랜 생성 지침**: `superpowers` (TDD, plan-writing 등)를 이용한 상세 플랜 생성은 복잡한 기능 구현이나 대규모 리팩토링 시에만 사용자 확인을 거친 후 수행합니다. 단순한 버그 수정, 간단한 UI 변경 등은 플랜 생성 없이 즉시 진행합니다.
