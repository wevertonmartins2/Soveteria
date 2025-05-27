import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text, Card, Button, Icon, Rating, Divider } from '@rneui/themed';
import axiosInstance from '../../services/axiosInstance';

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/produtos/${productId}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar detalhes do produto:', err);
      setError('Não foi possível carregar os detalhes do produto. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/carrinho/itens', {
        produto_id: productId,
        quantidade: quantity
      });
      Alert.alert(
        'Sucesso',
        'Produto adicionado ao carrinho!',
        [
          { 
            text: 'Continuar Comprando', 
            style: 'cancel' 
          },
          { 
            text: 'Ver Carrinho', 
            onPress: () => navigation.navigate('Cart') 
          }
        ]
      );
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o produto ao carrinho.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando detalhes do produto...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchProductDetails} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Produto não encontrado</Text>
        <Button 
          title="Voltar para Produtos" 
          onPress={() => navigation.navigate('ProductList')} 
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <Card.Title h4>{product.nome}</Card.Title>
        <Card.Divider />
        <Card.Image 
          source={{ uri: product.imagem_url || 'https://via.placeholder.com/300' }}
          style={styles.productImage}
        />
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>R$ {product.preco.toFixed(2)}</Text>
          {product.estoque > 0 ? (
            <Text style={styles.inStock}>Em estoque: {product.estoque}</Text>
          ) : (
            <Text style={styles.outOfStock}>Fora de estoque</Text>
          )}
        </View>
        
        <Text style={styles.description}>{product.descricao}</Text>
        
        <Divider style={styles.divider} />
        
        <View style={styles.ratingContainer}>
          <Rating 
            readonly
            startingValue={product.avaliacao_media || 0}
            imageSize={20}
          />
          <Text style={styles.ratingText}>
            {product.avaliacao_media ? product.avaliacao_media.toFixed(1) : 'Sem avaliações'} 
            ({product.total_avaliacoes || 0} avaliações)
          </Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.quantityContainer}>
          <Text style={styles.quantityLabel}>Quantidade:</Text>
          <View style={styles.quantityControls}>
            <Button
              icon={<Icon name="remove" color="white" />}
              buttonStyle={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            />
            <Text style={styles.quantityText}>{quantity}</Text>
            <Button
              icon={<Icon name="add" color="white" />}
              buttonStyle={styles.quantityButton}
              onPress={() => setQuantity(Math.min(product.estoque, quantity + 1))}
              disabled={quantity >= product.estoque}
            />
          </View>
        </View>
        
        <Button
          icon={<Icon name="shopping-cart" color="#ffffff" />}
          buttonStyle={styles.button}
          title="Adicionar ao Carrinho"
          onPress={handleAddToCart}
          disabled={product.estoque <= 0}
        />
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productImage: {
    height: 300,
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2089dc',
  },
  inStock: {
    color: 'green',
  },
  outOfStock: {
    color: 'red',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginVertical: 10,
  },
  divider: {
    marginVertical: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  ratingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  quantityLabel: {
    fontSize: 16,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    padding: 0,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
  },
  button: {
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: '#2089dc',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ProductDetailScreen;
