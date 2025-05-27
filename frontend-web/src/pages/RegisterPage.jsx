import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext'; // Import when context is ready
import axiosInstance from '../services/axiosInstance'; // Import when service is ready

const RegisterPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use context when ready
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      // Replace with actual API call
      // console.log("Register attempt:", { nome, email, senha });
      const response = await axiosInstance.post("/auth/register", { nome, email, senha });
      // Automatically log in after registration is optional, here we redirect to login
      // login(response.data.token, response.data.usuario);
      // navigate("/"); // Redirect to home or dashboard
      alert("Registro realizado com sucesso! Você será redirecionado para a página de login."); // Keep alert for now
      navigate("/login");
    } catch (err) {
      setError('Falha no registro. Verifique os dados ou tente outro email.');
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Registrar
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="nome"
            label="Nome Completo"
            name="nome"
            autoComplete="name"
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="senha"
            label="Senha"
            type="password"
            id="senha"
            autoComplete="new-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmarSenha"
            label="Confirmar Senha"
            type="password"
            id="confirmarSenha"
            autoComplete="new-password"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </Button>
          <Box textAlign="center">
            <Link component={RouterLink} to="/login" variant="body2">
              {"Já tem uma conta? Faça login"}
            </Link>
          </Box>
          {/* TODO: Add Google Login/Register Button */}
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterPage;
