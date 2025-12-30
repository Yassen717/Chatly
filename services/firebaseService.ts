// Firebase service temporarily disabled
// This file will be re-enabled once proper Expo Firebase configuration is set up

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

class FirebaseService {
  // Placeholder methods - to be implemented later
  async signUp(): Promise<FirebaseUser | null> {
    throw new Error('Firebase not configured yet');
  }

  async signIn(): Promise<FirebaseUser | null> {
    throw new Error('Firebase not configured yet');
  }

  async signOut(): Promise<void> {
    throw new Error('Firebase not configured yet');
  }

  async resetPassword(): Promise<void> {
    throw new Error('Firebase not configured yet');
  }

  async updateProfile(): Promise<void> {
    throw new Error('Firebase not configured yet');
  }

  getCurrentUser(): FirebaseUser | null {
    return null;
  }

  onAuthStateChanged() {
    return () => {};
  }

  isAuthenticated(): boolean {
    return false;
  }
}

export const firebaseService = new FirebaseService();
