import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("auth");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed.user || null);
        setToken(parsed.token || null);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const login = (data) => {
    const payload = { user: data.user || null, token: data.token || data };
    setUser(payload.user);
    setToken(payload.token);
    try {
      localStorage.setItem("auth", JSON.stringify(payload));
    } catch (e) {}
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem("auth");
      localStorage.removeItem("deknek3d_auth_token");
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
