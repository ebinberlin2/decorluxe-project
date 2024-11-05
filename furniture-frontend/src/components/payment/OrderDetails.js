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
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  // Base URL for API requests
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem('authToken');

      try {
        const { data } = await axios.get(`${BASE_URL}/api/orders/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (error) {
        toast.error('Failed to load order details.');
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (!order) {
    return <Typography variant="body1" align="center">Loading order details...</Typography>;
  }

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
            Order ID: {order._id}
          </Typography>
        </Box>

        <Grid container spacing={4} mb={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Customer Details
            </Typography>
            <Typography variant="body1"><strong>Name:</strong> {order.fullName}</Typography>
            <Typography variant="body1"><strong>Email:</strong> {order.email}</Typography>
            <Typography variant="body1"><strong>Phone:</strong> {order.phone}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              Shipping Address
            </Typography>
            <Typography variant="body1"><strong>Address:</strong> {order.address}</Typography>
            <Typography variant="body1"><strong>City:</strong> {order.city}</Typography>
            <Typography variant="body1"><strong>State:</strong> {order.state}</Typography>
            <Typography variant="body1"><strong>Zip Code:</strong> {order.zipCode}</Typography>
            <Typography variant="body1"><strong>Country:</strong> {order.country}</Typography>
          </Grid>
        </Grid>

        <Divider sx={{ marginY: '20px' }} />

        <Typography variant="h6" sx={{ marginBottom: '20px', color: '#555' }}>
          <ShoppingCartIcon fontSize="small" sx={{ marginRight: '8px' }} />
          Items in Your Order
        </Typography>

        <Grid container spacing={3}>
          {order.items.map((item) => (
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
            Total Amount: ₹{order.totalAmount / 100}
          </Typography>
          <Typography variant="body1"><strong>Payment Status:</strong> {order.paymentStatus}</Typography>
          <Typography variant="body1"><strong>Payment ID:</strong> {order.paymentId}</Typography>
          <Typography variant="body1"><strong>Razorpay Order ID:</strong> {order.razorpayOrderId}</Typography>
          <Typography variant="body1"><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</Typography>
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
