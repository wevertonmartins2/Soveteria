import React from 'react';
import { Typography, Container } from '@mui/material';

const HomePage = () => {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Bem-vindo à Sorveteria!
      </Typography>
      <Typography variant="body1">
        Explore nossos deliciosos sabores.
      </Typography>
      {/* TODO: Add featured products or promotions */}
    </Container>
  );
};

export default HomePage;
