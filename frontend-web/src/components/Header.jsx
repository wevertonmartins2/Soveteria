import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Badge } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AuthContext } from '../contexts/AuthContext'; // Adjust path as needed

const Header = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  // TODO: Get cart item count from a CartContext or similar
  const cartItemCount = 0; // Placeholder

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
          Sorveteria Delícia
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button color="inherit" component={RouterLink} to="/">Home</Button>
          <Button color="inherit" component={RouterLink} to="/produtos">Produtos</Button>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' && (
                <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
              )}
              <Button color="inherit" component={RouterLink} to="/pedidos">Meus Pedidos</Button>
              <IconButton component={RouterLink} to="/carrinho" color="inherit">
                <Badge badgeContent={cartItemCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Typography sx={{ mx: 2 }}>Olá, {user?.nome || 'Usuário'}</Typography>
              <Button color="inherit" onClick={handleLogout}>Sair</Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/register">Registrar</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
