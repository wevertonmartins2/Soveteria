import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Icon, ListItem, Avatar, Divider } from '@rneui/themed';
import axiosInstance from '../../services/axiosInstance';

const CartScreen = ({ route, navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    // Adicionar produto ao carrinho se vier da tela de detalhes
    if (route.params?.addProduct) {
      const product = route.params.addProduct;
      handleAddToCart(product.id, 1);
      // Limpar parâmetro para evitar adições duplicadas
      navigation.setParams({ addProduct: null });
    }
  }, [route.params?.addProduct]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/carrinho');
      setCartItems(response.data.itens || []);
      calculateTotal(response.data.itens || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar itens do carrinho:', err);
      setError('Não foi possível carregar o carrinho. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      return acc + (item.preco_unitario * item.quantidade);
    }, 0);
    setTotal(sum);
  };

  const handleAddToCart = async (productId, quantity) => {
    try {
      setLoading(true);
      await axiosInstance.post('/carrinho/itens', {
        produto_id: productId,
        quantidade: quantity
      });
      fetchCartItems();
    } catch (err) {
      console.error('Erro ao adicionar ao carrinho:', err);
      Alert.alert('Erro', 'Não foi possível adicionar o produto ao carrinho.');
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.put(`/carrinho/itens/${itemId}`, {
        quantidade: newQuantity
      });
      fetchCartItems();
    } catch (err) {
      console.error('Erro ao atualizar quantidade:', err);
      Alert.alert('Erro', 'Não foi possível atualizar a quantidade.');
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/carrinho/itens/${itemId}`);
      fetchCartItems();
    } catch (err) {
      console.error('Erro ao remover item:', err);
      Alert.alert('Erro', 'Não foi possível remover o item do carrinho.');
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar a compra.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const renderItem = ({ item }) => (
    <ListItem bottomDivider>
      <Avatar
        source={{ uri: item.produto.imagem_url || 'https://via.placeholder.com/100' }}
        size="medium"
      />
      <ListItem.Content>
        <ListItem.Title>{item.produto.nome}</ListItem.Title>
        <ListItem.Subtitle>R$ {item.preco_unitario.toFixed(2)}</ListItem.Subtitle>
        
        <View style={styles.quantityContainer}>
          <Button
            icon={<Icon name="remove" size={15} color="white" />}
            buttonStyle={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantidade - 1)}
          />
          <Text style={styles.quantityText}>{item.quantidade}</Text>
          <Button
            icon={<Icon name="add" size={15} color="white" />}
            buttonStyle={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantidade + 1)}
          />
        </View>
      </ListItem.Content>
      <Text style={styles.itemTotal}>
        R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
      </Text>
      <Icon
        name="delete"
        color="red"
        onPress={() => handleRemoveItem(item.id)}
      />
    </ListItem>
  );

  if (loading && cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando carrinho...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Tentar Novamente" onPress={fetchCartItems} />
        </View>
      ) : (
        <>
          {cartItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="shopping-cart" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Seu carrinho está vazio</Text>
              <Button
                title="Explorar Produtos"
                onPress={() => navigation.navigate('ProductList')}
                buttonStyle={styles.exploreButton}
              />
            </View>
          ) : (
            <>
              <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchCartItems}
              />
              
              <View style={styles.summaryContainer}>
                <Divider />
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total:</Text>
                  <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
                </View>
                <Button
                  title="Finalizar Compra"
                  icon={<Icon name="payment" color="white" />}
                  buttonStyle={styles.checkoutButton}
                  onPress={handleCheckout}
                />
              </View>
            </>
          )}
        </>
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
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginVertical: 20,
  },
  exploreButton: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    padding: 0,
    borderRadius: 15,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemTotal: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
  summaryContainer: {
    backgroundColor: 'white',
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2089dc',
  },
  checkoutButton: {
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default CartScreen;
