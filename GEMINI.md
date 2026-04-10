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

- **Monorepo**: [pnpm Workspaces](https://pnpm.io/workspaces)
- **Frontend**: [Next.js (App Router)](https://nextjs.org/)
- **Backend**: [Express.js](https://expressjs.com/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Database**: [Redis](https://redis.io/) (Upstash 등 권장)
- **Storage**: 브라우저 `localStorage` (일부 상태 저장)
- **Deployment**: [Vercel](https://vercel.com/) (통합 모노레포 배포)

## 📂 주요 파일 구조

- `apps/web/`: Next.js 기반 프론트엔드 애플리케이션
  - `app/`: 페이지 및 레이아웃 정의 (App Router)
  - `components/`: 재사용 가능한 UI 컴포넌트 및 모달
  - `lib/api.js`: 백엔드 API 통신을 위한 Fetch API 유틸리티
- `apps/api/`: Express.js 기반 백엔드 API 서버
  - `index.js`: Redis 연동 및 비즈니스 로직 (Vercel Serverless Functions)
- `pnpm-workspace.yaml`: 모노레포 워크스페이스 정의
- `vercel.json`: Vercel 통합 배포를 위한 라우팅 설정

## 🏃 실행 및 테스트

본 프로젝트는 pnpm을 사용하는 모노레포 구조입니다.

### 사전 준비
- **pnpm**: `npm install -g pnpm`으로 설치 필요
- **Redis**: 로컬 또는 원격 Redis 서버 필요

### 로컬 실행
1. 프로젝트 루트에서 의존성을 설치합니다.
   ```bash
   pnpm install
   ```
2. 프론트엔드와 백엔드를 동시에 실행합니다.
   ```bash
   pnpm dev
   ```
   - 프론트엔드: `http://localhost:3000`
   - 백엔드: `http://localhost:3001`

### 미션 테스트 (QR 코드)
- '폐배터리 수거' 미션은 URL 파라미터 `?mission=m8`을 통해 인증 로직이 트리거됩니다.

## 📝 개발 규칙 및 관례

1. **컴포넌트 기반 구조**: 모든 UI는 `apps/web/components`에서 기능별 컴포넌트로 관리합니다.
2. **상태 관리**: React의 `useState`와 `useEffect`를 사용하며, 서버 데이터는 `apps/web/lib/api.js`를 통해 동기화합니다.
3. **스타일링**: Tailwind CSS v4를 사용하여 반응형 레이아웃을 구현합니다.
4. **언어**: UI 및 소스코드 내 주석은 한국어를 기본으로 사용합니다.
5. **API 통신**: 표준 `fetch` API를 사용하여 백엔드와 통신합니다.
