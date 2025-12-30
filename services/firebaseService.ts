import auth from '@react-native-firebase/auth';
import { User } from 'firebase/auth';

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class FirebaseService {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName?: string): Promise<FirebaseUser | null> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Update profile with display name if provided
      if (displayName) {
        await user.updateProfile({ displayName });
      }

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error: any) {
      console.error('Firebase sign up error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<FirebaseUser | null> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    } catch (error: any) {
      console.error('Firebase sign in error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await auth().signOut();
    } catch (error: any) {
      console.error('Firebase sign out error:', error);
      throw error;
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error: any) {
      console.error('Firebase password reset error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Update user profile
  async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updateProfile(updates);
      }
    } catch (error: any) {
      console.error('Firebase profile update error:', error);
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  getCurrentUser(): FirebaseUser | null {
    const user = auth().currentUser;
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
    }
    return null;
  }

  // Set up auth state listener
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return auth().onAuthStateChanged((user: User | null) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        callback(null);
      }
    });
  }

  // Handle Firebase auth errors
  private handleAuthError(error: any): Error {
    const errorCode = error.code;
    
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists.');
      case 'auth/invalid-email':
        return new Error('Invalid email address.');
      case 'auth/weak-password':
        return new Error('Password is too weak.');
      case 'auth/user-not-found':
        return new Error('No account found with this email address.');
      case 'auth/wrong-password':
        return new Error('Incorrect password.');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Please try again later.');
      case 'auth/network-request-failed':
        return new Error('Network error. Please check your connection.');
      case 'auth/invalid-credential':
        return new Error('Invalid email or password.');
      default:
        return new Error(error.message || 'An authentication error occurred.');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!auth().currentUser;
  }
}

export const firebaseService = new FirebaseService();
