import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Icon, SearchBar } from '@rneui/themed';
import axiosInstance from '../../services/axiosInstance';

const ProductListScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/produtos');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => 
    product.nome.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Card>
        <Card.Title>{item.nome}</Card.Title>
        <Card.Divider />
        <Card.Image 
          source={{ uri: item.imagem_url || 'https://via.placeholder.com/150' }}
          style={styles.productImage}
        />
        <Text style={styles.price}>R$ {item.preco.toFixed(2)}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.descricao}
        </Text>
        <Button
          icon={<Icon name="shopping-cart" color="#ffffff" />}
          buttonStyle={styles.button}
          title="Adicionar ao Carrinho"
          onPress={() => navigation.navigate('Cart', { addProduct: item })}
        />
      </Card>
    </TouchableOpacity>
  );

  if (loading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Buscar produtos..."
        onChangeText={setSearch}
        value={search}
        lightTheme
        round
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInputContainer}
      />
      
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Tentar Novamente" onPress={fetchProducts} />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={fetchProducts}
        />
      )}
    </View>
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
  list: {
    padding: 8,
  },
  productImage: {
    height: 150,
    marginBottom: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2089dc',
    marginVertical: 5,
  },
  description: {
    marginBottom: 10,
    color: '#666',
  },
  button: {
    borderRadius: 5,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInputContainer: {
    backgroundColor: '#e0e0e0',
  },
});

export default ProductListScreen;
