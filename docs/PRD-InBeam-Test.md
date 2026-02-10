# PRD: InBeam Test - 한국 유학 플랫폼

## 1. 프로젝트 개요

### 1.1 프로젝트 정보
- **프로젝트명**: InBeam Test
- **버전**: 1.0.0
- **작성일**: 2026-02-09
- **기술 스택**: Next.js 16, TypeScript, Firebase (Firestore + Auth), Tailwind CSS

### 1.2 목표
외국인 학생들이 한국 대학교에 지원할 수 있는 플랫폼을 제공하고, 관리자가 모든 지원 데이터를 실시간으로 관리할 수 있는 시스템 구축

### 1.3 핵심 요구사항
1. ✅ 완벽한 페이지 라우팅 설계
2. ✅ 학생 → 학교 선택 → 지원서 작성 → 관리자 확인 플로우
3. ✅ 모든 학생 데이터가 관리자 페이지에서 확인 가능
4. ✅ 관리자/퍼블릭 페이지 완전 연동 (실시간 동기화)
5. ✅ 관리자 수정 → 퍼블릭 페이지 즉시 반영

---

## 2. 사용자 유형

| 사용자 | 역할 | 권한 |
|--------|------|------|
| **Guest** | 비로그인 방문자 | 학교 조회, 회원가입 |
| **Student** | 일반 학생 사용자 | 학교 지원, 프로필 관리, 게시판 |
| **Admin** | 관리자 | 모든 데이터 CRUD, 대시보드 |

---

## 3. 페이지 라우팅 설계 (완전판)

### 3.1 퍼블릭 페이지 (Public)

```
/                           # 홈 (랜딩 페이지)
├── /schools                # 학교 목록
│   └── /schools/[id]       # 학교 상세 페이지 (Apply Now 버튼)
├── /apply/[schoolId]       # 지원서 작성 (Step 1-3)
│   ├── /apply/[schoolId]/payment   # 결제 페이지
│   └── /apply/[schoolId]/complete  # 지원 완료
├── /profile                # 내 프로필 & 지원 내역
├── /board                  # 커뮤니티 게시판
│   └── /board/[id]         # 게시글 상세
├── /about                  # 서비스 소개
├── /faq                    # FAQ
├── /contact                # 문의하기
├── /login                  # 로그인
├── /register               # 회원가입
├── /forgot-password        # 비밀번호 찾기
├── /verify-email           # 이메일 인증
├── /terms                  # 이용약관
└── /privacy                # 개인정보처리방침
```

### 3.2 관리자 페이지 (Admin)

```
/admin                      # 대시보드 (통계 개요)
├── /admin/schools          # 학교 관리
│   ├── /admin/schools/new  # 학교 추가
│   └── /admin/schools/[id] # 학교 수정
├── /admin/applications     # 지원서 관리 ⭐
│   └── /admin/applications/[id]  # 지원서 상세
├── /admin/users            # 사용자 관리
├── /admin/reviews          # 리뷰 관리
├── /admin/content          # 콘텐츠 관리
├── /admin/analytics        # 상세 분석
└── /admin/settings         # 시스템 설정
```

---

## 4. 핵심 데이터 플로우

### 4.1 학생 지원 플로우 (메인 시나리오)

