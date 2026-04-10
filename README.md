# EKO-ELSA (인천서부지사 탄소중립 실천 앱)

탄소중립 실천 및 환경 보호를 위한 게임화(Gamification) 요소 기반 모바일 웹 애플리케이션입니다.

## 🛠 로컬 개발 및 테스트 가이드

이 가이드는 로컬 환경에서 백엔드 API 서버와 프론트엔드를 실행하고 테스트하는 방법을 설명합니다.

### 1. 사전 준비 사항
- **Node.js**: v18 이상 권장
- **Redis**: 로컬에 Redis 서버가 실행 중이어야 합니다. (기본 포트: 6379)
  - Windows: Docker 또는 WSL2에서 Redis 실행 권장
  - macOS: `brew install redis && brew services start redis`

### 2. 의존성 설치
프로젝트 루트 디렉토리에서 아래 명령어를 실행합니다.
```bash
npm install
```

### 3. 백엔드 API 서버 실행
API 서버는 Redis와 연동되어 데이터를 저장합니다.
```bash
# 기본(localhost:6379) 연결 시
node api/index.js

# 외부 Redis 서버 연결 시
REDIS_URL=redis://user:password@host:port node api/index.js
```
- **API 주소**: [http://localhost:3000](http://localhost:3000)
- **정상 동작 확인**: [http://localhost:3000/api/missions](http://localhost:3000/api/missions) 접속 시 미션 목록이 나오는지 확인

### 4. 프론트엔드 정적 서버 실행
`index.html` 파일을 서빙하기 위해 별도의 웹 서버를 실행합니다.
```bash
# Python 사용 시
python3 -m http.server 8000

# Node.js 사용 시 (serve 패키지 등)
npx serve . -p 8000
```
- **접속 주소**: [http://localhost:8000](http://localhost:8000)

---

## 📂 프로젝트 구조
- `api/index.js`: Express & Redis 기반 백엔드 서버 (Vercel Serverless Function)
- `index.html`: 프론트엔드 메인 화면 (Tailwind CSS, Vanilla JS)
- `API_SPEC.md`: API 엔드포인트 및 데이터 규격 명세서
- `GEMINI.md`: 프로젝트 상세 개요 및 아키텍처 가이드

## 🚀 배포 (Vercel)
Vercel CLI를 사용하여 즉시 배포할 수 있습니다.
```bash
npx vercel --prod
```
*주의: Vercel 배포 시 `REDIS_URL` 환경 변수를 Vercel 대시보드에 반드시 설정해야 합니다.*
