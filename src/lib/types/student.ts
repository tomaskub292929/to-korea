import { Timestamp } from 'firebase/firestore';

/**
 * StudentRecord - 학생 정보 수집용 인터페이스
 * PRD 기반: 외부 학생들로부터 정보를 수집하고 관리
 */
export interface StudentRecord {
  id: string;
  name: string;
  phone: string;
  content: string; // 기재사항 (신청 사유 등)
  createdAt: Timestamp | Date;
  updatedAt?: Timestamp | Date;
}

/**
 * 학생 정보 입력 폼 데이터
 */
export interface StudentFormData {
  name: string;
  phone: string;
  content: string;
}

/**
 * 전화번호 유효성 검사
 */
export function isValidPhone(phone: string): boolean {
  // 한국 전화번호 형식: 010-1234-5678, 01012345678, +82-10-1234-5678 등
  const phoneRegex = /^(\+82|0)[\s-]?1[0-9][\s-]?[0-9]{3,4}[\s-]?[0-9]{4}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * 필수 항목 검증
 */
export function validateStudentForm(data: StudentFormData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push('이름을 2글자 이상 입력해주세요.');
  }

  if (!data.phone || !isValidPhone(data.phone)) {
    errors.push('올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)');
  }

  if (!data.content || data.content.trim().length < 10) {
    errors.push('신청 사유를 10글자 이상 입력해주세요.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
