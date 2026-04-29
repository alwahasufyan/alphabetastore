"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "contexts/AuthContext";

export default function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/profile"
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, isAuthenticated, user } = useAuth();

  const hasRoleAccess = !allowedRoles || allowedRoles.includes(user?.role);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const nextPath = pathname || "/";
      window.location.replace(`/login?next=${encodeURIComponent(nextPath)}`);
      return;
    }

    if (!loading && isAuthenticated && allowedRoles && user && !hasRoleAccess) {
      router.replace(redirectTo);
    }
  }, [allowedRoles, hasRoleAccess, isAuthenticated, loading, pathname, redirectTo, router, user]);

  if (loading || !isAuthenticated || (allowedRoles && user && !hasRoleAccess)) {
    return null;
  }

  return children;
}