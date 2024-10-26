import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';  // Import useNavigate for navigation

const Checkout = () => {
  const [userDetails, setUserDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Initialize navigate

  // Function to fetch cart items
  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.warn('Please log in to access your cart.');
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:5000/api/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (Array.isArray(data) && data.length > 0) {
          setItems(data);
        } else {
          toast.warn('No items found in cart.');
        }
      } catch (error) {
        toast.error('Failed to load cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const orderData = { ...userDetails, items };

      const { data } = await axios.post('http://localhost:5000/api/checkout/create', orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const options = {
        key: 'rzp_test_Afc2OwMLThkxdk',
        amount: data.order.totalAmount,
        currency: 'INR',
        name: 'Your Shop',
        description: 'Test Transaction',
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            const verifyResponse = await axios.post('http://localhost:5000/api/checkout/verify-payment', {
              orderId: data.order._id,
              paymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }, { headers: { Authorization: `Bearer ${token}` } });

            toast.success('Payment successful! Order placed.');
            navigate(`/order-details/${data.order._id}`);  // Navigate to Order Details page
          } catch (error) {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userDetails.fullName,
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error('Error processing payment.');
    }
  };

  return (
    <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom align="center">
        Checkout
      </Typography>

      {loading ? (
        <Typography variant="body1" align="center">Loading cart items...</Typography>
      ) : (
        <>
          <Typography variant="h6" style={{ margin: '20px 0' }}>Your Cart Items</Typography>
          <List>
            {items.length > 0 ? (
              items.map((item) => (
                <React.Fragment key={item._id}>
                  <ListItem>
                    <ListItemText
                      primary={`${item.product.name} (x${item.quantity})`}
                      secondary={`Price: ₹${item.product.price * item.quantity}`}
                    />
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">No items in cart.</Typography>
            )}
          </List>

          <Grid container spacing={2} style={{ marginTop: '20px' }}>
            {['fullName', 'email', 'phone', 'address', 'city', 'state', 'zipCode', 'country'].map((field) => (
              <Grid item xs={12} sm={field === 'address' ? 12 : 6} key={field}>
                <TextField
                  fullWidth
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  name={field}
                  variant="outlined"
                  onChange={handleChange}
                  type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: '20px' }}
            onClick={handlePayment}
          >
            Proceed to Pay
          </Button>
        </>
      )}
    </Paper>
  );
};

export default Checkout;
