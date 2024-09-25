import React from 'react';
import Header from './components/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Wishlist from './components/Wishlist';
import Home from './components/Home';
import Login from './components/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Signup from './components/Signup';
import Seller from './components/Seller';
import StockManagement from './components/StockManagement';
import Dashboard from './components/AdminDashboard';
import AdminProductPage from './components/AdminProductPage'; 
import CategoriesPage from './components/CategoriesPage';
import ProductDetails from './components/ProductDetails';

const App = () => (
  <Router>
    {/* Conditional Rendering of Header */}
    <Routes>
      <Route path="/" element={<><Header /><Home /></>} />
      <Route path="/products" element={<><Header /><CategoriesPage /></>} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/seller" element={<Seller />} />
      <Route path="/stocks" element={<StockManagement />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/products" element={<AdminProductPage />} />
      <Route path="/products/:id" element={<><Header /><ProductDetails /></>} />  {/* Including Header here */}
    </Routes>
  </Router>
);

export default App;
