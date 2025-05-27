import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, CircularProgress, Alert, Pagination } from '@mui/material';
import axiosInstance from '../services/axiosInstance'; // Import when service is ready

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        // Replace with actual API call
        // console.log(`Fetching products for page: ${page}`);
        const response = await axiosInstance.get(`/produtos?page=${page}&limit=12`); // Example API call
        setProducts(response.data.produtos);
        setTotalPages(response.data.totalPages);

        // Placeholder data removed
        // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        // const placeholderProducts = Array.from({ length: 12 }, (_, i) => ({
        //   id: (page - 1) * 12 + i + 1,
        //   nome: `Sorvete Placeholder ${ (page - 1) * 12 + i + 1}`,
        //   preco: (10 + i * 0.5).toFixed(2),
        //   imagem_url: `https://via.placeholder.com/300x200?text=Sorvete+${ (page - 1) * 12 + i + 1}`,
        //   descricao: 'Descrição placeholder do sorvete.'
        // }));
        // setProducts(placeholderProducts);
        // setTotalPages(5); // Placeholder total pages

      } catch (err) {
        setError('Falha ao carregar produtos.');
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" align="center" gutterBottom>
        Nossos Sabores
      </Typography>
      {loading && <CircularProgress sx={{ display: 'block', margin: 'auto' }} />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && (
        <>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    sx={{ pt: '56.25%' }} // 16:9 aspect ratio
                    image={product.imagem_url}
                    alt={product.nome}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.nome}
                    </Typography>
                    <Typography>
                      R$ {product.preco}
                    </Typography>
                    {/* <Typography variant="body2" color="text.secondary">
                      {product.descricao} // Optional: Show description here?
                    </Typography> */}
                  </CardContent>
                  <CardActions>
                    <Button size="small" component={RouterLink} to={`/produtos/${product.id}`}>Ver Detalhes</Button>
                    {/* TODO: Add to cart button */}
                    <Button size="small">Adicionar ao Carrinho</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}
          />
        </>
      )}
    </Container>
  );
};

export default ProductListPage;
