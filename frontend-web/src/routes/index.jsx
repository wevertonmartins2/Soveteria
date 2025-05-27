import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import Pages (create these components later)
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProductListPage from '../pages/ProductListPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderHistoryPage from '../pages/OrderHistoryPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage'; // For 404

// Import ProtectedRoute component (create later)
// import ProtectedRoute from './ProtectedRoute';
// import AdminRoute from './AdminRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/produtos" element={<ProductListPage />} />
      <Route path="/produtos/:id" element={<ProductDetailPage />} />

      {/* Protected Routes (Example - requires ProtectedRoute component) */}
      {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedidos" element={<OrderHistoryPage />} />
      {/* </Route> */}

      {/* Admin Routes (Example - requires AdminRoute component) */}
      {/* <Route element={<AdminRoute />}> */}
        <Route path="/admin" element={<AdminDashboardPage />} />
        {/* Add other admin routes here (e.g., product management) */}
      {/* </Route> */}

      {/* Catch-all 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