```
┌─────────────────────────────────────────────────────────────────┐
│                        학생 (Student)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 1. 홈페이지 (/)                                                   │
│    - 학교 목록 확인                                               │
│    - 검색/필터                                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 2. 학교 상세 (/schools/[id])                                      │
│    - 학교 정보 확인                                               │
│    - 프로그램, 취업률, 리뷰 확인                                    │
│    - [Apply Now] 버튼 클릭                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 3. 지원서 작성 (/apply/[schoolId])                                │
│    ┌──────────────────────────────────────────────────────────┐ │
│    │ Step 1: 개인정보                                          │ │
│    │ - 이름, 이메일, 전화번호                                    │ │
│    │ - 국적, 생년월일, 성별                                      │ │
│    └──────────────────────────────────────────────────────────┘ │
│    ┌──────────────────────────────────────────────────────────┐ │
│    │ Step 2: 학력정보                                          │ │
│    │ - 최종학력, 학교명, 전공                                    │ │
│    │ - 졸업연도, GPA, 어학시험                                   │ │
│    └──────────────────────────────────────────────────────────┘ │
│    ┌──────────────────────────────────────────────────────────┐ │
│    │ Step 3: 지원정보                                          │ │
│    │ - 희망 프로그램, 입학 학기                                  │ │
│    │ - 지원 동기                                                │ │
│    └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 4. 결제 (/apply/[schoolId]/payment)                              │
│    - 지원 수수료: $50                                            │
│    - 서류 대행: $100                                             │
│    - 프리미엄 컨설팅 (선택): $200                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│ 5. 완료 (/apply/[schoolId]/complete)                             │
│    - 지원 완료 확인                                               │
│    - 지원번호 발급                                                │
│    - 이메일 확인 안내                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Firestore (applications)                     │
│    - 실시간 데이터 저장                                           │
│    - 상태: draft → submitted → paid → under_review → accepted    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        관리자 (Admin)                            │
│ /admin/applications                                              │
│    - 실시간 지원서 목록 확인                                       │
│    - 상태 변경, 메모 추가                                         │
│    - 지원자 상세 정보 확인                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 관리자 ↔ 퍼블릭 실시간 동기화

```
┌─────────────────┐         Firestore          ┌─────────────────┐
│   Admin Page    │◄─────────────────────────►│  Public Page    │
│                 │    Real-time Sync          │                 │
│ /admin/schools  │    (onSnapshot)            │ /schools        │
│                 │                            │ /schools/[id]   │
│ - 학교 추가      │─────────────────────────►│ - 즉시 반영      │
│ - 학교 수정      │─────────────────────────►│ - 즉시 반영      │
│ - 학교 삭제      │─────────────────────────►│ - 즉시 반영      │
└─────────────────┘                            └─────────────────┘

