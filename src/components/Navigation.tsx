'use client';

import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  Box,
  useMediaQuery,
  useTheme,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';
import { useColorMode } from '@/app/theme';

const Navigation = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { mode, toggleColorMode } = useColorMode();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 2,
          backgroundColor: theme.palette.primary.main,
          color: '#fff',
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          FitTrack Pro
        </Typography>
      </Box>
      <List></List>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <FormControlLabel
          control={
            <Switch
              checked={mode === 'dark'}
              onChange={toggleColorMode}
              icon={<LightModeIcon />}
              checkedIcon={<DarkModeIcon />}
            />
          }
          label={mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
        />
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="fixed" elevation={1}>
        <Toolbar>
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 'bold' }}
          >
            FitTrack Pro
          </Typography>

          {!isMobile && (
            <IconButton color="inherit" onClick={toggleColorMode}>
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>
      <Toolbar /> {/* Empty toolbar for spacing */}
    </>
  );
};

export default Navigation;
