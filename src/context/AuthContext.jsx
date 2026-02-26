import React, { createContext, useContext, useState, useEffect } from 'react';
const AuthContext = createContext();
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth must be used within AuthProvider'); return context; };
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  useEffect(() => {
    const savedUser = localStorage.getItem('netflix_user');
    const savedKey = localStorage.getItem('netflix_tmdb_key');
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedKey) setTmdbApiKey(savedKey);
  }, []);
  const login = (email, password) => { if (email && password) { const u = { email, id: Date.now() }; setUser(u); localStorage.setItem('netflix_user', JSON.stringify(u)); return true; } return false; };
  const signup = (email, password) => { if (email && password) { const u = { email, id: Date.now() }; setUser(u); localStorage.setItem('netflix_user', JSON.stringify(u)); return true; } return false; };
  const logout = () => { setUser(null); localStorage.removeItem('netflix_user'); localStorage.removeItem('netflix_watchlist'); };
  const saveTmdbKey = (key) => { setTmdbApiKey(key); localStorage.setItem('netflix_tmdb_key', key); };
  return <AuthContext.Provider value={{ user, login, signup, logout, tmdbApiKey, saveTmdbKey }}>{children}</AuthContext.Provider>;
};
