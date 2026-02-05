import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tmdbApiKey, setTmdbApiKey] = useState('');
  const MOCK_USER_KEY = 'netflix_user';
  const TMDB_KEY = 'netflix_tmdb_key';

  useEffect(() => {
    const savedUser = localStorage.getItem(MOCK_USER_KEY);
    const savedKey = localStorage.getItem(TMDB_KEY);
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedKey) setTmdbApiKey(savedKey);
  }, []);

  const login = (email, password) => {
    if (email && password) {
      const userData = { email, id: Date.now() };
      setUser(userData);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const signup = (email, password) => {
    if (email && password) {
      const userData = { email, id: Date.now() };
      setUser(userData);
      localStorage.setItem(MOCK_USER_KEY, JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(MOCK_USER_KEY);
    localStorage.removeItem('netflix_watchlist');
  };

  const saveTmdbKey = (key) => {
    setTmdbApiKey(key);
    localStorage.setItem(TMDB_KEY, key);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, tmdbApiKey, saveTmdbKey }}>
      {children}
    </AuthContext.Provider>
  );
};