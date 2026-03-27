import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        setUser(await authApi.me(token));
      } catch {
        setToken(null); setUser(null); localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [token]);

  const login = async (payload) => {
    const data = await authApi.login(payload);
    setToken(data.token); setUser(data); localStorage.setItem('token', data.token);
    return data;
  };

  const register = async (payload) => {
    const data = await authApi.register(payload);
    setToken(data.token); setUser(data); localStorage.setItem('token', data.token);
    return data;
  };

  const logout = () => { setToken(null); setUser(null); localStorage.removeItem('token'); };
  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
