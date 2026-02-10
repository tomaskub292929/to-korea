import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import type { Application, ApplicationFormData, PaymentStatus } from '../types/application';

const COLLECTION_NAME = 'applications';

// Create a new application
export async function createApplication(
  userId: string,
  schoolId: string,
  schoolName: string
): Promise<string> {
  try {
    const applicationData = {
      userId,
      schoolId,
      schoolName,
      status: 'draft',
      currentStep: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), applicationData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating application:', error);
    throw error;
  }
}

// Get application by ID
export async function getApplicationById(id: string): Promise<Application | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Application;
    }
    return null;
  } catch (error) {
    console.error('Error getting application:', error);
    throw error;
  }
}

// Get applications by user ID
export async function getApplicationsByUserId(userId: string): Promise<Application[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Application[];
  } catch (error) {
    console.error('Error getting user applications:', error);
    throw error;
  }
}

// Update application step data
export async function updateApplicationStep(
  applicationId: string,
  step: number,
  data: Partial<ApplicationFormData>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, applicationId);
    await updateDoc(docRef, {
      ...data,
      currentStep: step,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating application step:', error);
    throw error;
  }
}

// Submit application
export async function submitApplication(applicationId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, applicationId);
    await updateDoc(docRef, {
      status: 'submitted',
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    throw error;
  }
}

// Update payment status
export async function updateApplicationPayment(
  applicationId: string,
  paymentId: string,
  paymentStatus: PaymentStatus,
  paymentAmount: number
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, applicationId);
    const updateData: Record<string, unknown> = {
      paymentId,
      paymentStatus,
      paymentAmount,
      updatedAt: serverTimestamp(),
    };

    if (paymentStatus === 'completed') {
      updateData.status = 'paid';
      updateData.paidAt = serverTimestamp();
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating application payment:', error);
    throw error;
  }
}

// Get or create application for school
export async function getOrCreateApplication(
  userId: string,
  schoolId: string,
  schoolName: string
): Promise<Application> {
  try {
    // Check if draft application exists
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      where('schoolId', '==', schoolId),
      where('status', '==', 'draft')
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      return { id: existingDoc.id, ...existingDoc.data() } as Application;
    }

    // Create new application
    const newId = await createApplication(userId, schoolId, schoolName);
    const newApp = await getApplicationById(newId);

    if (!newApp) {
      throw new Error('Failed to create application');
    }

    return newApp;
  } catch (error) {
    console.error('Error getting or creating application:', error);
    throw error;
  }
}

// Generate application reference number
export function generateReferenceNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `APP-${year}-${random}`;
}

// ============================================
// Admin Functions
// ============================================

// Get all applications (for admin)
export async function getAllApplications(): Promise<Application[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Application[];
  } catch (error) {
    console.error('Error getting all applications:', error);
    throw error;
  }
}

// Update application status (for admin)
export async function updateApplicationStatus(
  applicationId: string,
  status: Application['status']
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, applicationId);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    throw error;
  }
}

// Delete application (for admin)
export async function deleteApplication(applicationId: string): Promise<void> {
  try {
    const { deleteDoc } = await import('firebase/firestore');
    const docRef = doc(db, COLLECTION_NAME, applicationId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting application:', error);
    throw error;
  }
}

// ============================================
// Real-time Subscription Functions
// ============================================

/**
 * Subscribe to real-time updates for all applications (for admin)
 * Returns an unsubscribe function
 */
export function subscribeToApplications(
  callback: (applications: Application[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Application[];
    callback(applications);
  }, (error) => {
    console.error('Error in applications subscription:', error);
  });
}

/**
 * Subscribe to real-time updates for a single application
 */
export function subscribeToApplication(
  applicationId: string,
  callback: (application: Application | null) => void
): () => void {
  const docRef = doc(db, COLLECTION_NAME, applicationId);

  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as Application);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error('Error in application subscription:', error);
  });
}

/**
 * Subscribe to real-time updates for user's applications
 */
export function subscribeToUserApplications(
  userId: string,
  callback: (applications: Application[]) => void
): () => void {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const applications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Application[];
    callback(applications);
  }, (error) => {
    console.error('Error in user applications subscription:', error);
  });
}
