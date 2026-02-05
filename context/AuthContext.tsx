// "use client";

// import { createContext, useContext, useState } from "react";
// import { useRouter } from "next/navigation";

// type AuthContextType = {
//   login: (token: string) => void;
//   logout: () => void;
//   isAuthenticated: boolean;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
//     typeof window !== "undefined" && !!localStorage.getItem("ADMIN_TOKEN")
//   );

//   const login = (token: string) => {
//     localStorage.setItem("ADMIN_TOKEN", token);
//     setIsAuthenticated(true);
//     router.push("/admin/dashboard");
//   };

//   const logout = () => {
//     localStorage.removeItem("ADMIN_TOKEN");
//     setIsAuthenticated(false);
//     router.push("/admin/login");
//   };

//   return (
//     <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext)!;
"use client";

import { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    typeof document !== "undefined" &&
      document.cookie.includes("ADMIN_TOKEN")
  );

  const login = (token: string) => {
    document.cookie = `ADMIN_TOKEN=${token}; path=/`;
    setIsAuthenticated(true);
    router.push("/admin/dashboard");
  };

  const logout = () => {
    document.cookie = "ADMIN_TOKEN=; Max-Age=0; path=/";
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
