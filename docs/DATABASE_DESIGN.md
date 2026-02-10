# Gateway to Korea - Firestore Database Design

## 📋 Overview

This document defines the complete Firestore database schema for the Gateway to Korea platform.

**Database Type:** Firebase Cloud Firestore (NoSQL Document Database)
**Project ID:** `gateway-to-korea-dd4e6`
**Region:** `asia-northeast3` (Seoul)

---

## 🗂️ Collections Overview

| Collection | Description | Document Count (Est.) |
|------------|-------------|----------------------|
| `users` | User accounts (students, admins) | 10,000+ |
| `schools` | Korean universities and institutions | 100-500 |
| `applications` | Student applications to schools | 50,000+ |
| `reviews` | School reviews from verified students | 5,000+ |
| `favorites` | User's favorite schools | 20,000+ |
| `notifications` | User notifications | 100,000+ |
| `admin_logs` | Admin action audit trail | 10,000+ |

---

## 📊 Entity Relationship Diagram (ERD)

```
┌──────────────────┐
│      users       │
│  (students/      │
│   admins)        │
└────────┬─────────┘
         │
         │ 1:N
         │
    ┌────┴────┬────────────┬───────────────┐
    │         │            │               │
    ▼         ▼            ▼               ▼
┌───────┐ ┌──────────┐ ┌──────────┐ ┌─────────────┐
│reviews│ │favorites │ │applicat- │ │notifications│
│       │ │          │ │  ions    │ │             │
└───┬───┘ └────┬─────┘ └────┬─────┘ └─────────────┘
    │          │            │
    │          │            │
    └──────────┴────────────┘
               │
               │ N:1
               ▼
        ┌──────────────┐
        │   schools    │
        └──────────────┘
```

---

## 📁 Collection: `users`

### Purpose
Stores all user accounts including students and administrators.

### Document ID
- Firebase Auth UID (e.g., `abc123XYZ...`)

### Schema

```typescript
interface User {
  // === Core Identity ===
  id: string;                    // Firebase Auth UID (same as document ID)
  email: string;                 // User email (unique)
  firstName: string;             // First name
  lastName: string;              // Last name

  // === Profile ===
  country?: string;              // Country of origin (germany, russia, etc.)
  phone?: string;                // Phone number
  photoURL?: string;             // Profile photo URL (from social login)

  educationBackground?: {
    degree: string;              // Bachelor, Master, PhD
    university: string;          // Current/previous university
    gpa?: number;                // GPA (0.0 - 4.0)
    graduationYear?: number;     // Expected graduation year
  };

  // === Auth & Permissions ===
  role: UserRole;                // User role (see below)
  emailVerified: boolean;        // Email verification status
  authProviders: AuthProvider[]; // Linked auth providers

  // === Status ===
  profileCompleted: boolean;     // Has user completed profile?
  isActive: boolean;             // Account active status

  // === Timestamps ===
  createdAt: string;             // ISO 8601 timestamp
  updatedAt?: string;            // ISO 8601 timestamp
  lastLoginAt?: string;          // ISO 8601 timestamp
}

// User Roles
type UserRole =
  | 'student'              // Default - Can view schools, apply, review
  | 'super_admin'          // Full access - Role assignment, all CRUD
  | 'school_manager'       // Schools CRUD only
  | 'content_manager'      // Reviews moderation, content editing
  | 'application_manager'  // Applications processing
  | 'analyst';             // Read-only analytics access

// Auth Provider
interface AuthProvider {
  providerId: 'password' | 'google.com' | 'facebook.com';
  email: string;
}
```

### Sample Document

```json
{
  "id": "abc123XYZ",
  "email": "anna.mueller@example.com",
  "firstName": "Anna",
  "lastName": "Mueller",
  "country": "germany",
  "phone": "+49 123 456 7890",
  "photoURL": null,
  "educationBackground": {
    "degree": "Bachelor",
    "university": "Technical University of Munich",
    "gpa": 3.7,
    "graduationYear": 2024
  },
  "role": "student",
  "emailVerified": true,
  "authProviders": [
    { "providerId": "google.com", "email": "anna.mueller@example.com" }
  ],
  "profileCompleted": true,
  "isActive": true,
  "createdAt": "2026-02-09T10:30:00Z",
  "updatedAt": "2026-02-09T12:00:00Z",
  "lastLoginAt": "2026-02-09T14:30:00Z"
}
```

