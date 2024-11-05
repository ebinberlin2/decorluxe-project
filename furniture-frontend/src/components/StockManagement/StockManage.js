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
        {activeView === 'add' && <AddProduct />}
        {activeView === 'view' && <ViewProducts />}
        {activeView === 'orders' && <ViewOrders />} {/* Render ViewOrders component */}
      </main>
    </ThemeProvider>
  );
};

export default StockManagement;
