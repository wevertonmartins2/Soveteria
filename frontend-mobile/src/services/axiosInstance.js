import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cria uma instância do axios com a URL base da API
const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:3001/api', // Usa 10.0.2.2 para acessar localhost do host a partir do emulador Android
  // Para dispositivos físicos ou iOS, você precisará usar o IP real do seu servidor
  // baseURL: 'http://192.168.1.X:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as requisições
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros de resposta
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Se o erro for 401 (Unauthorized), limpa o token e redireciona para login
    if (error.response && error.response.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // A navegação para a tela de login será tratada pelo contexto de autenticação
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
