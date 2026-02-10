import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    setDoc,
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
        const q = query(collection(db, COLLECTION_NAME));
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
 * Falls back to mock data if not found in Firestore
 */
export async function getSchoolById(id: string): Promise<School | null> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as School;
        }

        // Fallback to mock data if not found in Firestore
        const { mockSchools } = await import('@/data/schools');
        const mockSchool = mockSchools.find(s => s.id === id);
        if (mockSchool) {
            return mockSchool;
        }

        return null;
    } catch (error) {
        console.error('Error fetching school:', error);
        // Fallback to mock data on error
        try {
            const { mockSchools } = await import('@/data/schools');
            const mockSchool = mockSchools.find(s => s.id === id);
            return mockSchool || null;
        } catch {
            return null;
        }
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
    const q = query(collection(db, COLLECTION_NAME));

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
 * Falls back to mock data if not found in Firestore
 */
export function subscribeToSchool(
    id: string,
    callback: (school: School | null) => void
): () => void {
    const docRef = doc(db, COLLECTION_NAME, id);

    return onSnapshot(docRef, async (docSnap) => {
        if (docSnap.exists()) {
            callback({ id: docSnap.id, ...docSnap.data() } as School);
        } else {
            // Fallback to mock data if not found in Firestore
            const { mockSchools } = await import('@/data/schools');
            const mockSchool = mockSchools.find(s => s.id === id);
            callback(mockSchool || null);
        }
    }, async (error) => {
        console.error('Error in school subscription:', error);
        // Fallback to mock data on error
        const { mockSchools } = await import('@/data/schools');
        const mockSchool = mockSchools.find(s => s.id === id);
        callback(mockSchool || null);
    });
}

/**
 * Initialize Firestore with mock data (one-time setup)
 * Preserves original school IDs for consistent routing
 */
export async function initializeSchoolsFromMock(): Promise<number> {
    try {
        const { mockSchools } = await import('@/data/schools');
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));

        if (!snapshot.empty) {
            console.log('Schools already exist in Firestore');
            return 0;
        }

        console.log('Initializing schools from mock data...');
        let count = 0;

        for (const school of mockSchools) {
            const { id, ...schoolData } = school;
            // Use setDoc with original ID to preserve consistent routing
            const docRef = doc(db, COLLECTION_NAME, id);
            await setDoc(docRef, {
                ...schoolData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
            count++;
        }

        console.log(`Initialized ${count} schools in Firestore`);
        return count;
    } catch (error) {
        console.error('Error initializing schools:', error);
        throw error;
    }
}

/**
 * Re-initialize schools (force reset with original IDs)
 */
export async function resetSchoolsFromMock(): Promise<number> {
    try {
        const { mockSchools } = await import('@/data/schools');

        // Delete all existing schools
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        for (const docSnap of snapshot.docs) {
            await deleteDoc(doc(db, COLLECTION_NAME, docSnap.id));
        }

        console.log('Re-initializing schools from mock data...');
        let count = 0;

        for (const school of mockSchools) {
            const { id, ...schoolData } = school;
            const docRef = doc(db, COLLECTION_NAME, id);
            await setDoc(docRef, {
                ...schoolData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
            count++;
        }

        console.log(`Re-initialized ${count} schools in Firestore`);
        return count;
    } catch (error) {
        console.error('Error re-initializing schools:', error);
        throw error;
    }
}
