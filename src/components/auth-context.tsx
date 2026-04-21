import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@workspace/api-client-react/src/generated/api.schemas";
import { useGetCurrentUser } from "@workspace/api-client-react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("auth_token"));
  
  const { data: user, isLoading: isUserLoading, refetch } = useGetCurrentUser({
    query: {
      enabled: !!token,
      retry: false,
    }
  });

  const isLoading = isUserLoading && !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
    refetch();
  };

  const logout = () => {
    setToken(null);
  };

  // If the query fails (e.g. token expired), we might want to logout automatically.
  // But we'll let components handle redirects if user is null.

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