┌─────────────────┐         Firestore          ┌─────────────────┐
│   Admin Page    │◄─────────────────────────►│  Public Page    │
│                 │    Real-time Sync          │                 │
│ /admin/reviews  │    (onSnapshot)            │ /schools/[id]   │
│                 │                            │                 │
│ - 리뷰 승인      │─────────────────────────►│ - 리뷰 표시      │
│ - 리뷰 삭제      │─────────────────────────►│ - 리뷰 숨김      │
└─────────────────┘                            └─────────────────┘
```

---

## 5. Firestore 데이터베이스 스키마

### 5.1 Collections 구조

```
firestore/
├── users/                    # 사용자 정보
│   └── {userId}/
│       ├── id: string
│       ├── email: string
│       ├── firstName: string
│       ├── lastName: string
│       ├── role: 'student' | 'admin'
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── schools/                  # 학교 정보
│   └── {schoolId}/
│       ├── id: string
│       ├── name: string
│       ├── nameRu?: string
│       ├── nameDe?: string
│       ├── country: string
│       ├── city: string
│       ├── description: string
│       ├── descriptionRu?: string
│       ├── descriptionDe?: string
│       ├── logoUrl: string
│       ├── headerImageUrl: string
│       ├── websiteUrl: string
│       ├── rating: number
│       ├── studentCount: number
│       ├── programs: string[]
│       ├── jobOpportunityLevel: 'high' | 'medium' | 'low'
│       ├── tuitionFee?: number
│       ├── applicationDeadline?: string
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── applications/             # 지원서 ⭐ (핵심)
│   └── {applicationId}/
│       ├── id: string
│       ├── userId: string
│       ├── schoolId: string
│       ├── schoolName: string
│       │
│       │ # Step 1: 개인정보
│       ├── firstName: string
│       ├── lastName: string
│       ├── email: string
│       ├── phone: string
│       ├── nationality: string
│       ├── dateOfBirth: string
│       ├── gender: 'male' | 'female' | 'other'
│       │
│       │ # Step 2: 학력정보
│       ├── educationLevel: 'high_school' | 'bachelor' | 'master' | 'phd'
│       ├── schoolNamePrevious: string
│       ├── major?: string
│       ├── graduationYear: number
│       ├── gpa?: string
│       ├── languageTest?: 'topik' | 'ielts' | 'toefl' | 'none'
│       ├── languageScore?: string
│       │
│       │ # Step 3: 지원정보
│       ├── intendedProgram: string
│       ├── intendedSemester: string
│       ├── motivation: string
│       ├── documents?: string[]
│       │
│       │ # 상태 관리
│       ├── status: ApplicationStatus
│       ├── currentStep: number (1-3)
│       │
│       │ # 결제 정보
│       ├── paymentId?: string
│       ├── paymentStatus?: PaymentStatus
│       ├── paymentAmount?: number
│       │
│       │ # 타임스탬프
│       ├── createdAt: Timestamp
│       ├── updatedAt: Timestamp
│       ├── submittedAt?: Timestamp
│       └── paidAt?: Timestamp
│
├── reviews/                  # 학교 리뷰
│   └── {reviewId}/
│       ├── id: string
│       ├── schoolId: string
│       ├── authorId: string
│       ├── authorName: string
│       ├── rating: number (1-5)
│       ├── title: string
│       ├── content: string
│       ├── pros?: string
│       ├── cons?: string
│       ├── isApproved: boolean
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
├── posts/                    # 게시판 글
│   └── {postId}/
│       ├── id: string
│       ├── authorId: string
│       ├── authorName: string
│       ├── title: string
│       ├── content: string
│       ├── category: PostCategory
│       ├── viewCount: number
│       ├── commentCount: number
│       ├── createdAt: Timestamp
│       └── updatedAt: Timestamp
│
└── comments/                 # 댓글
    └── {commentId}/
        ├── id: string
        ├── postId: string
        ├── authorId: string
        ├── authorName: string
        ├── content: string
        ├── createdAt: Timestamp
        └── updatedAt: Timestamp
```

### 5.2 상태 값 정의

```typescript
// 지원서 상태
type ApplicationStatus =
  | 'draft'         // 작성 중
  | 'submitted'     // 제출 완료
  | 'paid'          // 결제 완료
  | 'under_review'  // 검토 중
  | 'accepted'      // 합격
  | 'rejected';     // 불합격

// 결제 상태
type PaymentStatus =
  | 'pending'       // 대기
  | 'processing'    // 처리 중
  | 'completed'     // 완료
  | 'failed'        // 실패
  | 'refunded';     // 환불
