import { createContext, useContext, useEffect, useState } from 'react';
import { getStoredUser, getToken, clearAuth, storeAuth } from '../services/auth.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    if (!token) setUser(null);
  }, [token]);

  const login = (authResponse) => {
    storeAuth(authResponse);
    setUser(getStoredUser());
    setToken(getToken());
  };

  const logout = () => {
    clearAuth();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
