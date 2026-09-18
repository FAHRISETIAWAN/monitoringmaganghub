"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useLocalStorageState } from "@/lib/use-local-storage";
import type { AuthUser } from "@/lib/types";

const STORAGE_KEY = "magang-hub-auth-user";

type AuthContextValue = {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser, clearUser] = useLocalStorageState<AuthUser | null>(
    STORAGE_KEY,
    null
  );

  const login = useCallback((nextUser: AuthUser) => setUser(nextUser), [setUser]);
  const logout = useCallback(() => clearUser(), [clearUser]);

  const value = useMemo(
    () => ({ user, login, logout }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
