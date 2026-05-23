import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(sessionStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      sessionStorage.setItem('token', token);
    } else {
      sessionStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
    setLoading(false);
  }, [user]);

  const login = async (email, password) => {
    const response = await api.post('/api/auth/login', { email, password });
    setUser(response.data.user);
    setToken(response.data.token);
    return response.data;
  };

  const register = async (name, email, password) => {
    const response = await api.post('/api/auth/register', { name, email, password });
    setUser(response.data.user);
    setToken(response.data.token);
    return response.data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
