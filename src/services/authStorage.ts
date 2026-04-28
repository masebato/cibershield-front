const ACCESS_TOKEN_KEY = 'auth_access_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const REMEMBER_ME_KEY = 'rememberMe';

function getStorage(rememberMe?: boolean): Storage {
  if (typeof window === 'undefined') {
    return localStorage;
  }
  if (typeof rememberMe === 'boolean') {
    return rememberMe ? localStorage : sessionStorage;
  }
  return localStorage.getItem(REMEMBER_ME_KEY) === 'true' ? localStorage : sessionStorage;
}

export function setRememberPreference(rememberMe: boolean): void {
  localStorage.setItem(REMEMBER_ME_KEY, rememberMe ? 'true' : 'false');
}

export function saveTokens(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean,
): void {
  setRememberPreference(rememberMe);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);

  const storage = getStorage(rememberMe);
  storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function readAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function readRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
}

