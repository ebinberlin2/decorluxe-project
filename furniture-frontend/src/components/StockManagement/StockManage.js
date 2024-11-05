import React, { useState } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
} from '@mui/material';
import AddProduct from './AddProduct';
import ViewProducts from './ViewProduct';
import ViewOrders from './ViewOrders'; // Import the new ViewOrders component

// Hardcoded base URL
const BASE_URL = 'http://localhost:5000'; // Change this to your actual base URL

const StockManagement = () => {
  const [activeView, setActiveView] = useState('add');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const theme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1E1E1E',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Drawer variant="permanent" anchor="left">
        <Toolbar />
        <div>
          <List>
            <ListItem button onClick={() => handleViewChange('add')}>
              <ListItemText primary="Add Product" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <ListItem button onClick={() => handleViewChange('view')}>
              <ListItemText primary="View Products" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
            <ListItem button onClick={() => handleViewChange('orders')}> {/* New View Orders button */}
              <ListItemText primary="View Orders" primaryTypographyProps={{ style: { color: '#ffffff' } }} />
            </ListItem>
          </List>
        </div>
      </Drawer>

      <main style={{ marginLeft: 240, padding: 20, backgroundColor: theme.palette.background.default }}>
        <Toolbar />
        {activeView === 'add' && <AddProduct baseUrl={BASE_URL} />} {/* Pass BASE_URL as prop */}
        {activeView === 'view' && <ViewProducts baseUrl={BASE_URL} />} {/* Pass BASE_URL as prop */}
        {activeView === 'orders' && <ViewOrders baseUrl={BASE_URL} />} {/* Pass BASE_URL as prop */}
      </main>
    </ThemeProvider>
  );
};

export default StockManagement;
