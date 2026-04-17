"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { apiGet, apiPost } from "utils/api";
import { clearTokens, getRefreshToken, isLoggedIn } from "utils/auth";
import { clearStoredCart, emitCartReset } from "utils/cart";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadCurrentUser = async () => {
    const currentUser = await apiGet("/auth/me");
    setUser(currentUser);
    return currentUser;
  };

  useEffect(() => {
    let mounted = true;

    const loadUser = async () => {
      if (!isLoggedIn()) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const currentUser = await apiGet("/auth/me");
        if (mounted) setUser(currentUser);
      } catch {
        clearTokens();
        clearStoredCart();
        emitCartReset();
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await apiPost("/auth/logout", { refreshToken });
      }
    } catch {
      // Keep logout resilient even if the backend token is already invalid.
    } finally {
      clearTokens();
      clearStoredCart();
      emitCartReset();
      setUser(null);
    }
  };

  return <AuthContext.Provider value={{
    user,
    setUser,
    loadCurrentUser,
    logout,
    loading,
    isAuthenticated: Boolean(user) || isLoggedIn()
  }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}