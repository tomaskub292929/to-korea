import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import type { StudentRecord, StudentFormData } from '../types/student';

const COLLECTION_NAME = 'students';

// ============================================
// Public Functions (로그인 불필요)
// ============================================

/**
 * 새 학생 정보 등록 (퍼블릭)
 */
export async function createStudentRecord(data: StudentFormData): Promise<string> {
  try {
    const studentData = {
      name: data.name.trim(),
      phone: data.phone.trim(),
      content: data.content.trim(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), studentData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating student record:', error);
    throw new Error('학생 정보 등록에 실패했습니다. 다시 시도해주세요.');
  }
}

// ============================================
// Admin Functions (관리자 전용)
// ============================================

/**
 * 모든 학생 목록 조회 (관리자)
 */
export async function getAllStudents(): Promise<StudentRecord[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as StudentRecord[];
  } catch (error) {
    console.error('Error getting all students:', error);
    throw new Error('학생 목록을 불러오는데 실패했습니다.');
  }
}

/**
 * 특정 학생 정보 조회 (관리자)
 */
export async function getStudentById(id: string): Promise<StudentRecord | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as StudentRecord;
    }
    return null;
  } catch (error) {
    console.error('Error getting student:', error);
    throw new Error('학생 정보를 불러오는데 실패했습니다.');
  }
}

/**
 * 학생 정보 수정 (관리자)
 */
export async function updateStudent(
  id: string,
  data: Partial<StudentFormData>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const updateData: Record<string, unknown> = {
      updatedAt: serverTimestamp(),
    };

    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.phone !== undefined) updateData.phone = data.phone.trim();
    if (data.content !== undefined) updateData.content = data.content.trim();

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating student:', error);
    throw new Error('학생 정보 수정에 실패했습니다.');
  }
}

/**
 * 학생 정보 삭제 (관리자)
 */
export async function deleteStudent(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting student:', error);
    throw new Error('학생 정보 삭제에 실패했습니다.');
  }
}

// ============================================
// Real-time Subscription Functions
// ============================================

/**
 * 실시간 학생 목록 구독 (관리자)
 */
export function subscribeToStudents(
  callback: (students: StudentRecord[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const students = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as StudentRecord[];
      callback(students);
    },
    (error) => {
      console.error('Error in students subscription:', error);
    }
  );
}

/**
 * 특정 학생 실시간 구독 (관리자)
 */
export function subscribeToStudent(
  id: string,
  callback: (student: StudentRecord | null) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, id);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as StudentRecord);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error in student subscription:', error);
    }
  );
}
