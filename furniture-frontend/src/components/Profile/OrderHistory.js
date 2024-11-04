// components/UserOrders.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Avatar,
    Button,
    CircularProgress,
    Typography,
    Paper
} from '@mui/material';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user-orders', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        navigate('/login'); // Redirect to login if unauthorized
                    } else {
                        throw new Error('Failed to fetch user orders');
                    }
                }

                const ordersData = await response.json();
                setOrders(ordersData);
            } catch (error) {
                console.error("Error fetching user orders:", error);
                setError("Failed to load user orders. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, [navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
                <Typography variant="h6" sx={{ marginLeft: 2, color: 'white' }}>Loading your orders...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box textAlign="center" color="red" marginTop={2}>
                {error}
            </Box>
        );
    }

    return (
        <Box sx={{ padding: 4, backgroundColor: '#121212', minHeight: '100vh', color: 'white' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Your Orders
            </Typography>
            <List>
                {orders.map((order) => (
                    <Paper key={order._id} elevation={3} sx={{ marginBottom: 2, borderRadius: 2, padding: 2, backgroundColor: '#1e1e1e' }}>
                        <ListItem>
                            <ListItemAvatar>
                                {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                                    <Avatar
                                        alt={order.items[0]?.product?.name || 'Product Image'}
                                        src={
                                            order.items[0]?.product?.imageUrls[0] || 'https://via.placeholder.com/80'
                                        }
                                    />
                                ) : (
                                    <Avatar src='https://via.placeholder.com/80' alt='No product image available' />
                                )}
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Typography variant="h6" color="white">Order ID: {order._id}</Typography>}
                                secondary={
                                    <Box>
                                        <Typography variant="body2" color="white">
                                            Total Amount: Rs.{order.totalAmount}
                                        </Typography>
                                        <Typography variant="body2" color="white">
                                            Items: {Array.isArray(order.items) ? order.items.length : 0}
                                        </Typography>
                                        <Box mt={1}>
                                            {order.items.map((item, index) => (
                                                <Typography key={index} variant="body2" color="white">
                                                    - {item.product?.name || 'Unnamed Product'}
                                                </Typography>
                                            ))}
                                        </Box>
                                    </Box>
                                }
                            />
                            <Box>
                                <Button
                                    variant="contained"
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                    sx={{
                                        bgcolor: '#bb86fc',
                                        color: 'white',
                                        '&:hover': {
                                            bgcolor: '#3700b3',
                                        },
                                        padding: '10px 20px',
                                        borderRadius: '25px', // Rounded corners for a modern look
                                        textTransform: 'none', // Prevent uppercase
                                    }}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </ListItem>
                    </Paper>
                ))}
            </List>
        </Box>
    );
};

export default UserOrders;
