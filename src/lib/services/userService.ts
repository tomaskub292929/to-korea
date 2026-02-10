// User Service - Firestore operations for user documents
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  collection,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { User, UserRole, AuthProvider } from '@/lib/types';

const USERS_COLLECTION = 'users';

/**
 * Create a new user document in Firestore
 */
export async function createUser(
  uid: string,
  data: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);

    const userData: Partial<User> = {
      id: uid,
      email: data.email || '',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      country: data.country,
      role: data.role || 'student', // Default role
      emailVerified: data.emailVerified || false,
      ...(data.photoURL && { photoURL: data.photoURL }), // Only include if defined
      authProviders: data.authProviders || [],
      profileCompleted: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };

    await setDoc(userRef, userData);
  } catch (error: any) {
    console.error('Create user error:', error);
    throw new Error('Failed to create user profile. Please try again.');
  }
}

/**
 * Get user document by ID
 */
export async function getUserById(uid: string): Promise<User | null> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as User;
    }

    return null;
  } catch (error: any) {
    console.error('Get user error:', error);
    return null;
  }
}

/**
 * Update user document
 */
export async function updateUser(
  uid: string,
  data: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);

    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(userRef, updateData);
  } catch (error: any) {
    console.error('Update user error:', error);
    throw new Error('Failed to update user profile. Please try again.');
  }
}

/**
 * Update last login timestamp
 */
export async function updateLastLogin(uid: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      lastLoginAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Update last login error:', error);
    // Don't throw error, this is non-critical
  }
}

/**
 * Delete user document (for admin use or account deletion)
 */
export async function deleteUser(uid: string): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await deleteDoc(userRef);
  } catch (error: any) {
    console.error('Delete user error:', error);
    throw new Error('Failed to delete user. Please try again.');
  }
}

/**
 * Assign role to user (super admin only)
 */
export async function assignRole(
  userId: string,
  role: UserRole,
  assignedBy: string
): Promise<void> {
  try {
    const userRef = doc(db, USERS_COLLECTION, userId);

    await updateDoc(userRef, {
      role,
      updatedAt: new Date().toISOString(),
    });

    // Log the role assignment (optional - can be used for audit trail)
    console.log(`Role ${role} assigned to user ${userId} by ${assignedBy}`);
  } catch (error: any) {
    console.error('Assign role error:', error);
    throw new Error('Failed to assign role. Please try again.');
  }
}

/**
 * Get all users with a specific role
 */
export async function getUsersByRole(role: UserRole): Promise<User[]> {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('role', '==', role));
    const querySnapshot = await getDocs(q);

    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });

    return users;
  } catch (error: any) {
    console.error('Get users by role error:', error);
    return [];
  }
}

/**
 * Get all admin users (any admin role)
 */
export async function getAdminUsers(): Promise<User[]> {
  try {
    const adminRoles: UserRole[] = [
      'super_admin',
      'school_manager',
      'content_manager',
      'application_manager',
      'analyst',
    ];

    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('role', 'in', adminRoles));
    const querySnapshot = await getDocs(q);

    const users: User[] = [];
    querySnapshot.forEach((doc) => {
      users.push(doc.data() as User);
    });

    return users;
  } catch (error: any) {
    console.error('Get admin users error:', error);
    return [];
  }
}

/**
 * Extract profile data from social login
 */
export function extractSocialProfile(
  email: string,
  displayName: string | null,
  photoURL: string | null,
  providerId: 'google.com' | 'facebook.com'
): Partial<User> {
  // Parse display name into first and last name
  const nameParts = (displayName || email.split('@')[0]).split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const authProvider: AuthProvider = {
    providerId,
    email,
  };

  return {
    email,
    firstName,
    lastName,
    photoURL: photoURL || undefined,
    emailVerified: true, // Social logins are pre-verified
    authProviders: [authProvider],
  };
}

/**
 * Check if user document exists
 */
export async function userExists(uid: string): Promise<boolean> {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error: any) {
    console.error('User exists check error:', error);
    return false;
  }
}

/**
 * Add auth provider to existing user (for account linking)
 */
export async function addAuthProvider(
  uid: string,
  provider: AuthProvider
): Promise<void> {
  try {
    const user = await getUserById(uid);
    if (!user) {
      throw new Error('User not found');
    }

    // Check if provider already exists
    const providerExists = user.authProviders.some(
      (p) => p.providerId === provider.providerId
    );

    if (!providerExists) {
      const updatedProviders = [...user.authProviders, provider];
      await updateUser(uid, { authProviders: updatedProviders });
    }
  } catch (error: any) {
    console.error('Add auth provider error:', error);
    throw new Error('Failed to link account. Please try again.');
  }
}
