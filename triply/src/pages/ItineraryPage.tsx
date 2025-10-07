import React from 'react';
import { Box, Container, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ItineraryView from '../components/itinerary/ItineraryView';
import { useTripContext } from '../contexts/TripContext';

const ItineraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { itinerary, tripDetails, isGenerating } = useTripContext();

  // Redirect to plan page if no itinerary exists
  React.useEffect(() => {
    console.log('ItineraryPage - Current itinerary:', itinerary);
    console.log('ItineraryPage - isGenerating:', isGenerating);
    if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
      console.log('ItineraryPage - No itinerary found, redirecting to /plan');
      navigate('/plan');
    }
  }, [itinerary, navigate, isGenerating]);

  if (!itinerary || !itinerary.days || itinerary.days.length === 0) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
          {isGenerating ? (
            <>
              <CircularProgress size={60} sx={{ mb: 3 }} />
              <Typography variant="h5" align="center">
                Generating your personalized itinerary...
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary" sx={{ mt: 2 }}>
                This may take a few moments
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h5" align="center">
                No itinerary found
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/plan')}
                sx={{ mt: 3 }}
              >
                Return to Planning
              </Button>
            </>
          )}
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/plan')}
            variant="outlined"
            sx={{ mb: 2 }}
          >
            Back to Planning
          </Button>
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          Your Trip to {tripDetails.destination}
        </Typography>
        
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          {new Date(tripDetails.startDate).toLocaleDateString()} - {new Date(tripDetails.endDate).toLocaleDateString()}
        </Typography>

        <Box sx={{ mt: 4 }}>
          <ItineraryView itinerary={itinerary} />
        </Box>
      </Box>
    </Container>
  );
};

export default ItineraryPage;