### Indexes Required
- `role` + `createdAt` (for listing admins)
- `country` + `createdAt` (for analytics)
- `email` (unique constraint via Firebase Auth)

---

## 📁 Collection: `schools`

### Purpose
Stores Korean universities and educational institutions.

### Document ID
- Auto-generated Firestore ID (e.g., `Xk9f2aB3cD...`)

### Schema

```typescript
interface School {
  // === Core Identity ===
  id: string;                    // Firestore document ID
  name: string;                  // School name (Korean/English)
  nameEn?: string;               // English name
  nameRu?: string;               // Russian translation
  nameDe?: string;               // German translation

  // === Location ===
  country: 'South Korea';        // Always South Korea
  city: string;                  // City (Seoul, Busan, etc.)
  address?: string;              // Full address
  coordinates?: {
    lat: number;
    lng: number;
  };

  // === Description ===
  description: string;           // Main description (Korean/English)
  descriptionEn?: string;        // English description
  descriptionRu?: string;        // Russian translation
  descriptionDe?: string;        // German translation

  // === Programs & Stats ===
  programs: string[];            // Available programs (Medicine, AI, etc.)
  studentCount: number;          // Total student count
  internationalStudentCount?: number;

  // === Ratings & Rankings ===
  rating: number;                // Average rating (1.0 - 5.0)
  reviewCount: number;           // Total review count
  ranking?: {
    national?: number;           // National ranking
    qs?: number;                 // QS World Ranking
    times?: number;              // Times Higher Education
  };

  // === Opportunities ===
  jobOpportunityLevel: 'high' | 'medium' | 'low';
  scholarshipAvailable: boolean;
  dormitoryAvailable: boolean;

  // === Media ===
  logoUrl?: string;              // School logo URL
  headerImageUrl?: string;       // Header/banner image
  galleryUrls?: string[];        // Photo gallery

  // === Contact ===
  websiteUrl?: string;           // Official website
  admissionsEmail?: string;      // Admissions contact
  admissionsPhone?: string;

  // === Application Info ===
  tuitionFee?: {
    undergraduate?: number;      // Annual tuition (USD)
    graduate?: number;
    currency: 'USD' | 'KRW';
  };
  applicationDeadline?: string;  // Next deadline
  applicationUrl?: string;       // Direct application link

  // === Categorization ===
  region: 'seoul' | 'gyeonggi' | 'busan' | 'other';
  type: 'national' | 'private' | 'specialized';

  // === Metadata ===
  isActive: boolean;             // Show on website?
  isFeatured: boolean;           // Featured on homepage?
  oneLineFeedback?: string;      // Quick summary

  // === Timestamps ===
  createdAt: string;
  updatedAt?: string;
  createdBy: string;             // Admin user ID who created
  updatedBy?: string;            // Admin user ID who last updated
}
```

### Sample Document

```json
{
  "id": "Xk9f2aB3cD",
  "name": "서울대학교",
  "nameEn": "Seoul National University",
  "nameRu": "Сеульский национальный университет",
  "nameDe": "Seoul National Universität",
  "country": "South Korea",
  "city": "Seoul",
  "address": "1 Gwanak-ro, Gwanak-gu, Seoul",
  "coordinates": { "lat": 37.4602, "lng": 126.9526 },
  "description": "Korea's premier national research university...",
  "programs": ["Medicine", "Engineering", "Computer Science", "Business", "Law"],
  "studentCount": 28000,
  "internationalStudentCount": 4500,
  "rating": 4.7,
  "reviewCount": 234,
  "ranking": { "national": 1, "qs": 29, "times": 54 },
  "jobOpportunityLevel": "high",
  "scholarshipAvailable": true,
  "dormitoryAvailable": true,
  "logoUrl": "https://storage.../snu-logo.png",
  "headerImageUrl": "https://storage.../snu-campus.jpg",
  "websiteUrl": "https://www.snu.ac.kr",
  "tuitionFee": { "undergraduate": 4500, "graduate": 5500, "currency": "USD" },
  "applicationDeadline": "2026-05-31",
  "region": "seoul",
  "type": "national",
  "isActive": true,
  "isFeatured": true,
  "createdAt": "2026-01-15T09:00:00Z",
  "updatedAt": "2026-02-09T14:30:00Z",
  "createdBy": "admin123"
}
```

