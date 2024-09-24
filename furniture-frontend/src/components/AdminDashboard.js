import React from 'react';
import './AdminDashboard.css';
import { Link } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';

const AdminDashboard = () => {
  // Sample data for the charts
  const salesData = [
    { name: '12AM', orders: 500, revenue: 750 },
    { name: '4AM', orders: 600, revenue: 700 },
    { name: '8AM', orders: 450, revenue: 680 },
    { name: '12PM', orders: 750, revenue: 920 },
    { name: '4PM', orders: 820, revenue: 880 },
    { name: '8PM', orders: 920, revenue: 960 },
  ];

  const deviceData = [
    { name: 'Mon', Sales: 200 },
    { name: 'Tue', Sales: 300 },
    { name: 'Wed', Sales: 400 },
    { name: 'Thu', Sales: 500 },
    { name: 'Fri', Sales: 450 },
    { name: 'Sat', Sales: 220 },
  ];

  return (
    <div className="admin-dashboard-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo-section">
          <h2>EBIN BERLIN</h2>
        </div>
        <div className="admin-menu-section">
          <ul>
            <li className="active">Dashboard</li>
            <li>Orders</li>
            <li>
              <Link to="/admin/products">Products</Link>
            </li>
            <li>Customers</li>
            <li>Analytics</li>
            <li>Settings</li>
          </ul>
        </div>
      </aside>

      {/* Main Dashboard */}
      <div className="admin-main-dashboard">
        {/* <header className="admin-dashboard-header">
          <button className="admin-primary-btn">+ Add New Product</button>
        </header> */}

        {/* Dashboard Stats */}
        <div className="admin-dashboard-stats">
          <div className="admin-stat-card">
            <h3>Total Orders</h3>
            <h1>1,254</h1>
          </div>
          <div className="admin-stat-card">
            <h3>Total Revenue</h3>
            <h1>$45,890</h1>
          </div>
          <div className="admin-stat-card">
            <h3>New Customers</h3>
            <h1>320</h1>
          </div>
          <div className="admin-stat-card">
            <h3>Conversion Rate</h3>
            <h1>3.2%</h1>
          </div>
        </div>

        {/* Sales Performance */}
        <div className="admin-performance-section">
          <div className="admin-sales-performance card">
            <h2>Today's Sales Performance</h2>
            <LineChart
              width={600}
              height={250}
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </div>

          <div className="admin-device-consumption card">
            <h2>Weekday Sales</h2>
            <BarChart
              width={400}
              height={250}
              data={deviceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="power" fill="#82ca9d" />
            </BarChart>
          </div>
        </div>
      </div>

      {/* Optional Right Sidebar */}
      {/* 
        <aside className="admin-right-sidebar">
          <div className="admin-sidebar-section">
            <h2>Recent Activity</h2>
            <ul>
              <li>Activate home wake-up mode.</li>
              <li>2 lights and 1 fan are switched on.</li>
              <li>1 Air Conditioner is on and set to Cool mode.</li>
            </ul>
          </div>
        </aside> 
      */}
    </div>
  );
};

export default AdminDashboard;
