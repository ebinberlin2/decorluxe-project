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
  AppBar,
  Typography,
} from '@mui/material';
import AddProduct from './AddProduct';
import ViewProducts from './ViewProduct';

const StockManagement = () => {
  const [activeView, setActiveView] = useState('add');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const theme = createTheme({
    palette: {
      mode: 'dark', // Set the theme mode to dark
      background: {
        default: '#121212', // Dark background
        paper: '#1E1E1E', // Paper background for cards and drawers
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap>
            Stock Management
          </Typography>
        </Toolbar>
      </AppBar> */}

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
          </List>
        </div>
      </Drawer>

      <main style={{ marginLeft: 240, padding: 20, backgroundColor: theme.palette.background.default }}>
        <Toolbar />
        {activeView === 'add' && <AddProduct />}
        {activeView === 'view' && <ViewProducts />}
      </main>
    </ThemeProvider>
  );
};

export default StockManagement;
