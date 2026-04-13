# EKO-ELSA (인천서부지사 탄소중립 실천 앱)

탄소중립 실천 및 환경 보호를 위한 게임화(Gamification) 요소 기반 모바일 웹 애플리케이션(PWA)입니다.
본 프로젝트는 **Next.js (App Router)**를 기반으로 프론트엔드와 API가 통합된 모놀리식(Monolithic) 구조로 개발되었습니다.

## 🛠 로컬 개발 및 테스트 가이드

이 가이드는 로컬 환경에서 애플리케이션을 실행하고 테스트하는 방법을 설명합니다.

### 1. 사전 준비 사항
- **pnpm**: v9 이상 권장 (`npm install -g pnpm`)
- **Node.js**: v18 이상 권장
- **Redis**: 데이터 저장소로 Redis를 사용합니다. 로컬 실행을 위해 Redis 서버가 동작 중이어야 합니다. (기본 포트: 6379)

#### 방법 A: 로컬 Redis 서버 실행 (추천)
- **macOS**: 
  ```bash
  brew install redis
  brew services start redis
  ```
- **Windows (Docker 사용)**:
  ```bash
  docker run --name eko-redis -p 6379:6379 -d redis
  ```
- **Windows (WSL2)**:
  ```bash
  sudo apt update
  sudo apt install redis-server
  sudo service redis-server start
  ```

#### 방법 B: 외부 Redis 서버 사용 (Upstash 등)
`.env.local` 파일에 `REDIS_URL`을 설정하세요.
```text
REDIS_URL=redis://default:password@host:port
```

### 2. 의존성 설치
프로젝트 루트 디렉토리에서 아래 명령어를 실행합니다.
```bash
pnpm install
```

### 3. 개발 서버 실행
```bash
pnpm dev
```
- **애플리케이션 접속**: [http://localhost:3000](http://localhost:3000)
- **API 서버**: [http://localhost:3000/api](http://localhost:3000/api) (Next.js API Routes)

### 4. 주요 명령어
- `pnpm dev`: 개발 서버를 실행합니다.
- `pnpm build`: 애플리케이션을 빌드합니다.
- `pnpm start`: 빌드된 애플리케이션을 실행합니다.

---

## 📂 프로젝트 구조
- `app/`: Next.js App Router (페이지 및 API Route Handlers)
  - `api/`: 서버리스 API 엔드포인트
- `components/`: 재사용 가능한 UI 컴포넌트 및 모달
- `lib/`: Redis 클라이언트, 인증 유틸리티, API Fetcher 등 공통 로직
- `public/`: 정적 파일 (아이콘, 매니페스트 등)
- `API_SPEC.md`: API 엔드포인트 및 데이터 규격 명세서
- `GEMINI.md`: 프로젝트 상세 개요 및 아키텍처 가이드

## 🚀 배포 (Vercel)
Vercel CLI 또는 GitHub 연동을 통해 배포할 수 있습니다.
```bash
npx vercel --prod
```
*주의: Vercel 배포 시 `REDIS_URL` 환경 변수를 Vercel 대시보드에 반드시 설정해야 합니다.*
