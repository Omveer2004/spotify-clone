import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('spotify_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('spotify_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data?.user) {
          setUser(response.data.user);
        }
      } catch (err) {
        console.warn('Session verification failed, resetting token');
        localStorage.removeItem('spotify_token');
        localStorage.removeItem('spotify_user');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const { token: receivedToken, user: receivedUser } = response.data;

    if (receivedToken) {
      localStorage.setItem('spotify_token', receivedToken);
      setToken(receivedToken);
    }
    if (receivedUser) {
      localStorage.setItem('spotify_user', JSON.stringify(receivedUser));
      setUser(receivedUser);
    }
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    const { token: receivedToken, user: receivedUser } = response.data;

    if (receivedToken) {
      localStorage.setItem('spotify_token', receivedToken);
      setToken(receivedToken);
    }
    if (receivedUser) {
      localStorage.setItem('spotify_user', JSON.stringify(receivedUser));
      setUser(receivedUser);
    }
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('spotify_token');
      localStorage.removeItem('spotify_user');
      setToken(null);
      setUser(null);
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user,
    isArtist: user?.role === 'artist',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
