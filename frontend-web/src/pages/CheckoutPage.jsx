import React from 'react';
import { Container, Typography, Box, TextField, Button, Grid } from '@mui/material';

const CheckoutPage = () => {
  // TODO: Fetch cart items from context/state
  // TODO: Implement address form handling (state, validation)
  // TODO: Implement payment logic/integration (placeholder for now)

  const handlePlaceOrder = (event) => {
    event.preventDefault();
    // TODO: Validate form
    // TODO: Send order data to backend
    console.log('Placing order...');
    alert('Pedido simulado com sucesso!');
    // TODO: Redirect to order confirmation or history page
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" gutterBottom>
        Checkout
      </Typography>
      <Box component="form" onSubmit={handlePlaceOrder}>
        <Grid container spacing={3}>
          {/* Order Summary Section */}
          <Grid item xs={12} md={5}>
            <Typography variant="h4" gutterBottom>
              Resumo do Pedido
            </Typography>
            {/* TODO: Display cart items and total */}
            <Box sx={{ border: '1px solid grey', p: 2, borderRadius: 1 }}>
              <Typography>Item 1: Sorvete de Chocolate - R$ 15.50</Typography>
              <Typography>Item 2: Sorvete de Morango - R$ 14.00</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total: R$ 29.50
              </Typography>
            </Box>
          </Grid>

          {/* Shipping Address Section */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" gutterBottom>
              Endereço de Entrega
            </Typography>
            <TextField required fullWidth margin="normal" label="Nome Completo" name="nome" autoComplete="name" />
            <TextField required fullWidth margin="normal" label="Endereço" name="endereco" autoComplete="street-address" />
            <TextField required fullWidth margin="normal" label="Cidade" name="cidade" autoComplete="address-level2" />
            <TextField required fullWidth margin="normal" label="Estado" name="estado" autoComplete="address-level1" />
            <TextField required fullWidth margin="normal" label="CEP" name="cep" autoComplete="postal-code" />
            <TextField fullWidth margin="normal" label="Complemento" name="complemento" autoComplete="address-line2" />
          </Grid>

          {/* Payment Section (Placeholder) */}
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
              Pagamento
            </Typography>
            <Typography variant="body1">
              (Simulação - Nenhuma informação de pagamento real é necessária)
            </Typography>
            {/* TODO: Add actual payment form/integration if required */}
          </Grid>

          {/* Place Order Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 3 }}
            >
              Finalizar Pedido
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CheckoutPage;
