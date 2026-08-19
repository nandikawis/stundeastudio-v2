/**
 * Client-side auth cache + session helpers.
 * Token lives in localStorage; UI hydrates from cache first to avoid navbar flash,
 * then revalidates against /api/auth/check-session with the Bearer token.
 */

import { getAccessToken, setAccessToken } from "./api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const USER_ID_KEY = "user_uuid";
export const USER_DATA_KEY = "user_data";

/** Fired on the window when login/logout updates local auth cache. */
export const AUTH_CHANGED_EVENT = "stundea-auth-changed";

function notifyAuthChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

export type AuthUser = {
  id: string;
  email?: string | null;
  full_name?: string | null;
  name?: string | null;
  role?: string | null;
  [key: string]: unknown;
};

export type CachedAuth = {
  token: string;
  user: AuthUser;
};

export function getCachedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_DATA_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function getCachedAuth(): CachedAuth | null {
  const token = getAccessToken();
  const user = getCachedUser();
  if (!token || !user?.id) return null;
  return { token, user };
}

export function setCachedAuth(user: AuthUser, token?: string | null): void {
  if (typeof window === "undefined") return;
  if (token) setAccessToken(token);
  localStorage.setItem(USER_ID_KEY, user.id);
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  notifyAuthChanged();
}

export function clearCachedAuth(options?: { silent?: boolean }): void {
  if (typeof window === "undefined") return;
  setAccessToken(null);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  if (!options?.silent) notifyAuthChanged();
}

export function isCreatorRole(user: AuthUser | null | undefined): boolean {
  return String(user?.role || "").toLowerCase() === "creator";
}

export type SessionResult =
  | { ok: true; user: AuthUser; token: string }
  | { ok: false; reason: string };

/** Verify current Bearer token with the API. Does not clear cache on network errors. */
export async function verifySession(): Promise<SessionResult> {
  const token = getAccessToken();
  if (!token) {
    return { ok: false, reason: "missing_token" };
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/check-session`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => null);

    if (!response.ok || !data?.success || !data?.data?.user) {
      return {
        ok: false,
        reason: data?.error || data?.message || "unauthorized",
      };
    }

    const user = data.data.user as AuthUser;
    const nextToken = data.data.session?.access_token || token;
    setCachedAuth(user, nextToken);
    return { ok: true, user, token: nextToken };
  } catch {
    return { ok: false, reason: "network" };
  }
}

export function loginRedirectUrl(path: string): string {
  const safe = path.startsWith("/") && !path.startsWith("//") ? path : "/";
  return `/login?redirect=${encodeURIComponent(safe)}`;
}