### Indexes Required
- `isActive` + `rating` DESC (for listing)
- `region` + `rating` DESC (for filtering)
- `programs` (array-contains) + `rating` DESC
- `isFeatured` + `rating` DESC (for homepage)
- `city` + `rating` DESC

---

## 📁 Collection: `applications`

### Purpose
Stores student applications to schools.

### Document ID
- Auto-generated Firestore ID

### Schema

```typescript
interface Application {
  // === Core References ===
  id: string;                    // Firestore document ID
  userId: string;                // Reference to users collection
  schoolId: string;              // Reference to schools collection

  // === Application Details ===
  program: string;               // Applied program
  intakeYear: number;            // Target enrollment year
  intakeSemester: 'spring' | 'fall';

  // === Status ===
  status: ApplicationStatus;
  statusHistory: StatusChange[];

  // === Documents ===
  documents: ApplicationDocument[];

  // === Personal Statement ===
  personalStatement?: string;    // Essay/motivation letter

  // === Admin Notes ===
  internalNotes?: string;        // For application managers
  assignedTo?: string;           // Manager handling this application

  // === Timestamps ===
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;          // When status changed to 'submitted'
  decidedAt?: string;            // When accepted/rejected
}

type ApplicationStatus =
  | 'draft'           // Started but not submitted
  | 'submitted'       // Submitted, awaiting review
  | 'under_review'    // Being reviewed by manager
  | 'documents_requested'  // Additional docs needed
  | 'accepted'        // Accepted!
  | 'rejected'        // Rejected
  | 'withdrawn';      // User withdrew application

interface StatusChange {
  status: ApplicationStatus;
  changedAt: string;
  changedBy: string;             // User ID (student or admin)
  note?: string;
}

interface ApplicationDocument {
  type: 'transcript' | 'passport' | 'photo' | 'recommendation' | 'language_cert' | 'other';
  name: string;
  url: string;                   // Firebase Storage URL
  uploadedAt: string;
  verified: boolean;             // Verified by admin?
  verifiedBy?: string;
  verifiedAt?: string;
}
```

### Sample Document

```json
{
  "id": "app123XYZ",
  "userId": "abc123XYZ",
  "schoolId": "Xk9f2aB3cD",
  "program": "Computer Science",
  "intakeYear": 2026,
  "intakeSemester": "fall",
  "status": "under_review",
  "statusHistory": [
    { "status": "draft", "changedAt": "2026-02-01T10:00:00Z", "changedBy": "abc123XYZ" },
    { "status": "submitted", "changedAt": "2026-02-05T14:30:00Z", "changedBy": "abc123XYZ" },
    { "status": "under_review", "changedAt": "2026-02-07T09:00:00Z", "changedBy": "manager456", "note": "Documents look complete" }
  ],
  "documents": [
    { "type": "transcript", "name": "transcript_2025.pdf", "url": "https://storage.../...", "uploadedAt": "2026-02-04T10:00:00Z", "verified": true, "verifiedBy": "manager456" },
    { "type": "passport", "name": "passport_scan.jpg", "url": "https://storage.../...", "uploadedAt": "2026-02-04T10:05:00Z", "verified": true }
  ],
  "personalStatement": "I have always been passionate about technology...",
  "assignedTo": "manager456",
  "createdAt": "2026-02-01T10:00:00Z",
  "updatedAt": "2026-02-07T09:00:00Z",
  "submittedAt": "2026-02-05T14:30:00Z"
}
```

