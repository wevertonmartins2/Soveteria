import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from '@rneui/themed';
import { AuthProvider, AuthContext } from '../contexts/AuthContext';

// Telas de autenticação
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Telas de produtos
import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailScreen from '../screens/products/ProductDetailScreen';

// Telas de carrinho e checkout
import CartScreen from '../screens/cart/CartScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';

// Telas de pedidos
import OrderHistoryScreen from '../screens/orders/OrderHistoryScreen';
import OrderDetailScreen from '../screens/orders/OrderDetailScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação para usuários não autenticados
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: true }}>
    <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
    <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar Conta' }} />
  </Stack.Navigator>
);

// Navegação para produtos
const ProductsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Produtos' }} />
    <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Detalhes do Produto' }} />
  </Stack.Navigator>
);

// Navegação para carrinho e checkout
const CartStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="CartScreen" component={CartScreen} options={{ title: 'Meu Carrinho' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Finalizar Compra' }} />
  </Stack.Navigator>
);

// Navegação para pedidos
const OrdersStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} options={{ title: 'Meus Pedidos' }} />
    <Stack.Screen name="OrderDetail" component={OrderDetailScreen} options={{ title: 'Detalhes do Pedido' }} />
  </Stack.Navigator>
);

// Navegação principal com tabs para usuários autenticados
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Products') {
          iconName = 'ice-cream';
        } else if (route.name === 'Cart') {
          iconName = 'shopping-cart';
        } else if (route.name === 'Orders') {
          iconName = 'receipt';
        }

        return <Icon name={iconName} type="material" size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2089dc',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen 
      name="Products" 
      component={ProductsStack} 
      options={{ 
        headerShown: false,
        title: 'Produtos'
      }} 
    />
    <Tab.Screen 
      name="Cart" 
      component={CartStack} 
      options={{ 
        headerShown: false,
        title: 'Carrinho'
      }} 
    />
    <Tab.Screen 
      name="Orders" 
      component={OrdersStack} 
      options={{ 
        headerShown: false,
        title: 'Pedidos'
      }} 
    />
  </Tab.Navigator>
);

// Navegação principal que verifica autenticação
const AppNavigator = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AuthContext.Consumer>
          {({ isAuthenticated, loading }) => {
            if (loading) {
              return null; // Ou um componente de loading
            }
            
            return (
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isAuthenticated ? (
                  <Stack.Screen name="Main" component={MainTabs} />
                ) : (
                  <Stack.Screen name="Auth" component={AuthStack} />
                )}
              </Stack.Navigator>
            );
          }}
        </AuthContext.Consumer>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default AppNavigator;
