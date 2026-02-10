# Firebase Console Setup Guide
## Gateway to Korea - Complete Firebase Configuration

이 가이드는 Gateway to Korea 프로젝트의 Firebase 설정을 처음부터 끝까지 안내합니다.

---

## 목차

1. [Firebase 프로젝트 생성](#1-firebase-프로젝트-생성)
2. [Authentication 설정](#2-authentication-설정)
3. [Firestore Database 설정](#3-firestore-database-설정)
4. [Storage 설정](#4-storage-설정)
5. [보안 규칙 배포](#5-보안-규칙-배포)
6. [인덱스 배포](#6-인덱스-배포)
7. [첫 번째 Super Admin 설정](#7-첫-번째-super-admin-설정)
8. [이메일 템플릿 커스터마이징](#8-이메일-템플릿-커스터마이징)
9. [프로덕션 체크리스트](#9-프로덕션-체크리스트)

---

## 1. Firebase 프로젝트 생성

### 1.1 새 프로젝트 만들기

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. **"프로젝트 추가"** 클릭
3. 프로젝트 이름 입력: `gateway-to-korea` (또는 원하는 이름)
4. Google Analytics 활성화 (권장)
5. **"프로젝트 만들기"** 클릭

### 1.2 웹 앱 등록

1. 프로젝트 개요 → **"</>"** (웹) 아이콘 클릭
2. 앱 닉네임: `Gateway to Korea Web`
3. **"Firebase Hosting 설정"** 체크 (선택사항)
4. **"앱 등록"** 클릭
5. Firebase SDK 설정 정보 복사:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

### 1.3 환경 변수 설정

`.env.local` 파일 생성:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
```

---

## 2. Authentication 설정

### 2.1 이메일/비밀번호 인증 활성화

1. Firebase Console → **Authentication** → **Sign-in method** 탭
2. **"이메일/비밀번호"** 클릭
3. **"사용 설정"** 토글 ON
4. **"저장"** 클릭

### 2.2 Google 로그인 활성화

1. **Sign-in method** 탭 → **"Google"** 클릭
2. **"사용 설정"** 토글 ON
3. **프로젝트 지원 이메일** 선택 (본인 이메일)
4. **"저장"** 클릭

> Google 로그인은 Firebase에서 가장 쉽게 설정할 수 있습니다.

### 2.3 Facebook 로그인 활성화

Facebook 로그인은 추가 설정이 필요합니다:

#### Step 1: Facebook 개발자 앱 생성
1. [Facebook Developers](https://developers.facebook.com/) 접속
2. **"내 앱"** → **"앱 만들기"**
3. 앱 유형: **"소비자"** 선택
4. 앱 이름: `Gateway to Korea`
5. 앱 생성 완료

#### Step 2: Facebook 로그인 설정
1. 앱 대시보드 → **"제품 추가"** → **"Facebook 로그인"** → **"설정"**
2. **설정** → **기본 설정**에서:
   - **앱 ID** 복사
   - **앱 시크릿 코드** 복사 (보기 클릭)

#### Step 3: Firebase에 Facebook 연결
1. Firebase Console → **Authentication** → **Sign-in method**
2. **"Facebook"** 클릭
3. **"사용 설정"** 토글 ON
4. Facebook에서 복사한 **앱 ID**와 **앱 시크릿** 입력
5. **OAuth 리디렉션 URI** 복사 (형식: `https://your-project.firebaseapp.com/__/auth/handler`)
6. **"저장"** 클릭

#### Step 4: Facebook에 리디렉션 URI 등록
1. Facebook Developers → 앱 → **Facebook 로그인** → **설정**
2. **유효한 OAuth 리디렉션 URI**에 Firebase URI 붙여넣기
3. **변경 내용 저장**

### 2.4 승인된 도메인 설정

1. Firebase Console → **Authentication** → **Settings** 탭
2. **"승인된 도메인"** 섹션
3. 프로덕션 도메인 추가:
   - `gatewaytokorea.com`
   - `www.gatewaytokorea.com`
   - Vercel 도메인: `your-app.vercel.app`

---

## 3. Firestore Database 설정

### 3.1 데이터베이스 생성

1. Firebase Console → **Firestore Database**
2. **"데이터베이스 만들기"** 클릭
3. **"프로덕션 모드에서 시작"** 선택 (권장)
4. 위치 선택:
   - 한국 사용자 대상: `asia-northeast3` (서울)
   - 글로벌 서비스: `asia-northeast1` (도쿄) 또는 `us-central1`
5. **"사용 설정"** 클릭

### 3.2 초기 컬렉션 구조 확인

Firestore는 스키마리스이므로 컬렉션이 자동 생성됩니다.
데이터 구조는 `docs/DATABASE_DESIGN.md` 참조.

---

## 4. Storage 설정

### 4.1 Storage 활성화

1. Firebase Console → **Storage**
2. **"시작하기"** 클릭
3. 보안 규칙 확인 후 **"다음"**
4. 위치 선택 (Firestore와 동일 권장)
5. **"완료"** 클릭

### 4.2 Storage 보안 규칙

Storage → **Rules** 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 프로필 이미지
    match /users/{userId}/profile/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024 // 5MB
                   && request.resource.contentType.matches('image/.*');
    }

    // 학교 이미지 (관리자만)
    match /schools/{schoolId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && get(/databases/(default)/documents/users/$(request.auth.uid)).data.role
                      in ['super_admin', 'school_manager'];
    }

    // 지원서 문서
    match /applications/{applicationId}/documents/{fileName} {
      allow read: if request.auth != null
                  && (resource.metadata.userId == request.auth.uid
                      || get(/databases/(default)/documents/users/$(request.auth.uid)).data.role
                         in ['super_admin', 'application_manager']);
      allow write: if request.auth != null
                   && request.resource.metadata.userId == request.auth.uid
                   && request.resource.size < 10 * 1024 * 1024; // 10MB
    }
  }
}
```

---

## 5. 보안 규칙 배포

### 5.1 Firebase CLI 설치

```bash
npm install -g firebase-tools
```

### 5.2 Firebase 로그인 및 초기화

```bash
firebase login
firebase init
```

초기화 시 선택:
- Firestore: Yes
- Storage: Yes
- 기존 프로젝트 선택: `gateway-to-korea`

### 5.3 보안 규칙 배포

```bash
# Firestore 규칙만 배포
firebase deploy --only firestore:rules

# Storage 규칙만 배포
firebase deploy --only storage:rules

# 모두 배포
firebase deploy --only firestore:rules,storage:rules
```

---

## 6. 인덱스 배포

### 6.1 인덱스 배포

```bash
firebase deploy --only firestore:indexes
```

### 6.2 인덱스 빌드 확인

1. Firebase Console → **Firestore** → **인덱스** 탭
2. 모든 인덱스가 **"사용 설정됨"** 상태인지 확인
3. 빌드 중인 인덱스는 몇 분 소요될 수 있음

---

## 7. 첫 번째 Super Admin 설정

### 중요: 첫 번째 Super Admin은 수동 설정 필요

새 사용자는 항상 `student` 역할로 생성됩니다. 첫 번째 Super Admin은 수동으로 설정해야 합니다.

### 7.1 관리자 계정 생성

1. 앱에서 일반 회원가입 진행 (이메일/비밀번호)
2. 이메일 인증 완료

### 7.2 Firebase Console에서 역할 변경

1. Firebase Console → **Authentication** → **Users** 탭
2. 해당 사용자의 **UID** 복사

3. Firebase Console → **Firestore Database**
4. `users` 컬렉션 → 해당 UID 문서 클릭
5. `role` 필드를 `"student"`에서 `"super_admin"`으로 변경
6. **"업데이트"** 클릭

### 7.3 세션 갱신

1. 앱에서 로그아웃
2. 다시 로그인
3. 이제 관리자 대시보드에 접근 가능

---

## 8. 이메일 템플릿 커스터마이징

### 8.1 이메일 템플릿 수정

1. Firebase Console → **Authentication** → **Templates** 탭
2. 각 템플릿 수정:

#### 이메일 인증 (Email Verification)

```
제목: Gateway to Korea - 이메일 인증

본문:
안녕하세요,

Gateway to Korea에 가입해 주셔서 감사합니다.
아래 링크를 클릭하여 이메일 주소를 인증해 주세요:

%LINK%

이 링크는 1시간 후 만료됩니다.

감사합니다,
Gateway to Korea 팀
```

#### 비밀번호 재설정 (Password Reset)

```
제목: Gateway to Korea - 비밀번호 재설정

본문:
안녕하세요,

비밀번호 재설정을 요청하셨습니다.
아래 링크를 클릭하여 새 비밀번호를 설정해 주세요:

%LINK%

이 링크는 1시간 후 만료됩니다.
요청하신 적이 없다면 이 이메일을 무시하세요.

감사합니다,
Gateway to Korea 팀
```

### 8.2 커스텀 도메인 이메일 발신자 (선택사항)

1. **Settings** → **Email Templates**
2. **"커스텀 도메인에서 보내기"** 설정
3. DNS 레코드 추가 필요 (SPF, DKIM)

---

## 9. 프로덕션 체크리스트

### 필수 확인 사항

- [ ] **환경 변수**: `.env.local` 설정 완료 (절대 Git에 커밋하지 않음)
- [ ] **Authentication**:
  - [ ] 이메일/비밀번호 인증 활성화
  - [ ] Google 로그인 활성화
  - [ ] Facebook 로그인 활성화 (선택)
  - [ ] 승인된 도메인 추가 (프로덕션 URL)
- [ ] **Firestore**:
  - [ ] 프로덕션 모드로 생성
  - [ ] 보안 규칙 배포 (`firestore.rules`)
  - [ ] 인덱스 배포 (`firestore.indexes.json`)
- [ ] **Storage**:
  - [ ] 활성화
  - [ ] 보안 규칙 설정
- [ ] **Super Admin**:
  - [ ] 첫 번째 관리자 계정 수동 설정
- [ ] **이메일 템플릿**:
  - [ ] 인증/재설정 이메일 커스터마이징

### 보안 점검

- [ ] 임시 테스트 규칙 제거 (2026년 3월 11일 만료 규칙)
- [ ] API 키 제한 설정 (Google Cloud Console)
- [ ] Firestore 규칙 테스트 (Firebase Emulator 사용)
- [ ] 프로덕션 환경에서 인증 흐름 테스트

### 모니터링 설정

1. Firebase Console → **Performance** (성능 모니터링)
2. Firebase Console → **Crashlytics** (오류 추적)
3. Firebase Console → **Analytics** (사용자 분석)

---

## 문제 해결

### 자주 발생하는 문제

#### 1. "Firebase App named '[DEFAULT]' already exists"
```javascript
// firebase.config.ts에서 중복 초기화 방지
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
```

#### 2. Google 로그인 팝업이 차단됨
- 브라우저 팝업 차단 해제
- 또는 `signInWithRedirect()` 사용

#### 3. Facebook 로그인 에러
- OAuth 리디렉션 URI 확인
- 앱이 개발 모드인 경우 테스터 계정 추가 필요

#### 4. Firestore 권한 거부
- 보안 규칙 확인
- 사용자 인증 상태 확인
- 역할(role) 필드 값 확인

#### 5. 인덱스 오류
- Firebase Console에서 제안된 인덱스 링크 클릭
- 또는 `firestore.indexes.json` 업데이트 후 배포

---

## 명령어 참고

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 초기화
firebase init

# 규칙 배포
firebase deploy --only firestore:rules
firebase deploy --only storage:rules

# 인덱스 배포
firebase deploy --only firestore:indexes

# 에뮬레이터 실행 (로컬 테스트)
firebase emulators:start

# 전체 배포
firebase deploy
```

---

## 추가 리소스

- [Firebase 공식 문서](https://firebase.google.com/docs)
- [Firestore 보안 규칙 가이드](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication 가이드](https://firebase.google.com/docs/auth/web/start)
- [Firebase Emulator Suite](https://firebase.google.com/docs/emulator-suite)

---

*마지막 업데이트: 2026-02-09*