### Indexes Required
- `userId` + `createdAt` DESC (user's applications)
- `schoolId` + `status` + `submittedAt` (school's applications)
- `status` + `submittedAt` DESC (admin dashboard)
- `assignedTo` + `status` + `updatedAt` (manager's queue)

---

## 📁 Collection: `reviews`

### Purpose
Stores school reviews from students.

### Document ID
- Auto-generated Firestore ID

### Schema

```typescript
interface Review {
  // === Core References ===
  id: string;
  userId: string;                // Reference to users
  schoolId: string;              // Reference to schools

  // === Review Content ===
  title: string;                 // Review title
  content: string;               // Review text
  rating: number;                // 1.0 - 5.0

  // === Detailed Ratings (Optional) ===
  ratings?: {
    academics?: number;          // 1-5
    facilities?: number;
    location?: number;
    value?: number;              // Value for money
    studentLife?: number;
  };

  // === Pros & Cons ===
  pros?: string[];               // List of positives
  cons?: string[];               // List of negatives

  // === Verification ===
  verifiedStudent: boolean;      // Verified as actual student
  verificationMethod?: 'enrollment_doc' | 'alumni_network' | 'admin_verified';

  // === Moderation ===
  isPublished: boolean;          // Visible on website
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderatedBy?: string;          // Content manager ID
  moderatedAt?: string;
  moderationNote?: string;

  // === Engagement ===
  helpfulCount: number;          // "This review was helpful" count
  reportCount: number;           // Reported as inappropriate

  // === Timestamps ===
  createdAt: string;
  updatedAt?: string;
}
```

### Sample Document

```json
{
  "id": "rev123ABC",
  "userId": "abc123XYZ",
  "schoolId": "Xk9f2aB3cD",
  "title": "Amazing experience at SNU!",
  "content": "I spent 4 years at Seoul National University and it was incredible...",
  "rating": 4.5,
  "ratings": {
    "academics": 5,
    "facilities": 4,
    "location": 5,
    "value": 4,
    "studentLife": 4
  },
  "pros": ["World-class professors", "Beautiful campus", "Great career opportunities"],
  "cons": ["Competitive environment", "Expensive housing nearby"],
  "verifiedStudent": true,
  "verificationMethod": "enrollment_doc",
  "isPublished": true,
  "moderationStatus": "approved",
  "moderatedBy": "content_manager789",
  "moderatedAt": "2026-02-10T09:00:00Z",
  "helpfulCount": 42,
  "reportCount": 0,
  "createdAt": "2026-02-08T14:30:00Z",
  "updatedAt": "2026-02-08T14:30:00Z"
}
```

### Indexes Required
- `schoolId` + `isPublished` + `createdAt` DESC (school's reviews)
- `userId` + `createdAt` DESC (user's reviews)
- `moderationStatus` + `createdAt` DESC (moderation queue)
- `schoolId` + `isPublished` + `rating` DESC (highest rated)

---

## 📁 Collection: `favorites`

### Purpose
Stores user's favorite/saved schools.

### Document ID
- Composite: `{userId}_{schoolId}` (prevents duplicates)

### Schema

```typescript
interface Favorite {
  id: string;                    // {userId}_{schoolId}
  userId: string;                // Reference to users
  schoolId: string;              // Reference to schools

  // === Optional Notes ===
  note?: string;                 // User's private note about this school
  tags?: string[];               // User's tags (e.g., "top choice", "backup")

  // === Timestamps ===
  createdAt: string;
}
```

### Sample Document

```json
{
  "id": "abc123XYZ_Xk9f2aB3cD",
  "userId": "abc123XYZ",
  "schoolId": "Xk9f2aB3cD",
  "note": "My top choice - great CS program!",
  "tags": ["top choice", "applied"],
  "createdAt": "2026-02-05T10:00:00Z"
}
```

### Indexes Required
- `userId` + `createdAt` DESC (user's favorites list)

---

## 📁 Collection: `notifications`

### Purpose
Stores user notifications.

### Document ID
- Auto-generated Firestore ID

### Schema

```typescript
interface Notification {
  id: string;
  userId: string;                // Recipient user

  // === Notification Content ===
  type: NotificationType;
  title: string;
  message: string;

  // === Related Entity ===
  relatedType?: 'application' | 'review' | 'school';
  relatedId?: string;

  // === Status ===
  isRead: boolean;
  readAt?: string;

  // === Timestamps ===
  createdAt: string;
  expiresAt?: string;            // Auto-delete after this date
}

type NotificationType =
  | 'application_status'         // Your application status changed
  | 'application_reminder'       // Deadline reminder
  | 'review_approved'            // Your review was approved
  | 'review_rejected'            // Your review was rejected
  | 'new_school_added'           // New school matching your interests
  | 'system_announcement';       // Platform announcements
```

### Sample Document

```json
{
  "id": "notif123",
  "userId": "abc123XYZ",
  "type": "application_status",
  "title": "Application Update",
  "message": "Your application to Seoul National University has been accepted! 🎉",
  "relatedType": "application",
  "relatedId": "app123XYZ",
  "isRead": false,
  "createdAt": "2026-02-10T09:00:00Z"
}
```

### Indexes Required
- `userId` + `isRead` + `createdAt` DESC (unread notifications)
- `userId` + `createdAt` DESC (all notifications)

---

## 📁 Collection: `admin_logs`

### Purpose
Audit trail for admin actions.

### Document ID
- Auto-generated Firestore ID

### Schema

```typescript
interface AdminLog {
  id: string;

  // === Who ===
  adminId: string;               // Admin user ID
  adminEmail: string;            // For quick reference
  adminRole: UserRole;           // Role at time of action

  // === What ===
  action: AdminAction;
  targetCollection: string;      // 'users', 'schools', etc.
  targetId: string;              // Document ID affected

  // === Details ===
  description: string;           // Human-readable description
  changes?: {                    // What changed (for updates)
    field: string;
    oldValue: any;
    newValue: any;
  }[];

  // === Context ===
  ipAddress?: string;
  userAgent?: string;

  // === Timestamps ===
  createdAt: string;
}

type AdminAction =
  | 'create'
  | 'update'
  | 'delete'
  | 'role_change'
  | 'review_moderate'
  | 'application_status_change'
  | 'user_ban'
  | 'user_unban';
```

### Sample Document

```json
{
  "id": "log123",
  "adminId": "admin456",
  "adminEmail": "admin@gatewaytokorea.com",
  "adminRole": "super_admin",
  "action": "role_change",
  "targetCollection": "users",
  "targetId": "user789",
  "description": "Changed user role from 'student' to 'school_manager'",
  "changes": [
    { "field": "role", "oldValue": "student", "newValue": "school_manager" }
  ],
  "createdAt": "2026-02-10T10:30:00Z"
}
```

### Indexes Required
- `adminId` + `createdAt` DESC (admin's activity)
- `targetCollection` + `targetId` + `createdAt` DESC (document history)
- `action` + `createdAt` DESC (filter by action type)

---

## 🔐 Security Rules Summary

| Collection | Read | Create | Update | Delete |
|------------|------|--------|--------|--------|
| `users` | Own + Admins | Auth + Own | Own (except role) | Super Admin |
| `schools` | Public | School Manager + | School Manager + | Super Admin |
| `applications` | Own + Admins | Auth + Own | Own (draft) / Manager | Super Admin |
| `reviews` | Public (published) | Auth (verified) | Own + Content Manager | Content Manager + |
| `favorites` | Own | Auth + Own | Own | Own |
| `notifications` | Own | System only | Own (isRead) | Own |
| `admin_logs` | Admins | System only | Never | Never |

(+ means "and Super Admin")

---

## 📏 Data Validation Rules

### String Length Limits
| Field | Min | Max |
|-------|-----|-----|
| `firstName`, `lastName` | 1 | 50 |
| `email` | 5 | 255 |
| `school.name` | 2 | 200 |
| `school.description` | 50 | 5000 |
| `review.title` | 5 | 200 |
| `review.content` | 50 | 5000 |
| `application.personalStatement` | 100 | 10000 |

### Number Constraints
| Field | Min | Max |
|-------|-----|-----|
| `rating` | 1.0 | 5.0 |
| `gpa` | 0.0 | 4.0 |
| `studentCount` | 0 | 1000000 |
| `tuitionFee.undergraduate` | 0 | 100000 |

---

## 🔄 Denormalization Strategy

For performance, some data is denormalized:

### In `applications`:
- Store `schoolName` for quick display (update via Cloud Function if school name changes)

### In `reviews`:
- Store `userName` (first name only) for display
- Store `schoolName` for quick display

### In `schools`:
- `reviewCount` and `rating` are updated via Cloud Functions when reviews are added/updated

---

## 📈 Scalability Considerations

1. **Sharding:** Not needed for initial scale (< 100k users)

2. **Subcollections:** Consider moving to subcollections if:
   - User has > 1000 applications → `users/{userId}/applications`
   - School has > 10000 reviews → `schools/{schoolId}/reviews`

3. **Pagination:** Always use cursor-based pagination with `startAfter()`

4. **Caching:** Use React Query or SWR for client-side caching

---

## 🗓️ Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-09 | Initial design |

---

## ✅ Checklist for Implementation

- [ ] Create all collections in Firebase Console
- [ ] Deploy security rules (`firestore.rules`)
- [ ] Deploy indexes (`firestore.indexes.json`)
- [ ] Create Cloud Functions for denormalized data updates
- [ ] Set up backup schedule
- [ ] Configure monitoring and alerts
