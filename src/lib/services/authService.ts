// Authentication Service - Firebase Auth operations
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { auth } from '@/lib/firebase.config';
import { RegisterData, LoginCredentials } from '@/lib/types';

// Error messages mapping
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered. Please login instead.',
  'auth/invalid-email': 'Invalid email address format.',
  'auth/weak-password': 'Password should be at least 8 characters long.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/popup-closed-by-user': 'Sign-in popup was closed. Please try again.',
  'auth/popup-blocked': 'Popup was blocked by browser. Please allow popups for this site.',
  'auth/account-exists-with-different-credential': 'An account already exists with this email using a different sign-in method.',
};

export function getAuthErrorMessage(errorCode: string): string {
  return AUTH_ERROR_MESSAGES[errorCode] || 'An unexpected error occurred. Please try again.';
}

/**
 * Register new user with email and password
 */
export async function registerWithEmail(data: RegisterData): Promise<UserCredential> {
  try {
    const { email, password, firstName, lastName } = data;

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`,
    });

    return userCredential;
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Login with email and password
 */
export async function loginWithEmail(
  credentials: LoginCredentials
): Promise<UserCredential> {
  try {
    const { email, password, rememberMe } = credentials;

    // Set persistence based on "Remember me" checkbox
    const persistence = rememberMe
      ? browserLocalPersistence  // Persist across browser sessions
      : browserSessionPersistence; // Only for current session

    await setPersistence(auth, persistence);

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error('Failed to logout. Please try again.');
  }
}

/**
 * Send email verification to current user
 */
export async function sendVerificationEmail(user?: FirebaseUser): Promise<void> {
  try {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    }

    await sendEmailVerification(currentUser, {
      url: `${window.location.origin}/login`, // Redirect after verification
    });
  } catch (error: any) {
    console.error('Send verification email error:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email, {
      url: `${window.location.origin}/login`, // Redirect after reset
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');

    // Try popup first, fallback to redirect if popup is blocked
    try {
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential;
    } catch (popupError: any) {
      if (popupError.code === 'auth/popup-blocked') {
        // Fallback to redirect method
        await signInWithRedirect(auth, provider);
        throw new Error('Redirecting to Google sign-in...');
      }
      throw popupError;
    }
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Sign in with Facebook
 */
export async function signInWithFacebook(): Promise<UserCredential> {
  try {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    provider.addScope('public_profile');

    // Try popup first, fallback to redirect if popup is blocked
    try {
      const userCredential = await signInWithPopup(auth, provider);
      return userCredential;
    } catch (popupError: any) {
      if (popupError.code === 'auth/popup-blocked') {
        // Fallback to redirect method
        await signInWithRedirect(auth, provider);
        throw new Error('Redirecting to Facebook sign-in...');
      }
      throw popupError;
    }
  } catch (error: any) {
    console.error('Facebook sign-in error:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

/**
 * Get current Firebase user
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * Check if user's email is verified
 */
export function isEmailVerified(): boolean {
  return auth.currentUser?.emailVerified || false;
}

/**
 * Reload user data (useful after email verification)
 */
export async function reloadUser(): Promise<void> {
  try {
    if (auth.currentUser) {
      await auth.currentUser.reload();
    }
  } catch (error: any) {
    console.error('Reload user error:', error);
  }
}
