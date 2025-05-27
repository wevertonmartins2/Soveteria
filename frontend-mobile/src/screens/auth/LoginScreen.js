import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { AuthContext } from '../../contexts/AuthContext';
import axiosInstance from '../../services/axiosInstance';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/auth/login', { email, senha });
      await login(response.data.token, response.data.usuario);
    } catch (error) {
      console.error('Erro no login:', error);
      Alert.alert(
        'Erro no login',
        error.response?.data?.message || 'Não foi possível fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h3 style={styles.title}>Login</Text>
      
      <Input
        placeholder="Email"
        leftIcon={{ type: 'material', name: 'email' }}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <Input
        placeholder="Senha"
        leftIcon={{ type: 'material', name: 'lock' }}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />
      
      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
      />
      
      <Button
        title="Não tem uma conta? Registre-se"
        type="clear"
        onPress={() => navigation.navigate('Register')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2089dc',
    borderRadius: 5,
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
});

export default LoginScreen;
