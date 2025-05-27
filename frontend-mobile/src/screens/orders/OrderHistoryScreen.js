import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Text, Button, Icon, ListItem, Badge, Divider } from '@rneui/themed';
import axiosInstance from '../../services/axiosInstance';

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/pedidos');
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
      setError('Não foi possível carregar o histórico de pedidos. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendente': return '#f1c40f';
      case 'processando': return '#3498db';
      case 'enviado': return '#2ecc71';
      case 'entregue': return '#27ae60';
      case 'cancelado': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'processando': return 'Processando';
      case 'enviado': return 'Enviado';
      case 'entregue': return 'Entregue';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderItem = ({ item }) => (
    <ListItem.Swipeable
      bottomDivider
      onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
    >
      <ListItem.Content>
        <View style={styles.orderHeader}>
          <ListItem.Title style={styles.orderTitle}>Pedido #{item.id}</ListItem.Title>
          <Badge
            value={getStatusText(item.status)}
            badgeStyle={{ backgroundColor: getStatusColor(item.status) }}
            textStyle={{ color: 'white' }}
          />
        </View>
        
        <ListItem.Subtitle style={styles.orderDate}>
          {formatDate(item.data_pedido)}
        </ListItem.Subtitle>
        
        <View style={styles.orderInfo}>
          <Text style={styles.orderItems}>
            {item.itens?.length || 0} {item.itens?.length === 1 ? 'item' : 'itens'}
          </Text>
          <Text style={styles.orderTotal}>
            R$ {item.valor_total.toFixed(2)}
          </Text>
        </View>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );

  if (loading && orders.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Tentar Novamente" onPress={fetchOrders} />
        </View>
      ) : (
        <>
          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="receipt" size={80} color="#ccc" />
              <Text style={styles.emptyText}>Você ainda não fez nenhum pedido</Text>
              <Button
                title="Explorar Produtos"
                onPress={() => navigation.navigate('ProductList')}
                buttonStyle={styles.exploreButton}
              />
            </View>
          ) : (
            <>
              <View style={styles.headerContainer}>
                <Text h4>Meus Pedidos</Text>
                <Button
                  type="clear"
                  icon={<Icon name="refresh" color="#2089dc" />}
                  onPress={fetchOrders}
                  loading={loading}
                />
              </View>
              <Divider />
              <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
                refreshing={loading}
                onRefresh={fetchOrders}
              />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
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
    textAlign: 'center',
  },
  exploreButton: {
    marginTop: 20,
    paddingHorizontal: 30,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  orderTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  orderDate: {
    color: '#666',
    marginBottom: 5,
  },
  orderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 5,
  },
  orderItems: {
    color: '#666',
  },
  orderTotal: {
    fontWeight: 'bold',
    color: '#2089dc',
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default OrderHistoryScreen;
