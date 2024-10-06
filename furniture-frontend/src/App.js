import React from 'react';
import Header from './components/Header';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Wishlist from './components/Wishlist';
import Home from './components/Home';
import Login from './components/Authentication/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Seller from './components/Seller';
import Signup from './components/Authentication/Signup';
import StockManagement from './components/StockManagement';
import Dashboard from './components/AdminDashboard';
import AdminProductPage from './components/AdminProductPage'; 
import CategoriesPage from './components/CategoriesPage';
import ProductDetails from './components/ProductDetails';
import UserSignup from './components/Authentication/SignUp/UserSignup';
import SellerSignup from './components/Authentication/SignUp/SellerSignup';

const App = () => (
  <Router>
    {/* Conditional Rendering of Header */}
    <Routes>
      <Route path="/" element={<><Header /><Home /></>} />
      <Route path="/products" element={<><Header /><CategoriesPage /></>} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/login" element={<Login />} />
      <Route path="/seller" element={<Seller />} />
      <Route path="/stocks" element={<StockManagement />} />
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/products" element={<AdminProductPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/products/:id" element={<><Header /><ProductDetails /></>} /> 
      <Route path="/signupuser" element={<UserSignup />} />
     <Route path="/signupseller" element={<SellerSignup />} /> {/* Including Header here */}
    </Routes>
  </Router>
);

export default App;
