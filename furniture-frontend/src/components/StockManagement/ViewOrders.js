import React, { useEffect, useState } from 'react';

// Hardcoded base URL
const BASE_URL = 'https://decorluxe-project-backend.onrender.com'; // Change this to your actual base URL

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const token = localStorage.getItem('authToken'); // Use the correct token key
    try {
      const response = await fetch(`${BASE_URL}/api/seller-orders`, { // Use the hardcoded base URL
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Fetched orders:', data); // Debugging log
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              <p><strong>Full Name:</strong> {order.fullName}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}, {order.zipCode}, {order.country}</p>
              <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewOrders;
