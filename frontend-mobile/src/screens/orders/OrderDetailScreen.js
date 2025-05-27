import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Button, Icon, ListItem, Divider, Card } from '@rneui/themed';
import axiosInstance from '../../services/axiosInstance';

const OrderDetailScreen = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/pedidos/${orderId}`);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar detalhes do pedido:', err);
      setError('Não foi possível carregar os detalhes do pedido. Tente novamente mais tarde.');
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando detalhes do pedido...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Tentar Novamente" onPress={fetchOrderDetails} />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>Pedido não encontrado</Text>
        <Button 
          title="Voltar para Pedidos" 
          onPress={() => navigation.navigate('OrderHistory')} 
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card>
        <View style={styles.headerContainer}>
          <Text h4>Pedido #{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
            <Text style={styles.statusText}>{getStatusText(order.status)}</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.dateText}>
          Data do pedido: {formatDate(order.data_pedido)}
        </Text>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Itens do Pedido</Text>
        {order.itens.map(item => (
          <ListItem key={item.id} bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.produto.nome}</ListItem.Title>
              <View style={styles.itemDetails}>
                <Text>Quantidade: {item.quantidade}</Text>
                <Text>Preço unitário: R$ {item.preco_unitario.toFixed(2)}</Text>
              </View>
              <Text style={styles.itemTotal}>
                Subtotal: R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
              </Text>
            </ListItem.Content>
          </ListItem>
        ))}
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total do Pedido:</Text>
          <Text style={styles.totalValue}>R$ {order.valor_total.toFixed(2)}</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
        <View style={styles.addressContainer}>
          <Text>{order.endereco_entrega.rua}, {order.endereco_entrega.numero}</Text>
          {order.endereco_entrega.complemento && (
            <Text>Complemento: {order.endereco_entrega.complemento}</Text>
          )}
          <Text>
            {order.endereco_entrega.bairro}, {order.endereco_entrega.cidade} - {order.endereco_entrega.estado}
          </Text>
          <Text>CEP: {order.endereco_entrega.cep}</Text>
        </View>
      </Card>
      
      <Button
        title="Voltar para Meus Pedidos"
        icon={<Icon name="arrow-back" color="white" />}
        buttonStyle={styles.backButton}
        onPress={() => navigation.goBack()}
      />
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 15,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  itemTotal: {
    fontWeight: 'bold',
    marginTop: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2089dc',
  },
  addressContainer: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  backButton: {
    margin: 20,
    borderRadius: 5,
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default OrderDetailScreen;
