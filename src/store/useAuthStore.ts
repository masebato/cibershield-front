import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  createAssetRequest,
  deleteAssetRequest,
  getProfileRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/cibershieldApi';
import { clearTokens, saveTokens } from '../services/authStorage';
import type {
  ApiFieldError,
  Asset,
  AssetType,
  AuthState,
  LoginCredentials,
  RegisterData,
  UserProfile,
} from '../types/auth.types';

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  setUserProfile: (profile: UserProfile) => void;
  createAsset: (type: AssetType, value: string) => Promise<Asset>;
  deleteAsset: (id: number) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      registerFieldErrors: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token, refresh_token } = await loginRequest(
            credentials.email,
            credentials.password,
          );
          saveTokens(access_token, refresh_token, credentials.rememberMe ?? false);
          const profile = await getProfileRequest();

          set({
            user: profile,
            token: access_token,
            refreshToken: refresh_token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err: unknown) {
          clearTokens();
          const message = err instanceof Error ? err.message : 'Error inesperado al iniciar sesión.';
          set({ error: message, isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null, registerFieldErrors: null });

        try {
          await registerRequest(data);
          set({ isLoading: false });
          return true;
        } catch (err: any) {
          const apiErrors: ApiFieldError[] = err.response?.data?.errors ?? [];
          const message: string =
            err.response?.data?.error ||
            err.response?.data?.message ||
            'Error en el registro.';
          set({
            isLoading: false,
            error: apiErrors.length ? null : message,
            registerFieldErrors: apiErrors.length ? apiErrors : null,
          });
          return false;
        }
      },

      logout: () => {
        const { refreshToken } = useAuthStore.getState();
        if (refreshToken) {
          void logoutRequest(refreshToken).catch(() => undefined);
        }
        clearTokens();
        set({
          user: null,
          token: null,
          refreshToken: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUserProfile: (profile) => {
        set({ user: profile, isAuthenticated: true });
      },

      createAsset: async (type, value) => {
        const asset = await createAssetRequest({ type, value });
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                assets: [asset, ...state.user.assets],
              }
            : state.user,
        }));
        return asset;
      },

      deleteAsset: async (id) => {
        await deleteAssetRequest(id);
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                assets: state.user.assets.filter((asset) => asset.id !== id),
              }
            : state.user,
        }));
      },

      clearError: () => set({ error: null, registerFieldErrors: null }),
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
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
