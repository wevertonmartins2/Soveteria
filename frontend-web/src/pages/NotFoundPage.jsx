import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container component="main" maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
      <Box>
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Página Não Encontrada
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Oops! A página que você está procurando não existe ou foi movida.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/">
          Voltar para Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
