"use client";

import {
  clearAuthentication,
  getStoredUser,
  saveAuthentication,
} from "@/lib/auth-storage";
import { apiRequest } from "@/lib/api-client";
import type {
  AuthenticatedUser,
  AuthenticationResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type AuthContextValue = {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setUser(getStoredUser());
      setIsInitializing(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  const storeAuthentication = useCallback(
    (response: AuthenticationResponse): void => {
      saveAuthentication(response.accessToken, response.user);
      setUser(response.user);
    },
    [],
  );

  const login = useCallback(
    async (credentials: LoginRequest): Promise<void> => {
      const response = await apiRequest<AuthenticationResponse>(
        "/auth/login",
        {
          method: "POST",
          body: credentials,
        },
      );

      storeAuthentication(response);
    },
    [storeAuthentication],
  );

  const register = useCallback(
    async (data: RegisterRequest): Promise<void> => {
      const response = await apiRequest<AuthenticationResponse>(
        "/auth/register",
        {
          method: "POST",
          body: data,
        },
      );

      storeAuthentication(response);
    },
    [storeAuthentication],
  );

  const logout = useCallback((): void => {
    clearAuthentication();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      login,
      register,
      logout,
    }),
    [user, isInitializing, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}