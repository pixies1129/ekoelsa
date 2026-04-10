# EKO-ELSA (인천서부지사 탄소중립 실천 앱)

탄소중립 실천 및 환경 보호를 위한 게임화(Gamification) 요소 기반 모바일 웹 애플리케이션입니다.
본 프로젝트는 **Next.js (프론트엔드)**와 **Express.js (백엔드)**를 포함하는 **pnpm 모노레포** 구조로 재구성되었습니다.

## 🛠 로컬 개발 및 테스트 가이드

이 가이드는 로컬 환경에서 백엔드 API 서버와 프론트엔드를 실행하고 테스트하는 방법을 설명합니다.

### 1. 사전 준비 사항
- **pnpm**: v9 이상 권장 (`npm install -g pnpm`)
- **Node.js**: v18 이상 권장
- **Redis**: 로컬 환경에서 백엔드 API가 동작하려면 Redis 서버가 실행 중이어야 합니다. (기본 포트: 6379)

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
이미 사용 중인 원격 Redis 서버가 있다면 `apps/api/.env` 파일에 `REDIS_URL`을 설정하세요.
```text
REDIS_URL=redis://default:password@host:port
```

### 2. 의존성 설치
프로젝트 루트 디렉토리에서 아래 명령어를 실행합니다.
```bash
pnpm install
```

### 3. 개발 서버 실행
프론트엔드(`apps/web`)와 백엔드(`apps/api`)를 동시에 실행합니다.
```bash
pnpm dev
```
- **프론트엔드 (Next.js)**: [http://localhost:3000](http://localhost:3000)
- **백엔드 (API)**: [http://localhost:3001](http://localhost:3001)

### 4. 주요 명령어
- `pnpm dev`: 모든 워크스페이스의 개발 서버를 실행합니다.
- `pnpm build`: 모든 워크스페이스를 빌드합니다.
- `pnpm --filter web dev`: 프론트엔드 개발 서버만 실행합니다.
- `pnpm --filter api dev`: 백엔드 개발 서버만 실행합니다.

---

## 📂 프로젝트 구조
- `apps/web/`: Next.js (App Router), Tailwind CSS 기반 프론트엔드
- `apps/api/`: Express & Redis 기반 백엔드 API 서버 (Vercel Serverless Function)
- `API_SPEC.md`: API 엔드포인트 및 데이터 규격 명세서
- `GEMINI.md`: 프로젝트 상세 개요 및 아키텍처 가이드
- `pnpm-workspace.yaml`: 모노레포 워크스페이스 설정

## 🚀 배포 (Vercel)
Vercel CLI를 사용하여 모노레포 전체를 배포할 수 있습니다.
```bash
npx vercel --prod
```
*주의: Vercel 배포 시 `REDIS_URL` 환경 변수를 Vercel 대시보드에 반드시 설정해야 합니다.*
*프론트엔드의 `NEXT_PUBLIC_API_URL`은 배포된 API 주소로 설정해야 합니다.*
