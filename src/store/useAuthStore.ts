import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, LoginCredentials, User } from '../types/auth.types';

// Mock login
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

// 🔹 Tipo de registro COMPLETO
interface RegisterData {
  username: string;
  password: string;
  companyName: string;
  email: string;
  publicIP: string;
  cidr: string;
  domain: string;
  subdomain: string;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
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

          if (credentials.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          } else {
            localStorage.removeItem('rememberMe');
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
          set({ error: message, isLoading: false });
        }
      },

      // 🔹 REGISTRO COMPLETO
      register: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const userData = { ...data };

          console.log('Registro terminado con los datos:', userData);

          set({ isLoading: false });
          return true;
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : 'Error en el registro';
          set({ error: message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        localStorage.removeItem('rememberMe');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'cybershield-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' && localStorage.getItem('rememberMe') === 'true'
          ? localStorage
          : sessionStorage,
      ),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
