import {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("tq_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // LOGIN
  const login = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem("tq_user", JSON.stringify(userData));
  }, []);

  // UPDATE USER STATS
  const updateUserStats = useCallback((stats) => {
    setUser((prev) => {
      if (!prev) return prev;

      const updated = {
        ...prev,
        ...stats,
      };

      localStorage.setItem(
        "tq_user",
        JSON.stringify(updated)
      );

      return updated;
    });
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("tq_user");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return ctx;
}