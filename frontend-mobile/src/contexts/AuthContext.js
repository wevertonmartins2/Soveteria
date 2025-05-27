import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../services/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário com base no token
  const fetchUser = useCallback(async (authToken) => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      console.error('Falha ao buscar dados do usuário:', error);
      // Se o token for inválido ou expirado, limpa-o
      await AsyncStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar status de autenticação ao iniciar
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      setToken(storedToken);
      fetchUser(storedToken);
    };
    
    loadToken();
  }, [fetchUser]);

  const login = async (newToken, userData) => {
    await AsyncStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const register = async (nome, email, senha) => {
    try {
      const response = await axiosInstance.post('/auth/register', {
        nome,
        email,
        senha
      });
      
      const { token: newToken, usuario } = response.data;
      await login(newToken, usuario);
      return { success: true };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Erro ao registrar usuário'
      };
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = isAuthenticated && user?.role === 'admin';

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        user, 
        isAuthenticated, 
        isAdmin, 
        loading, 
        login, 
        logout, 
        register 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
