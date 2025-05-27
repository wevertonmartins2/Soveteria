import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Input, Button, Text } from '@rneui/themed';
import { AuthContext } from '../../contexts/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmSenha, setConfirmSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    setLoading(true);
    try {
      const result = await register(nome, email, senha);
      if (result.success) {
        // Navegação será tratada pelo AuthContext
      } else {
        Alert.alert('Erro', result.message);
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      Alert.alert('Erro', 'Não foi possível completar o registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text h3 style={styles.title}>Criar Conta</Text>
      
      <Input
        placeholder="Nome"
        leftIcon={{ type: 'material', name: 'person' }}
        value={nome}
        onChangeText={setNome}
      />
      
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
      
      <Input
        placeholder="Confirmar Senha"
        leftIcon={{ type: 'material', name: 'lock' }}
        value={confirmSenha}
        onChangeText={setConfirmSenha}
        secureTextEntry
      />
      
      <Button
        title={loading ? "Registrando..." : "Registrar"}
        onPress={handleRegister}
        disabled={loading}
        buttonStyle={styles.button}
        containerStyle={styles.buttonContainer}
      />
      
      <Button
        title="Já tem uma conta? Faça login"
        type="clear"
        onPress={() => navigation.navigate('Login')}
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

export default RegisterScreen;
