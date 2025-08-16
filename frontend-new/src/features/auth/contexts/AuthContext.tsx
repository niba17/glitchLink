"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { tokenStorage } from "../utils/tokenStorage";

interface AuthContextType {
  token: string | null; // ✅ simpan token
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // tambahkan
  const [token, setToken] = useState<string | null>(null);

  // Cek token di localStorage saat pertama kali render
  useEffect(() => {
    const storedToken = tokenStorage.get();
    setToken(storedToken);
    setIsAuthenticated(!!storedToken);
    setIsLoading(false);
  }, []);

  const login = (newToken: string) => {
    tokenStorage.set(newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    tokenStorage.remove();
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ token, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
