import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExploreIcon from '@mui/icons-material/Explore';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 4
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            background: 'linear-gradient(to right bottom, #ffffff, #f5f5f5)',
            width: '100%'
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#3f51b5' }}>
            Triply
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, color: '#757575' }}>
            Plan your perfect trip with AI-powered itineraries
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="body1" paragraph>
              Create personalized travel plans based on your preferences, 
              discover local gems, and enjoy stress-free trip planning.
            </Typography>
          </Box>
          
          <Button 
            variant="contained" 
            size="large" 
            startIcon={<ExploreIcon />}
            onClick={() => navigate('/plan')}
            sx={{ 
              py: 1.5, 
              px: 4, 
              borderRadius: 8,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #3f51b5 30%, #2196f3 90%)',
              boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)'
            }}
          >
            Start Planning
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default HomePage;