import React, { createContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../services/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To check initial auth status

  // Function to fetch user data based on token (if token exists)
  const fetchUser = useCallback(async (authToken) => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      // Implementação real da chamada à API para obter o perfil do usuário
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Falha ao buscar dados do usuário:', error);
      // Se o token for inválido ou expirado, limpa-o
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check auth status on initial load
  useEffect(() => {
    fetchUser(token);
  }, [token, fetchUser]);

  const login = (newToken, userData) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    // Optionally redirect to login page
    // navigate('/login'); // Need to import useNavigate or handle redirect differently
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
