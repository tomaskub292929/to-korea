import { Timestamp } from 'firebase/firestore';

// Application Status
export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'paid'
  | 'under_review'
  | 'accepted'
  | 'rejected';

// Payment Status
export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'refunded';

// Education Level
export type EducationLevel =
  | 'high_school'
  | 'bachelor'
  | 'master'
  | 'phd';

// Language Test
export type LanguageTest =
  | 'topik'
  | 'ielts'
  | 'toefl'
  | 'none';

// Gender
export type Gender = 'male' | 'female' | 'other';

// Payment Method
export type PaymentMethod = 'card' | 'paypal' | 'bank_transfer';

// Currency
export type Currency = 'USD' | 'KRW';

// Application Interface
export interface Application {
  id: string;

  // Relations
  userId: string;
  schoolId: string;
  schoolName: string;

  // Personal Info (Step 1)
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  gender: Gender;

  // Education Info (Step 2)
  educationLevel: EducationLevel;
  schoolNamePrevious: string;
  major?: string;
  graduationYear: number;
  gpa?: string;
  languageTest?: LanguageTest;
  languageScore?: string;

  // Application Info (Step 3)
  intendedProgram: string;
  intendedSemester: string;
  motivation: string;
  documents?: string[];

  // Status
  status: ApplicationStatus;
  currentStep: number;

  // Payment
  paymentId?: string;
  paymentStatus?: PaymentStatus;
  paymentAmount?: number;

  // Timestamps
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  submittedAt?: Timestamp | Date;
  paidAt?: Timestamp | Date;
}

// Payment Interface
export interface Payment {
  id: string;
  applicationId: string;
  userId: string;

  // Payment Info
  amount: number;
  currency: Currency;
  method: PaymentMethod;

  // Line Items
  items: PaymentItem[];

  // Stripe Info
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;

  // Status
  status: PaymentStatus;

  // Promo
  promoCode?: string;
  discountAmount?: number;

  // Receipt
  receiptUrl?: string;

  // Timestamps
  createdAt: Timestamp | Date;
  completedAt?: Timestamp | Date;
}

export interface PaymentItem {
  name: string;
  description: string;
  amount: number;
  quantity: number;
}

// Form Step Data Types
export interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  dateOfBirth: string;
  gender: Gender;
}

export interface EducationData {
  educationLevel: EducationLevel;
  schoolNamePrevious: string;
  major?: string;
  graduationYear: number;
  gpa?: string;
  languageTest?: LanguageTest;
  languageScore?: string;
}

export interface ProgramData {
  intendedProgram: string;
  intendedSemester: string;
  motivation: string;
}

// Combined Form Data
export interface ApplicationFormData extends PersonalInfoData, EducationData, ProgramData {}

// Nationality Options
export const NATIONALITIES = [
  { value: 'uzbekistan', label: "O'zbekiston / Uzbekistan" },
  { value: 'russia', label: 'Россия / Russia' },
  { value: 'kazakhstan', label: 'Қазақстан / Kazakhstan' },
  { value: 'china', label: '中国 / China' },
  { value: 'vietnam', label: 'Việt Nam / Vietnam' },
  { value: 'mongolia', label: 'Монгол / Mongolia' },
  { value: 'kyrgyzstan', label: 'Кыргызстан / Kyrgyzstan' },
  { value: 'tajikistan', label: 'Тоҷикистон / Tajikistan' },
  { value: 'turkmenistan', label: 'Türkmenistan' },
  { value: 'other', label: 'Other' },
];

// Education Level Options
export const EDUCATION_LEVELS = [
  { value: 'high_school', label: '고등학교 졸업 / High School' },
  { value: 'bachelor', label: '학사 / Bachelor\'s Degree' },
  { value: 'master', label: '석사 / Master\'s Degree' },
  { value: 'phd', label: '박사 / Ph.D.' },
];

// Language Test Options
export const LANGUAGE_TESTS = [
  { value: 'none', label: '없음 / None' },
  { value: 'topik', label: 'TOPIK (한국어능력시험)' },
  { value: 'ielts', label: 'IELTS' },
  { value: 'toefl', label: 'TOEFL' },
];

// Semester Options
export const SEMESTERS = [
  { value: '2026-fall', label: '2026년 가을학기 / Fall 2026' },
  { value: '2027-spring', label: '2027년 봄학기 / Spring 2027' },
  { value: '2027-fall', label: '2027년 가을학기 / Fall 2027' },
  { value: '2028-spring', label: '2028년 봄학기 / Spring 2028' },
];

// Graduation Year Options
export const GRADUATION_YEARS = Array.from({ length: 20 }, (_, i) => {
  const year = 2026 - i;
  return { value: year, label: year.toString() };
});

// Payment Items
export const PAYMENT_ITEMS: PaymentItem[] = [
  {
    name: '지원 수수료',
    description: 'Application Processing Fee',
    amount: 50,
    quantity: 1,
  },
  {
    name: '서류 대행',
    description: 'Document Translation & Processing',
    amount: 100,
    quantity: 1,
  },
];

export const PREMIUM_CONSULTING: PaymentItem = {
  name: '프리미엄 컨설팅',
  description: '1:1 Admission Consulting (Optional)',
  amount: 200,
  quantity: 1,
};
