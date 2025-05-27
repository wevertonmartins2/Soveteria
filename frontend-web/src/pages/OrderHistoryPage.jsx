import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from '@mui/material';
import axiosInstance from "../services/axiosInstance"; // Import when service is ready

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        // TODO: Replace with actual API call to fetch user's orders
        console.log('Fetching order history...');
        // const response = await axios.get('/pedidos'); // Assuming endpoint requires auth
        // setOrders(response.data);

        // Placeholder data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        setOrders([
          { id: 1, data_pedido: '2025-05-23T10:30:00Z', valor_total: '29.50', status: 'entregue', itens: [{ nome: 'Sorvete Chocolate', quantidade: 1 }, { nome: 'Sorvete Morango', quantidade: 1 }] },
          { id: 2, data_pedido: '2025-05-24T14:00:00Z', valor_total: '15.50', status: 'enviado', itens: [{ nome: 'Sorvete Chocolate', quantidade: 1 }] },
        ]);

      } catch (err) {
        setError('Falha ao carregar histórico de pedidos.');
        console.error('Fetch orders error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" gutterBottom>
        Histórico de Pedidos
      </Typography>
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <List>
          {orders.length === 0 ? (
            <Typography>Você ainda não fez nenhum pedido.</Typography>
          ) : (
            orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={`Pedido #${order.id} - ${new Date(order.data_pedido).toLocaleDateString()}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          Status: {order.status}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2" color="text.secondary">
                          Valor Total: R$ {order.valor_total}
                        </Typography>
                        <br />
                        {/* TODO: Optionally list items or add a detail view link */}
                        {/* Items: {order.itens.map(item => `${item.quantidade}x ${item.nome}`).join(', ')} */}
                      </>
                    }
                  />
                  {/* TODO: Add button to view order details */}
                </ListItem>
                {index < orders.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))
          )}
        </List>
      )}
    </Container>
  );
};

export default OrderHistoryPage;
