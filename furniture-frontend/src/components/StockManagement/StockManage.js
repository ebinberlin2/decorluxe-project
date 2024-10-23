import React, { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline, Drawer, List, ListItem, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import AddProduct from './AddProduct';
import ViewProducts from './ViewProduct';

const StockManagement = () => {
  const [activeView, setActiveView] = useState('add');

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const theme = createTheme({
    palette: {
      mode: 'light',
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
              <ListItemText primary="Add Product" />
            </ListItem>
            <ListItem button onClick={() => handleViewChange('view')}>
              <ListItemText primary="View Products" />
            </ListItem>
          </List>
        </div>
      </Drawer>

      <main style={{ marginLeft: 240, padding: 20 }}>
        <Toolbar />
        {activeView === 'add' && <AddProduct />}
        {activeView === 'view' && <ViewProducts />}
      </main>
    </ThemeProvider>
  );
};

export default StockManagement;
