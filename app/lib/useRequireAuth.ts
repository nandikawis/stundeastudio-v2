"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AUTH_CHANGED_EVENT,
  clearCachedAuth,
  getCachedAuth,
  isCreatorRole,
  loginRedirectUrl,
  verifySession,
  type AuthUser,
} from "../lib/auth";

type GuardOptions = {
  /** Require creator role after auth succeeds */
  requireCreator?: boolean;
};

/**
 * Blocks the page until a valid session exists (and optionally creator role).
 * Uses local cache first, then revalidates with the API.
 * Also reacts immediately when logout clears the local auth cache.
 */
export function useRequireAuth(options: GuardOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const requireCreator = options.requireCreator === true;
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    const redirectToLogin = () => {
      setReady(false);
      setUser(null);
      router.replace(loginRedirectUrl(pathname || "/"));
    };

    (async () => {
      const cached = getCachedAuth();
      if (!cached) {
        redirectToLogin();
        return;
      }

      if (!cancelled) {
        setUser(cached.user);
      }

      const result = await verifySession();
      if (cancelled) return;

      if (!result.ok) {
        if (result.reason !== "network") {
          // Silent so we don't also fire the logout → home path
          clearCachedAuth({ silent: true });
        }
        redirectToLogin();
        return;
      }

      if (requireCreator && !isCreatorRole(result.user)) {
        router.replace("/");
        return;
      }

      setUser(result.user);
      setReady(true);
    })();

    const onAuthChanged = () => {
      if (cancelled) return;
      if (!getCachedAuth()) {
        // Logout (or cleared session) while still on a guarded page → leave immediately
        setReady(false);
        setUser(null);
        router.replace("/");
      }
    };

    window.addEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
    window.addEventListener("storage", onAuthChanged);

    return () => {
      cancelled = true;
      window.removeEventListener(AUTH_CHANGED_EVENT, onAuthChanged);
      window.removeEventListener("storage", onAuthChanged);
    };
  }, [router, pathname, requireCreator]);

  return { ready, user };
}
