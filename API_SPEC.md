# EKO-ELSA API Specification (v1.0)

본 문서는 EKO-ELSA 서비스의 백엔드 서버 연동을 위한 API 규격을 정의합니다.

## 1. 기본 정보
- **Base URL**: `/api` (Vercel Serverless Functions 기준)
- **Content-Type**: `application/json`

---

## 2. 사용자 (User) API

### 2.1 사용자 온보딩 (등록)
- **Endpoint**: `POST /users/onboard`
- **Request Body**: `{ "userName": "이름", "charType": "type1" }`
- **Response**: `201 Created`

### 2.2 내 프로필 조회
- **Endpoint**: `GET /users/me`
- **Query Param**: `?userName=이름` (현재는 단순화를 위해 쿼리 사용)
- **Response**: `{ "userName": "이름", "points": 1250, "carbonSaved": 2.45, "charType": "type1", ... }`

---

## 3. 미션 (Mission) API

### 3.1 데일리 미션 목록 조회
- **Endpoint**: `GET /missions`
- **Response**: 미션 리스트 배열

### 3.2 미션 인증 제출
- **Endpoint**: `POST /missions/:missionId/verify`
- **Request Body**: `{ "userName": "이름", "content": "인증내용" }`
- **Response**: 업데이트된 포인트 및 탄소량

---

## 4. 랭킹 및 포인트 (Ranking) API

### 4.1 전체 랭킹 조회
- **Endpoint**: `GET /rankings`
- **Response**: 랭킹 데이터 배열

### 4.2 포인트 선물/지급
- **Endpoint**: `POST /points/gift`
- **Request Body**: `{ "from": "보내는사람", "to": "받는사람", "points": 100 }`
- **Response**: `200 OK`
