import React from 'react';
import { Box, Typography, Button, Container, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DestinationInput from '../components/input/DestinationInput';
import DateRangePicker from '../components/input/DateRangePicker';
import PreferencesForm from '../components/input/PreferencesForm';
import { useTripContext } from '../contexts/TripContext';
import { ItineraryService } from '../services/ItineraryService';

const steps = ['Destination', 'Dates', 'Preferences'];

const PlanPage: React.FC = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const navigate = useNavigate();
  const { tripDetails, setItinerary, setIsGenerating } = useTripContext();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleGenerateItinerary = async () => {
    console.log('Starting itinerary generation with details:', tripDetails);
    setIsGenerating(true);
    try {
      const generatedItinerary = await ItineraryService.generateItinerary(tripDetails);
      console.log('Itinerary generated successfully:', generatedItinerary);
      setItinerary(generatedItinerary);
      console.log('Navigating to /itinerary');
      navigate('/itinerary');
    } catch (error) {
      console.error('Error generating itinerary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <DestinationInput />;
      case 1:
        return <DateRangePicker />;
      case 2:
        return <PreferencesForm />;
      default:
        return 'Unknown step';
    }
  };

  const isNextDisabled = () => {
    switch (activeStep) {
      case 0:
        return !tripDetails.destination;
      case 1:
        return !tripDetails.startDate || !tripDetails.endDate;
      default:
        return false;
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, textAlign: 'center' }}>
            Plan Your Trip
          </Typography>

          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box sx={{ mt: 4, mb: 4 }}>
            {getStepContent(activeStep)}
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={handleGenerateItinerary}
                disabled={isNextDisabled()}
              >
                Generate Itinerary
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isNextDisabled()}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default PlanPage;