```

---

## 6. 페이지별 상세 기능

### 6.1 퍼블릭 페이지

#### 홈페이지 (/)
| 기능 | 설명 | 데이터 소스 |
|------|------|-------------|
| 학교 카드 | 6개 학교 표시 | Firestore `schools` |
| 검색 | 학교명/도시/프로그램 검색 | Firestore Query |
| 통계 | 파트너 학교 수, 학생 수 | Firestore Count |

#### 학교 목록 (/schools)
| 기능 | 설명 | 데이터 소스 |
|------|------|-------------|
| 필터 | 지역, 프로그램, 취업률 | Client-side Filter |
| 정렬 | 평점, 학생수 | Client-side Sort |
| 페이지네이션 | 무한 스크롤 | Firestore Pagination |

#### 학교 상세 (/schools/[id])
| 기능 | 설명 | 데이터 소스 |
|------|------|-------------|
| 학교 정보 | 상세 정보 표시 | Firestore `schools/{id}` |
| 리뷰 목록 | 승인된 리뷰만 | Firestore `reviews` (isApproved=true) |
| 리뷰 작성 | 로그인 필요 | Firestore Create |
| Apply Now | 지원 페이지 이동 | Router Push |

#### 지원서 작성 (/apply/[schoolId])
| 기능 | 설명 | 데이터 소스 |
|------|------|-------------|
| Step 1 | 개인정보 입력 | Form → Firestore |
| Step 2 | 학력정보 입력 | Form → Firestore |
| Step 3 | 지원정보 입력 | Form → Firestore |
| 자동 저장 | 단계별 저장 | Firestore Update |
| 이어쓰기 | 기존 draft 불러오기 | Firestore Query |

#### 프로필 (/profile)
| 기능 | 설명 | 데이터 소스 |
|------|------|-------------|
| 내 정보 | 사용자 정보 표시 | Firestore `users/{id}` |
| 지원 내역 | 내 지원서 목록 | Firestore `applications` (userId) |
| 상태 확인 | 지원 상태 표시 | Real-time Update |

### 6.2 관리자 페이지

#### 대시보드 (/admin)
| 위젯 | 데이터 | 실시간 |
|------|--------|--------|
| 총 지원서 | applications count | ✅ |
| 신규 지원 (오늘) | applications (today) | ✅ |
| 대기 중 | applications (status=submitted) | ✅ |
| 총 매출 | applications (paymentStatus=completed) | ✅ |
| 최근 지원서 | applications (limit 5) | ✅ |
| 상태별 차트 | applications (group by status) | ✅ |

#### 지원서 관리 (/admin/applications) ⭐
| 기능 | 설명 | 작업 |
|------|------|------|
| 목록 보기 | 모든 지원서 테이블 | Read |
| 필터 | 상태, 학교, 날짜 | Query |
| 검색 | 이름, 이메일 | Search |
| 상세 보기 | 지원서 전체 정보 | Read |
| 상태 변경 | draft→submitted→paid... | Update |
| 삭제 | 지원서 삭제 | Delete |
| 내보내기 | CSV/Excel | Export |

#### 지원서 상세 (/admin/applications/[id])
| 섹션 | 표시 정보 |
|------|----------|
| 지원자 정보 | 이름, 이메일, 전화, 국적, 생년월일 |
| 학력 정보 | 최종학력, 학교, 전공, GPA, 어학점수 |
| 지원 정보 | 희망 프로그램, 입학 학기, 지원 동기 |
| 결제 정보 | 결제 상태, 금액, 결제일 |
| 상태 관리 | 상태 변경 드롭다운 |
| 타임라인 | 상태 변경 이력 |

#### 학교 관리 (/admin/schools)
| 기능 | 설명 | 퍼블릭 반영 |
|------|------|-------------|
| 학교 추가 | 새 학교 등록 | ✅ 즉시 |
| 학교 수정 | 정보 수정 | ✅ 즉시 |
| 학교 삭제 | 학교 삭제 | ✅ 즉시 |
| 다국어 | EN/RU/DE | ✅ 즉시 |

#### 리뷰 관리 (/admin/reviews)
| 기능 | 설명 | 퍼블릭 반영 |
|------|------|-------------|
| 리뷰 승인 | 리뷰 표시 활성화 | ✅ 즉시 (학교 상세 페이지) |
| 리뷰 거부 | 리뷰 숨김 | ✅ 즉시 |
| 리뷰 삭제 | 리뷰 완전 삭제 | ✅ 즉시 |

#### 사용자 관리 (/admin/users)
| 기능 | 설명 |
|------|------|
| 사용자 목록 | 모든 사용자 표시 |
| 역할 변경 | student ↔ admin |
| 사용자 삭제 | 계정 삭제 |

---

## 7. 실시간 동기화 구현

### 7.1 Firebase Real-time Listeners

```typescript
// 퍼블릭: 학교 목록 실시간 구독
function subscribeToSchools(callback: (schools: School[]) => void) {
  return onSnapshot(
    collection(db, 'schools'),
    (snapshot) => {
      const schools = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(schools);
    }
  );
}

