import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Text, Button, Input, Icon, Divider } from '@rneui/themed';
import axiosInstance from '../../services/axiosInstance';

const CheckoutScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/carrinho');
      setCartItems(response.data.itens || []);
      calculateTotal(response.data.itens || []);
    } catch (err) {
      console.error('Erro ao buscar itens do carrinho:', err);
      Alert.alert('Erro', 'Não foi possível carregar o carrinho.');
      navigation.goBack();
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

  const handleInputChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['rua', 'numero', 'bairro', 'cidade', 'estado', 'cep'];
    for (const field of requiredFields) {
      if (!address[field]) {
        Alert.alert('Erro', `O campo ${field} é obrigatório.`);
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;
    
    if (cartItems.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione produtos ao carrinho antes de finalizar a compra.');
      return;
    }

    try {
      setLoading(true);
      await axiosInstance.post('/pedidos', {
        endereco_entrega: address
      });
      
      Alert.alert(
        'Pedido Realizado',
        'Seu pedido foi realizado com sucesso!',
        [
          { 
            text: 'Ver Meus Pedidos', 
            onPress: () => navigation.navigate('OrderHistory') 
          }
        ]
      );
      
      // Navegar para a tela inicial ou histórico de pedidos
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      console.error('Erro ao finalizar pedido:', err);
      Alert.alert('Erro', 'Não foi possível finalizar o pedido. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && cartItems.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando informações...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Resumo do Pedido</Text>
        <Divider style={styles.divider} />
        
        {cartItems.map(item => (
          <View key={item.id} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.produto.nome} x{item.quantidade}</Text>
            <Text style={styles.itemPrice}>
              R$ {(item.preco_unitario * item.quantidade).toFixed(2)}
            </Text>
          </View>
        ))}
        
        <Divider style={styles.divider} />
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Endereço de Entrega</Text>
        <Divider style={styles.divider} />
        
        <Input
          placeholder="Rua"
          leftIcon={{ type: 'material', name: 'location-on' }}
          value={address.rua}
          onChangeText={(value) => handleInputChange('rua', value)}
        />
        
        <View style={styles.rowInputs}>
          <Input
            placeholder="Número"
            containerStyle={styles.numberInput}
            keyboardType="numeric"
            value={address.numero}
            onChangeText={(value) => handleInputChange('numero', value)}
          />
          
          <Input
            placeholder="Complemento (opcional)"
            containerStyle={styles.complementInput}
            value={address.complemento}
            onChangeText={(value) => handleInputChange('complemento', value)}
          />
        </View>
        
        <Input
          placeholder="Bairro"
          value={address.bairro}
          onChangeText={(value) => handleInputChange('bairro', value)}
        />
        
        <View style={styles.rowInputs}>
          <Input
            placeholder="Cidade"
            containerStyle={styles.cityInput}
            value={address.cidade}
            onChangeText={(value) => handleInputChange('cidade', value)}
          />
          
          <Input
            placeholder="Estado"
            containerStyle={styles.stateInput}
            value={address.estado}
            onChangeText={(value) => handleInputChange('estado', value)}
          />
        </View>
        
        <Input
          placeholder="CEP"
          keyboardType="numeric"
          value={address.cep}
          onChangeText={(value) => handleInputChange('cep', value)}
        />
      </View>
      
      <View style={styles.section}>
        <Text h4 style={styles.sectionTitle}>Método de Pagamento</Text>
        <Divider style={styles.divider} />
        <Text style={styles.paymentInfo}>
          O pagamento será realizado na entrega.
        </Text>
      </View>
      
      <Button
        title={loading ? "Processando..." : "Finalizar Pedido"}
        icon={<Icon name="check" color="white" />}
        buttonStyle={styles.checkoutButton}
        onPress={handlePlaceOrder}
        disabled={loading}
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
  section: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 15,
    margin: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  divider: {
    marginVertical: 10,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  itemName: {
    flex: 3,
    fontSize: 16,
  },
  itemPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
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
  rowInputs: {
    flexDirection: 'row',
  },
  numberInput: {
    flex: 1,
  },
  complementInput: {
    flex: 2,
  },
  cityInput: {
    flex: 2,
  },
  stateInput: {
    flex: 1,
  },
  paymentInfo: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#666',
    padding: 10,
  },
  checkoutButton: {
    margin: 20,
    borderRadius: 5,
    backgroundColor: '#2089dc',
    padding: 15,
  },
});

export default CheckoutScreen;
