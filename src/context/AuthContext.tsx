"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const TOKEN_EXPIRATION_MINUTES = 30 // token expired after 30 mins of inactivity
const IDLE_TIMEOUT_MINUTES = 30   // user is logged out after 30 mins idle

export const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const isExpired = (timestamp: string | null) => {
    if (!timestamp) return true
    const now = Date.now()
    const elapsedMinutes = (now - parseInt(timestamp)) / 1000 / 60
    return elapsedMinutes > TOKEN_EXPIRATION_MINUTES
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const timestamp = localStorage.getItem("tokenTimestamp")
    console.log('timestamp:', timestamp)
    if (storedToken && !isExpired(timestamp)) {
      setToken(storedToken)
    } else {
      logout()
    }
    setLoading(false)
  }, [])

  const login = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    router.push("/auth/login");
  };

    // Inactivity logout
  useEffect(() => {
    let idleTimeout: NodeJS.Timeout

    const resetIdleTimer = () => {
      clearTimeout(idleTimeout)
      idleTimeout = setTimeout(() => {
        logout()
      }, IDLE_TIMEOUT_MINUTES * 60 * 1000)
    }

    window.addEventListener("mousemove", resetIdleTimer)
    window.addEventListener("keydown", resetIdleTimer)

    // start the timer on load
    resetIdleTimer()

    return () => {
      window.removeEventListener("mousemove", resetIdleTimer)
      window.removeEventListener("keydown", resetIdleTimer)
      clearTimeout(idleTimeout)
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
