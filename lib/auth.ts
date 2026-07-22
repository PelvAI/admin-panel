const TOKEN_KEY = "alma_admin_token";
const USER_KEY = "alma_admin_user";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user?: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser<T = unknown>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return Boolean(getToken());
}

/** MVP: map staff email to a known backend UID until real staff auth exists. */
export function resolveDevFirebaseUid(email: string): string {
  const normalized = email.trim().toLowerCase();
  if (normalized === "admin@vela.com" || normalized === "admin@alma.com") {
    return "test_uid_123";
  }
  // Stable short uid derived from email for other dev accounts
  if (typeof btoa === "function") {
    return `uid_${btoa(normalized).replace(/=+$/, "").slice(0, 10)}`;
  }
  return `uid_${normalized.replace(/[^a-z0-9]/g, "").slice(0, 10)}`;
}