// 관리자: 지원서 목록 실시간 구독
function subscribeToApplications(callback: (apps: Application[]) => void) {
  return onSnapshot(
    query(collection(db, 'applications'), orderBy('createdAt', 'desc')),
    (snapshot) => {
      const applications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(applications);
    }
  );
}
```

### 7.2 동기화 매트릭스

| Admin 작업 | Firestore | Public 반영 | 반영 시간 |
|-----------|-----------|-------------|----------|
| 학교 추가 | schools/ CREATE | 홈, 학교목록 | < 1초 |
| 학교 수정 | schools/ UPDATE | 학교상세 | < 1초 |
| 학교 삭제 | schools/ DELETE | 전체 | < 1초 |
| 리뷰 승인 | reviews/ UPDATE | 학교상세 | < 1초 |
| 지원 상태 변경 | applications/ UPDATE | 프로필 | < 1초 |

---

## 8. API/서비스 레이어

### 8.1 서비스 파일 구조

```
src/lib/services/
├── schoolService.ts      # 학교 CRUD
├── applicationService.ts # 지원서 CRUD ⭐
├── reviewService.ts      # 리뷰 CRUD
├── boardService.ts       # 게시판 CRUD
└── userService.ts        # 사용자 CRUD
```

### 8.2 핵심 서비스 함수

```typescript
// applicationService.ts

// 지원서 생성 (Student)
createApplication(userId, schoolId, schoolName): Promise<string>

// 지원서 조회 (Student - 본인 것만)
getApplicationsByUserId(userId): Promise<Application[]>

// 지원서 단계별 업데이트 (Student)
updateApplicationStep(appId, step, data): Promise<void>

// 지원서 제출 (Student)
submitApplication(appId): Promise<void>

// 모든 지원서 조회 (Admin)
getAllApplications(): Promise<Application[]>

// 지원서 상태 변경 (Admin)
updateApplicationStatus(appId, status): Promise<void>

// 지원서 삭제 (Admin)
deleteApplication(appId): Promise<void>

// 실시간 구독 (Admin)
subscribeToApplications(callback): () => void
```

---

## 9. 인증 및 권한

### 9.1 인증 방식
- Firebase Authentication
- Email/Password
- Google OAuth
- Facebook OAuth

### 9.2 권한 체크

```typescript
// AuthContext에서 제공
const { user, isAdmin } = useAuth();

