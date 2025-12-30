import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { firebaseService, FirebaseUser } from '@/services/firebaseService';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  firebaseUid: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => void;
}

// Convert Firebase user to app user
const convertFirebaseUser = (firebaseUser: any | null): User | null => {
  if (!firebaseUser) return null;

  return {
    id: firebaseUser.uid,
    firebaseUid: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    avatar: firebaseUser.photoURL || undefined,
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual Firebase authentication
          // For now, simulate successful login
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: '1',
            firebaseUid: '1',
            email,
            name: email.split('@')[0],
          };

          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Login failed' 
          });
          throw error;
        }
      },

      signup: async (name: string, email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual Firebase authentication
          // For now, simulate successful signup
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const mockUser: User = {
            id: '1',
            firebaseUid: '1',
            email,
            name,
          };

          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Signup failed' 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual Firebase signOut
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            user: null, 
            isAuthenticated: false, 
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Logout failed' 
          });
          throw error;
        }
      },

      updateUser: (userData: Partial<User>) => {
        const { user } = get();
        if (user) {
          const updatedUser = { ...user, ...userData };
          set({ user: updatedUser });
          
          // TODO: Update Firebase profile if needed
          // if (userData.name || userData.avatar) {
          //   firebaseService.updateProfile({
          //     displayName: userData.name,
          //     photoURL: userData.avatar,
          //   }).catch(error => {
          //     console.error('Failed to update Firebase profile:', error);
          //   });
          // }
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          // TODO: Replace with actual Firebase reset password
          await new Promise(resolve => setTimeout(resolve, 1000));
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.message || 'Password reset failed' 
          });
          throw error;
        }
      },

      initializeAuth: () => {
        // TODO: Set up Firebase auth state listener
        // const unsubscribe = firebaseService.onAuthStateChanged((firebaseUser) => {
        //   const user = convertFirebaseUser(firebaseUser);
        //   set({ 
        //     user, 
        //     isAuthenticated: !!firebaseUser 
        //   });
        // });

        // Store unsubscribe function for cleanup if needed
        // (set as any)._unsubscribe = unsubscribe;
        
        // For now, check if user exists in storage
        const { user } = get();
        if (user) {
          set({ isAuthenticated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user data, not auth state
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
