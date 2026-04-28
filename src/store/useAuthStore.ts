import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuthState, LoginCredentials, User } from '../types/auth.types';
import { loginRequest, registerRequest } from '../api/auth';
import { data } from 'react-router-dom';

// Mock login
// async function mockLogin(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
//   await new Promise((resolve) => setTimeout(resolve, 1000));

//   if (credentials.password !== 'admin123') {
//     throw new Error('Invalid credentials. Please check your email and password.');
//   }

//   return {
//     token: 'mock-jwt-token-' + Date.now(),
//     user: {
//       id: '1',
//       email: credentials.email,
//       name: credentials.email.split('@')[0],
//       role: 'admin',
//     },
//   };
// }

// 🔹 Tipo de registro COMPLETO
interface RegisterData {
  password: string;
  companyName: string;
  email: string;
  sector: string;
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
          const res = await loginRequest(credentials);

          localStorage.setItem('token', res.data.token);

          set({
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: any) {
          set({ error: 'Credenciales incorrectas', isLoading: false });
        }
      },

      // 🔹 REGISTRO COMPLETO
      register: async (data) => {
        set({ isLoading: true, error: null });

        try {
          const res = await registerRequest(data);

          set({
            isLoading: false,
            user: res.data,
          });
          // Prueba estatica
          // const userData = { ...data };
          // console.log('Registro terminado con los datos:', userData);

          set({ isLoading: false });
          return true;
        } catch (err: any) {
          // const message = err instanceof Error ? err.message : 'Error en el registro';
          // set({ error: message, isLoading: false });
          set({
            isLoading: false,
            error: err.response?.data?.message || 'Error en registro',
          });
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
