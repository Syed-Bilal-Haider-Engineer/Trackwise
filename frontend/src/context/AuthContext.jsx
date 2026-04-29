import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api } from "../utils/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem("tw_token");
    if (!token) { setLoading(false); return; }
    try {
      const { user } = await api.me();
      setUser(user);
    } catch {
      localStorage.removeItem("tw_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadUser(); }, [loadUser]);

  const login = async (email, password) => {
    const { token, user } = await api.login({ email, password });
    localStorage.setItem("tw_token", token);
    setUser(user);
  };

  const register = async (data) => {
    const { token, user } = await api.register(data);
    localStorage.setItem("tw_token", token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("tw_token");
    setUser(null);
  };

  const updateUser = (u) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
