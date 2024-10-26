import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const token = localStorage.getItem('authToken');

      try {
        const { data } = await axios.get(`http://localhost:5000/api/orders/${orderId}`, {
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
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '20px auto' }}>
      <Typography variant="h4" align="center">Order Details</Typography>
      <Typography variant="h6" style={{ margin: '20px 0' }}>Order ID: {order._id}</Typography>

      <Typography variant="h6">Customer Details:</Typography>
      <Typography variant="body1">Name: {order.fullName}</Typography>
      <Typography variant="body1">Email: {order.email}</Typography>
      <Typography variant="body1">Phone: {order.phone}</Typography>
      <Typography variant="body1">Address: {order.address}</Typography>
      <Typography variant="body1">City: {order.city}</Typography>
      <Typography variant="body1">State: {order.state}</Typography>
      <Typography variant="body1">Zip Code: {order.zipCode}</Typography>
      <Typography variant="body1">Country: {order.country}</Typography>
      
      <Typography variant="h6" style={{ margin: '20px 0' }}>Your Cart Items:</Typography>
      <List>
        {order.items.map((item) => (
          <React.Fragment key={item.product._id}>
            <ListItem>
              <ListItemText
                primary={`${item.product.name} (x${item.quantity})`}
                secondary={`Price: ₹${(item.product.price * item.quantity) / 100}`} // Adjusting for amount
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>

      <Typography variant="h6" style={{ margin: '20px 0' }}>Total Amount: ₹{order.totalAmount / 100}</Typography>
      <Typography variant="body1">Payment Status: {order.paymentStatus}</Typography>
      <Typography variant="body1">Payment ID: {order.paymentId}</Typography>
      <Typography variant="body1">Razorpay Order ID: {order.razorpayOrderId}</Typography>
      <Typography variant="body1">Order Date: {new Date(order.createdAt).toLocaleString()}</Typography>
    </Paper>
  );
};

export default OrderDetails;
