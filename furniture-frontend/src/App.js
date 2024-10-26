import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Wishlist from './components/Wishlist';
import Home from './components/Home';
import Login from './components/Authentication/Login/Login';
import Seller from './components/Seller';
import Signup from './components/Authentication/Signup';
import Dashboard from './components/Admin/AdminDashboard';
import AdminProductPage from './components/Admin/AdminProductPage'; 
import CategoriesPage from './components/CategoriesPage';
import ProductDetails from './components/ProductDetails';
import UserSignup from './components/Authentication/SignUp/UserSignup';
import SellerSignup from './components/Authentication/SignUp/SellerSignup';
import Profile from './components/Profile/Profile';
import Cart from './components/Cart';
import StockManagement from './components/StockManagement/StockManage'; // Update if you meant StockManagement.js
import AddProduct from './components/StockManagement/AddProduct'; 
import ViewProduct from './components/StockManagement/ViewProduct'; // Changed to ViewProduct
import AdminSellersPage from './components/Admin/adminSellerPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import AdminUserPage from './components/Admin/AdminUserPage';
import Checkout from './components/payment/checkout';
import OrderDetails from './components/payment/OrderDetails';
const App = () => (
  <Router>
    
    <Routes>
      <Route path="/" element={<><Header /><Home /></>} />
      <Route path="/products" element={<><Header /><CategoriesPage /></>} />
      <Route path="/wishlist" element={<><Header /><Wishlist /></>} />
      <Route path="/login" element={<Login />} />
      <Route path="/seller" element={<><Header /><Seller /></>} />
      <Route path="/stocks" element={<StockManagement />} /> 
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/products" element={<AdminProductPage />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/products/:id" element={<><Header /><ProductDetails /></>} />
      <Route path="/signupuser" element={<UserSignup />} />
      <Route path="/profile" element={<><Header /><Profile /></>} />
      <Route path="/signupseller" element={<SellerSignup />} />
      <Route path="/cart" element={<><Header /><Cart /></>} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/view-products" element={<ViewProduct />} /> {/* Changed to ViewProduct */}
      <Route path="/admin/sellers" element={<AdminSellersPage />} /> {/* Changed to AdminSellersPage */}
      <Route path="/admin/users" element={<AdminUserPage />} /> 
      <Route path="/checkout" element={<Checkout />} /> 
      <Route path="/order-details/:orderId" element={<OrderDetails />} />
    </Routes>
  </Router>
);

export default App;