// 라우트 보호
- /admin/* : isAdmin() === true 필요
- /apply/* : user !== null 필요
- /profile : user !== null 필요
```

### 9.3 Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 학교: 모두 읽기, Admin만 쓰기
    match /schools/{schoolId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // 지원서: 본인 읽기/쓰기, Admin 전체
    match /applications/{appId} {
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isAdmin();
    }

    // 리뷰: 승인된 것만 읽기, 본인 쓰기, Admin 전체
    match /reviews/{reviewId} {
      allow read: if resource.data.isApproved == true || isAdmin();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
  }
}
```

---

## 10. 배포 체크리스트

### 10.1 배포 전 확인사항

```
□ 모든 페이지 라우팅 테스트
  □ / → /schools → /schools/[id] → /apply/[schoolId]
  □ /apply/[schoolId] → /payment → /complete
  □ /admin → /admin/applications → /admin/applications/[id]

□ 데이터 플로우 테스트
  □ 학생: 학교 클릭 → 지원서 작성 → 관리자에서 확인
  □ 관리자: 학교 수정 → 퍼블릭에서 확인
  □ 관리자: 지원 상태 변경 → 학생 프로필에서 확인

□ 실시간 동기화 테스트
  □ 두 브라우저에서 동시 확인

□ 인증 테스트
  □ 비로그인 → 로그인 필요 페이지 접근 시 리다이렉트
  □ Student → Admin 페이지 접근 시 차단

□ 빌드 테스트
  □ npm run build 성공
  □ TypeScript 에러 없음
```

### 10.2 배포 명령어

```bash
# 1. 빌드 테스트
npm run build

# 2. Firebase 배포
firebase deploy

# 또는 Vercel 배포
vercel --prod
```

---

## 11. 파일 구조 (최종)

```
src/
├── app/
│   ├── page.tsx                    # 홈
│   ├── layout.tsx                  # 루트 레이아웃
│   │
│   ├── schools/
│   │   ├── page.tsx                # 학교 목록
│   │   └── [id]/page.tsx           # 학교 상세
│   │
│   ├── apply/
│   │   └── [schoolId]/
│   │       ├── page.tsx            # 지원서 작성
│   │       ├── payment/page.tsx    # 결제
│   │       └── complete/page.tsx   # 완료
│   │
│   ├── profile/page.tsx            # 프로필
│   ├── board/
│   │   ├── page.tsx                # 게시판
│   │   └── [id]/page.tsx           # 게시글 상세
│   │
│   ├── admin/
│   │   ├── page.tsx                # 대시보드
│   │   ├── schools/
│   │   │   ├── page.tsx            # 학교 관리
│   │   │   ├── new/page.tsx        # 학교 추가
│   │   │   └── [id]/page.tsx       # 학교 수정
│   │   ├── applications/
│   │   │   ├── page.tsx            # 지원서 관리 ⭐
│   │   │   └── [id]/page.tsx       # 지원서 상세
│   │   ├── users/page.tsx          # 사용자 관리
│   │   ├── reviews/page.tsx        # 리뷰 관리
│   │   ├── content/page.tsx        # 콘텐츠 관리
│   │   ├── analytics/page.tsx      # 분석
│   │   └── settings/page.tsx       # 설정
│   │
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── forgot-password/page.tsx
│   ├── verify-email/page.tsx
│   ├── about/page.tsx
│   ├── faq/page.tsx
│   ├── contact/page.tsx
│   ├── terms/page.tsx
│   └── privacy/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   └── SchoolSearch.tsx
│   ├── school/
│   │   ├── SchoolCard.tsx
│   │   ├── SchoolGrid.tsx
│   │   ├── SchoolFilter.tsx
│   │   └── SchoolReviews.tsx
│   ├── admin/
│   │   ├── layout/
│   │   │   ├── AdminLayout.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── tables/
│   │   │   └── DataTable.tsx
│   │   └── forms/
│   │       └── SchoolForm.tsx
│   ├── board/
│   │   ├── PostList.tsx
│   │   └── PostModal.tsx
│   └── ui/
│       ├── Button.tsx
│       └── Badge.tsx
│
├── lib/
│   ├── services/
│   │   ├── schoolService.ts
│   │   ├── applicationService.ts
│   │   ├── reviewService.ts
│   │   ├── boardService.ts
│   │   └── userService.ts
│   ├── types/
│   │   ├── index.ts
│   │   ├── application.ts
│   │   └── board.ts
│   ├── firebase.config.ts
│   └── utils.ts
│
├── contexts/
│   └── AuthContext.tsx
│
└── data/
    └── schools.ts                  # Mock 데이터 (폴백용)
```

---

## 12. 완료 기준

### ✅ 기능 완료 체크리스트

| 기능 | 상태 | 설명 |
|------|------|------|
| 페이지 라우팅 | ✅ | 모든 페이지 연결됨 |
| 학교 조회 | ✅ | 홈, 목록, 상세 |
| 지원서 작성 | ✅ | 3단계 폼 |
| 결제 페이지 | ✅ | 결제 연동 |
| 지원 완료 | ✅ | 완료 페이지 |
| 프로필 | ✅ | 내 지원 내역 |
| Admin 대시보드 | ✅ | 통계 표시 |
| Admin 지원서 관리 | ✅ | CRUD + 상태 변경 |
| Admin 학교 관리 | ✅ | CRUD |
| 실시간 동기화 | ✅ | Firestore onSnapshot |
| 인증/권한 | ✅ | Firebase Auth |

---

**문서 끝**
