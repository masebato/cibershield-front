import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, LoginCredentials, User } from '../types/auth.types';

// TODO: Replace mock login with real API call via api.ts service
async function mockLogin(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (credentials.password !== 'admin123') {
    throw new Error('Invalid credentials. Please check your email and password.');
  }

  return {
    token: 'mock-jwt-token-' + Date.now(),
    user: {
      id: '1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
      role: 'admin',
    },
  };
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { user, token } = await mockLogin(credentials);
          const storage = credentials.rememberMe ? localStorage : sessionStorage;
          storage.setItem('auth_token', token);
          set({ user, token, isAuthenticated: true, isLoading: false });
        } catch (err) {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
          set({ error: message, isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        sessionStorage.removeItem('auth_token');
        set({ user: null, token: null, isAuthenticated: false, error: null });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cybershield-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
