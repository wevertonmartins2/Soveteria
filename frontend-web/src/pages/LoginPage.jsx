import React, { useState, useContext } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Link, Alert } from '@mui/material';
import { AuthContext } from '../contexts/AuthContext'; // Import when context is ready
import axiosInstance from '../services/axiosInstance'; // Import when service is ready

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Use context when ready
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Replace with actual API call
      // console.log("Login attempt:", { email, senha });
      const response = await axiosInstance.post("/auth/login", { email, senha });
      login(response.data.token, response.data.usuario);
      navigate("/"); // Redirect to home or dashboard
      // alert("Login simulado com sucesso! Redirecionando..."); // Placeholder
      // navigate("/");
    } catch (err) {
      setError('Falha no login. Verifique seu email e senha.');
      console.error('Login error:', err);
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          {/* TODO: Add "Remember me" checkbox if needed */}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          <Box textAlign="center">
            <Link component={RouterLink} to="/register" variant="body2">
              {"Não tem uma conta? Registre-se"}
            </Link>
            {/* TODO: Add forgot password link */}
          </Box>
          {/* TODO: Add Google Login Button */}
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
