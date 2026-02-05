// Firebase Authentication Service
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebase';

// Sign up with email and password
export const signUp = async (email, password, displayName = '') => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name if provided
    if (displayName) {
      await updateProfile(userCredential.user, { displayName });
    }

    return {
      success: true,
      user: userCredential.user,
      message: 'Account created successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Sign in with email and password
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    return {
      success: true,
      user: userCredential.user,
      message: 'Signed in with Google successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Sign out
export const logOut = async () => {
  try {
    await signOut(auth);
    return {
      success: true,
      message: 'Signed out successfully!'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: 'Failed to sign out'
    };
  }
};

// Reset password
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent! Check your inbox.'
    };
  } catch (error) {
    return {
      success: false,
      error: error.code,
      message: getErrorMessage(error.code)
    };
  }
};

// Listen to auth state changes
export const onAuthChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// Helper function to get user-friendly error messages
const getErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/user-disabled': 'This account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Check your connection',
    'auth/popup-closed-by-user': 'Sign-in popup was closed'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
};
