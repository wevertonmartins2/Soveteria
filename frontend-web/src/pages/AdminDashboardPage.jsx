import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const AdminDashboardPage = () => {
  // TODO: Implement admin functionalities (product management, order management, user management, view statistics)
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" gutterBottom>
        Painel do Administrador
      </Typography>
      <Box>
        <Typography variant="body1">
          Bem-vindo ao painel de administração.
        </Typography>
        {/* Placeholder for admin sections */}
        <Typography variant="h5" sx={{ mt: 4 }}>Gerenciamento de Produtos (TODO)</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>Gerenciamento de Pedidos (TODO)</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>Gerenciamento de Usuários (TODO)</Typography>
        <Typography variant="h5" sx={{ mt: 2 }}>Estatísticas (TODO)</Typography>
      </Box>
    </Container>
  );
};

export default AdminDashboardPage;
