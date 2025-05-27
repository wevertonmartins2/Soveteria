import React, { useState, useEffect, useContext } from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Button, Box, CircularProgress, Alert, Divider, CardMedia, TextField, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
// import { CartContext } from '../contexts/CartContext'; // Optional: Use context for global cart state/updates

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // const { updateCartCount } = useContext(CartContext); // Optional: Update global count

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosInstance.get('/carrinho');
      setCart(response.data);
    } catch (err) {
      setError('Falha ao carregar o carrinho. Tente novamente.');
      console.error('Fetch cart error:', err);
      // Handle cases where cart might not exist for user yet (e.g., 404)
      if (err.response && err.response.status === 404) {
        setCart({ itens: [], valor_total: '0.00' }); // Set empty cart
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId, novaQuantidade) => {
    if (novaQuantidade < 1) {
      handleRemoveItem(itemId);
      return;
    }
    try {
      const response = await axiosInstance.put(`/carrinho/item/${itemId}`, { quantidade: novaQuantidade });
      setCart(response.data.carrinho); // Update cart state with response
      // updateCartCount(response.data.totalItens); // Optional: Update global count
    } catch (err) {
      setError('Falha ao atualizar a quantidade.');
      console.error('Update quantity error:', err);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await axiosInstance.delete(`/carrinho/item/${itemId}`);
      setCart(response.data.carrinho); // Update cart state with response
      // updateCartCount(response.data.totalItens); // Optional: Update global count
    } catch (err) {
      setError('Falha ao remover o item.');
      console.error('Remove item error:', err);
    }
  };

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 8 }} />;
  }

  if (error && !cart) { // Show error only if cart couldn't be loaded at all
    return <Alert severity="error" sx={{ mt: 8 }}>{error}</Alert>;
  }

  if (!cart || cart.itens.length === 0) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h2" gutterBottom>
          Seu Carrinho
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Seu carrinho está vazio.
        </Typography>
        <Button variant="contained" component={RouterLink} to="/produtos">
          Ver Produtos
        </Button>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" gutterBottom>
        Seu Carrinho
      </Typography>
      {error && <Alert severity="warning" sx={{ mb: 2 }}>{error}</Alert>} {/* Show update/remove errors */} 
      <List>
        {cart.itens.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem alignItems="flex-start">
              <CardMedia
                component="img"
                sx={{ width: 100, mr: 2, borderRadius: 1 }} // Adjust size as needed
                image={item.Produto?.imagem_url || 'https://via.placeholder.com/100'} // Use placeholder if no image
                alt={item.Produto?.nome}
              />
              <ListItemText
                primary={item.Produto?.nome || 'Produto Desconhecido'}
                secondary={`Preço Unitário: R$ ${item.preco_unitario}`}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', mx: 2 }}>
                <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ mx: 1 }}>{item.quantidade}</Typography>
                {/* <TextField 
                  type="number"
                  size="small"
                  value={item.quantidade}
                  onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                  inputProps={{ min: 1, style: { textAlign: 'center', width: '40px' } }}
                  sx={{ mx: 1 }}
                /> */}
                <IconButton size="small" onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography sx={{ minWidth: '80px', textAlign: 'right', fontWeight: 'bold' }}>
                R$ {item.subtotal}
              </Typography>
              <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveItem(item.id)} sx={{ ml: 2 }}>
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      <Box sx={{ mt: 4, textAlign: 'right' }}>
        <Typography variant="h5">
          Total: R$ {cart.valor_total}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mt: 2 }}
          component={RouterLink}
          to="/checkout"
          disabled={cart.itens.length === 0} // Disable if cart is empty
        >
          Ir para Checkout
        </Button>
      </Box>
    </Container>
  );
};

export default CartPage;
