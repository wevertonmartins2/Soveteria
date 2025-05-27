import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, Card, CardMedia, CardContent, Button, CircularProgress, Alert, Box } from '@mui/material';
import axiosInstance from '../services/axiosInstance'; // Import when service is ready

const ProductDetailPage = () => {
  const { id } = useParams(); // Get product ID from URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        // Replace with actual API call
        // console.log(`Fetching product details for ID: ${id}`);
        const response = await axiosInstance.get(`/produtos/${id}`);
        setProduct(response.data);

        // Placeholder data removed
        // await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        // if (parseInt(id) > 0 && parseInt(id) <= 60) { // Simulate finding a product
        //   setProduct({
        //     id: parseInt(id),
        //     nome: `Sorvete Placeholder ${id}`,
        //     preco: (10 + (parseInt(id) % 12) * 0.5).toFixed(2),
        //     imagem_url: `https://via.placeholder.com/600x400?text=Sorvete+${id}`,
        //     descricao: `Descrição detalhada do delicioso Sorvete Placeholder ${id}. Feito com ingredientes selecionados. Perfeito para qualquer ocasião!`,
        //     categoria: "Tradicional",
        //     estoque: 50 + parseInt(id),
        //   });
        // } else {
        //   setError("Produto não encontrado.");
        // }

      } catch (err) {
        setError('Falha ao carregar detalhes do produto.');
        console.error('Fetch product detail error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 8 }} />;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 8 }}>{error}</Alert>;
  }

  if (!product) {
    // This case might be redundant if error handles not found, but good for safety
    return <Typography sx={{ mt: 8, textAlign: 'center' }}>Produto não encontrado.</Typography>;
  }

  return (
    <Container sx={{ py: 8 }}>
      <Card>
        <Grid container>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={product.imagem_url}
              alt={product.nome}
              sx={{ width: '100%', height: 'auto' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h3" component="h1" gutterBottom>
                  {product.nome}
                </Typography>
                <Typography variant="h5" color="text.secondary" gutterBottom>
                  R$ {product.preco}
                </Typography>
                <Typography variant="body1" paragraph>
                  {product.descricao}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Categoria: {product.categoria}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Estoque: {product.estoque > 0 ? `${product.estoque} unidades` : 'Indisponível'}
                </Typography>
              </Box>
              <Box sx={{ mt: 4 }}>
                {/* TODO: Add quantity selector */}
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={product.estoque <= 0}
                  sx={{ mr: 2 }}
                  // onClick={handleAddToCart} // TODO: Implement add to cart
                >
                  Adicionar ao Carrinho
                </Button>
                <Button variant="outlined" component={RouterLink} to="/produtos">
                  Voltar para Lista
                </Button>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

// Need to import Grid for the layout above
import Grid from '@mui/material/Grid';

export default ProductDetailPage;
