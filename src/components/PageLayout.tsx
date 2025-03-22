'use client';

import { Box, Container, Paper } from '@mui/material';
import Navigation from './Navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  withPaper?: boolean;
  fullWidth?: boolean;
}

const PageLayout = ({
  children,
  maxWidth = 'lg',
  withPaper = true,
  fullWidth = false,
}: PageLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navigation />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: { xs: 1, md: 2 },
          px: fullWidth ? 0 : { xs: 1, md: 2 },
          overflow: 'auto',
        }}
      >
        <Container maxWidth={maxWidth} disableGutters={fullWidth}>
          {withPaper ? (
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 2,
                height: '100%',
              }}
            >
              {children}
            </Paper>
          ) : (
            children
          )}
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          py: { xs: 2, md: 3 },
          px: 2,
          backgroundColor: theme =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            © {new Date().getFullYear()} FitTrack Pro - Your Personalized
            Workout Assistant
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PageLayout;
