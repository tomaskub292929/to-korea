'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase.config';
import { User, UserRole, RegisterData, LoginCredentials } from '@/lib/types';
import * as authService from '@/lib/services/authService';
import * as userService from '@/lib/services/userService';

interface AuthContextType {
  // State
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;

  // Auth methods
  register: (data: RegisterData) => Promise<void>;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;

  // Email verification
  sendVerificationEmail: () => Promise<void>;
  reloadUser: () => Promise<void>;

  // Password reset
  resetPassword: (email: string) => Promise<void>;

  // Profile management
  updateProfile: (data: Partial<User>) => Promise<void>;

  // Role checking
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in
          setFirebaseUser(firebaseUser);

          // Fetch user document from Firestore
          const userData = await userService.getUserById(firebaseUser.uid);

          if (userData) {
            // Update last login
            await userService.updateLastLogin(firebaseUser.uid);
            setUser(userData);
          } else {
            // User document doesn't exist (shouldn't happen, but handle gracefully)
            console.warn('User document not found for authenticated user');
            setUser(null);
          }
        } else {
          // User is signed out
          setUser(null);
          setFirebaseUser(null);
        }
      } catch (err: any) {
        console.error('Auth state change error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  /**
   * Register new user
   */
  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setLoading(true);

      // Create Firebase Auth user
      const userCredential = await authService.registerWithEmail(data);
      const firebaseUser = userCredential.user;

      // Create Firestore user document
      const authProvider = {
        providerId: 'password' as const,
        email: data.email,
      };

      await userService.createUser(firebaseUser.uid, {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        role: 'student', // Default role
        emailVerified: firebaseUser.emailVerified,
        authProviders: [authProvider],
      });

      // Send verification email
      await authService.sendVerificationEmail(firebaseUser);

      // Refresh user data
      const userData = await userService.getUserById(firebaseUser.uid);
      setUser(userData);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email/password
   */
  const login = async (credentials: LoginCredentials) => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await authService.loginWithEmail(credentials);
      const firebaseUser = userCredential.user;

      // Fetch user document
      const userData = await userService.getUserById(firebaseUser.uid);

      if (userData) {
        setUser(userData);
      } else {
        throw new Error('User profile not found');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout
   */
  const logout = async () => {
    try {
      setError(null);
      await authService.logout();
      setUser(null);
      setFirebaseUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Login with Google
   */
  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await authService.signInWithGoogle();
      const firebaseUser = userCredential.user;

      // Check if user document exists
      const existingUser = await userService.getUserById(firebaseUser.uid);

      if (existingUser) {
        // Existing user - update last login
        await userService.updateLastLogin(firebaseUser.uid);

        // Add Google provider if not already linked
        const googleProvider = {
          providerId: 'google.com' as const,
          email: firebaseUser.email || '',
        };
        await userService.addAuthProvider(firebaseUser.uid, googleProvider);

        setUser(existingUser);
      } else {
        // New user - create profile
        const profileData = userService.extractSocialProfile(
          firebaseUser.email || '',
          firebaseUser.displayName,
          firebaseUser.photoURL,
          'google.com'
        );

        await userService.createUser(firebaseUser.uid, {
          ...profileData,
          role: 'student',
        });

        const userData = await userService.getUserById(firebaseUser.uid);
        setUser(userData);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with Facebook
   */
  const loginWithFacebook = async () => {
    try {
      setError(null);
      setLoading(true);

      const userCredential = await authService.signInWithFacebook();
      const firebaseUser = userCredential.user;

      // Check if user document exists
      const existingUser = await userService.getUserById(firebaseUser.uid);

      if (existingUser) {
        // Existing user - update last login
        await userService.updateLastLogin(firebaseUser.uid);

        // Add Facebook provider if not already linked
        const facebookProvider = {
          providerId: 'facebook.com' as const,
          email: firebaseUser.email || '',
        };
        await userService.addAuthProvider(firebaseUser.uid, facebookProvider);

        setUser(existingUser);
      } else {
        // New user - create profile
        const profileData = userService.extractSocialProfile(
          firebaseUser.email || '',
          firebaseUser.displayName,
          firebaseUser.photoURL,
          'facebook.com'
        );

        await userService.createUser(firebaseUser.uid, {
          ...profileData,
          role: 'student',
        });

        const userData = await userService.getUserById(firebaseUser.uid);
        setUser(userData);
      }
    } catch (err: any) {
      console.error('Facebook login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Send email verification
   */
  const sendVerificationEmail = async () => {
    try {
      setError(null);
      await authService.sendVerificationEmail(firebaseUser || undefined);
    } catch (err: any) {
      console.error('Send verification email error:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Reload user (refresh emailVerified status)
   */
  const reloadUser = async () => {
    try {
      await authService.reloadUser();

      // Refresh Firestore user data
      if (firebaseUser) {
        const userData = await userService.getUserById(firebaseUser.uid);
        if (userData) {
          setUser(userData);
        }
      }
    } catch (err: any) {
      console.error('Reload user error:', err);
    }
  };

  /**
   * Send password reset email
   */
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (err: any) {
      console.error('Reset password error:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Update user profile
   */
  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);

      if (!user) {
        throw new Error('No user logged in');
      }

      await userService.updateUser(user.id, data);

      // Update local state
      setUser({ ...user, ...data });
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message);
      throw err;
    }
  };

  /**
   * Check if user has specific role
   */
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  /**
   * Check if user is admin (any admin role)
   */
  const isAdmin = (): boolean => {
    return hasAnyRole([
      'super_admin',
      'school_manager',
      'content_manager',
      'application_manager',
      'analyst',
    ]);
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    error,
    register,
    login,
    logout,
    loginWithGoogle,
    loginWithFacebook,
    sendVerificationEmail,
    reloadUser,
    resetPassword,
    updateProfile,
    hasRole,
    hasAnyRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
