"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
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
 */
export function useRequireAuth(options: GuardOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const requireCreator = options.requireCreator === true;
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = getCachedAuth();
      if (!cached) {
        router.replace(loginRedirectUrl(pathname || "/"));
        return;
      }

      if (!cancelled) {
        setUser(cached.user);
      }

      const result = await verifySession();
      if (cancelled) return;

      if (!result.ok) {
        if (result.reason !== "network") {
          clearCachedAuth();
        }
        router.replace(loginRedirectUrl(pathname || "/"));
        return;
      }

      if (requireCreator && !isCreatorRole(result.user)) {
        router.replace("/");
        return;
      }

      setUser(result.user);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [router, pathname, requireCreator]);

  return { ready, user };
}
