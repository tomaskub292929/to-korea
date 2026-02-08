import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { School } from '@/lib/types';

const COLLECTION_NAME = 'schools';

/**
 * Get all schools from Firestore
 */
export async function getAllSchools(): Promise<School[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy('name'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as School));
    } catch (error) {
        console.error('Error fetching schools:', error);
        throw error;
    }
}

/**
 * Get a single school by ID
 */
export async function getSchoolById(id: string): Promise<School | null> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as School;
        }
        return null;
    } catch (error) {
        console.error('Error fetching school:', error);
        throw error;
    }
}

/**
 * Create a new school
 */
export async function createSchool(school: Omit<School, 'id'>): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...school,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now(),
        });
        return docRef.id;
    } catch (error) {
        console.error('Error creating school:', error);
        throw error;
    }
}

/**
 * Update an existing school
 */
export async function updateSchool(id: string, data: Partial<School>): Promise<void> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, {
            ...data,
            updatedAt: Timestamp.now(),
        });
    } catch (error) {
        console.error('Error updating school:', error);
        throw error;
    }
}

/**
 * Delete a school
 */
export async function deleteSchool(id: string): Promise<void> {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (error) {
        console.error('Error deleting school:', error);
        throw error;
    }
}

/**
 * Subscribe to real-time updates for all schools
 * Returns an unsubscribe function
 */
export function subscribeToSchools(callback: (schools: School[]) => void): () => void {
    const q = query(collection(db, COLLECTION_NAME), orderBy('name'));

    return onSnapshot(q, (snapshot) => {
        const schools = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as School));
        callback(schools);
    }, (error) => {
        console.error('Error in schools subscription:', error);
    });
}

/**
 * Subscribe to real-time updates for a single school
 */
export function subscribeToSchool(
    id: string,
    callback: (school: School | null) => void
): () => void {
    const docRef = doc(db, COLLECTION_NAME, id);

    return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as School);
        } else {
            callback(null);
        }
    }, (error) => {
        console.error('Error in school subscription:', error);
    });
}
