import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Grid,
  Box,
  Paper,
  Avatar,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fixed Base URL for API requests
  const BASE_URL = 'https://decorluxe-project-backend.onrender.com';

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem('authToken');

      try {
        const { data } = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (error) {
        setError('Failed to load order details.');
        toast.error('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="body1" color="error">{error}</Typography>
      </Box>
    );
  }

  const {
    _id,
    fullName,
    email,
    phone,
    address,
    city,
    state,
    zipCode,
    country,
    items,
    totalAmount,
    paymentStatus,
    paymentId,
    razorpayOrderId,
    createdAt,
  } = order;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f7f7f7',
        padding: '20px',
      }}
    >
      <Paper
        elevation={5}
        sx={{
          width: '100%',
          maxWidth: '1200px',
          borderRadius: '12px',
          overflow: 'hidden',
          padding: '30px',
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#333' }}>
          Order Details
        </Typography>
        <Divider sx={{ marginBottom: '20px' }} />

        <Box mb={3}>
          <Typography variant="h6" color="primary">
            Order ID: {orderId}
          </Typography>
        </Box>

        <Grid container spacing={4} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Customer Details
            </Typography>
            <Typography variant="body1"><strong>Name:</strong> {fullName}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {email}</Typography>
            <Typography variant="body1"><strong>Phone:</strong> {phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Shipping Address
            </Typography>
            <Typography variant="body1"><strong>Address:</strong> {address}</Typography>
            <Typography variant="body1"><strong>City:</strong> {city}</Typography>
            <Typography variant="body1"><strong>State:</strong> {state}</Typography>
            <Typography variant="body1"><strong>Zip Code:</strong> {zipCode}</Typography>
            <Typography variant="body1"><strong>Country:</strong> {country}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: '20px' }} />

        <Typography variant="h6" sx={{ marginBottom: '20px', color: '#555' }}>
          <ShoppingCartIcon fontSize="small" sx={{ marginRight: '8px' }} />
          Items in Your Order
        </Typography>

        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.product._id}>
              <Paper
                elevation={3}
                sx={{
                  padding: '15px',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  src={item.product.imageUrls.length > 0 ? item.product.imageUrls[0] : 'https://via.placeholder.com/150'}
                  alt={item.product.name}
                  variant="square"
                  sx={{
                    width: '100%',
                    height: '200px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    objectFit: 'cover',
                  }}
                />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {item.product.name} (x{item.quantity})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Price: ₹{(item.product.price * item.quantity) / 100}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box mt={4} sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary" sx={{ marginBottom: '10px' }}>
            <MonetizationOnIcon fontSize="small" sx={{ marginRight: '8px' }} />
            Total Amount: ₹{totalAmount / 100}
          </Typography>
          <Typography variant="body1"><strong>Payment Status:</strong> {paymentStatus}</Typography>
          <Typography variant="body1"><strong>Payment ID:</strong> {paymentId}</Typography>
          <Typography variant="body1"><strong>Razorpay Order ID:</strong> {razorpayOrderId}</Typography>
          <Typography variant="body1"><strong>Order Date:</strong> {new Date(createdAt).toLocaleString()}</Typography>
        </Box>

        <Box mt={4} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={() => window.print()}>
            Print Order Details
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default OrderDetails;
