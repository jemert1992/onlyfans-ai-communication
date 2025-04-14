import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [pageTitle, setPageTitle] = React.useState('Dashboard');

  // Update page title based on current route
  React.useEffect(() => {
    const path = window.location.pathname;
    
    if (path === '/') {
      setPageTitle('Dashboard');
    } else if (path.includes('/messages')) {
      setPageTitle('Messages');
    } else if (path.includes('/style-settings')) {
      setPageTitle('Style Settings');
    } else if (path.includes('/settings')) {
      setPageTitle('Settings');
    }
  }, [window.location.pathname]);

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <Header title={pageTitle} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default'
        }}
      >
        <Toolbar /> {/* This creates space below the fixed app bar */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
