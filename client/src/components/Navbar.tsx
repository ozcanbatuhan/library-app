import { AppBar, Toolbar, Button, Box, Typography } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ mr: 4 }}>
          Library Management
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ 
              mr: 2,
              backgroundColor: location.pathname === '/' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Users
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/books')}
            sx={{ 
              backgroundColor: location.pathname === '/books' ? 'rgba(255,255,255,0.1)' : 'transparent'
            }}
          >
            Books
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 