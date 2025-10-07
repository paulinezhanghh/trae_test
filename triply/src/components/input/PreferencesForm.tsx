import React from 'react';
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Select,
  MenuItem,
  Switch,
  InputLabel,
  Paper,
  Grid,
} from '@mui/material';
import { useTripContext } from '../../contexts/TripContext';

const PreferencesForm: React.FC = () => {
  const { tripDetails, setTripDetails } = useTripContext();
  const { preferences } = tripDetails;

  const handleTripStyleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTripDetails({
      ...tripDetails,
      preferences: {
        ...preferences,
        tripStyle: event.target.value as 'Relaxed' | 'Balanced' | 'Packed',
      },
    });
  };

  const handleInterestChange = (interest: keyof typeof preferences.interests) => (
    event: Event,
    newValue: number | number[]
  ) => {
    setTripDetails({
      ...tripDetails,
      preferences: {
        ...preferences,
        interests: {
          ...preferences.interests,
          [interest]: newValue as number,
        },
      },
    });
  };

  const handleBudgetChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTripDetails({
      ...tripDetails,
      preferences: {
        ...preferences,
        budget: event.target.value as 'Economy' | 'Mid-range' | 'Premium',
      },
    });
  };

  const handleCompanionsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTripDetails({
      ...tripDetails,
      preferences: {
        ...preferences,
        companions: event.target.value as 'Solo' | 'Couple' | 'Family' | 'Friends',
      },
    });
  };

  const handleWalkingDistanceChange = (event: Event, newValue: number | number[]) => {
    setTripDetails({
      ...tripDetails,
      preferences: {
        ...preferences,
        mobility: {
          ...preferences.mobility,
          walkingDistance: newValue as number,
        },
      },
    });
  };

  const handleAccessibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTripDetails({
      ...tripDetails,
      preferences: {
        ...preferences,
        mobility: {
          ...preferences.mobility,
          accessibility: event.target.checked,
        },
      },
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        Trip Preferences
      </Typography>

      <Grid container spacing={4}>
        {/* Trip Style */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Trip Style
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={preferences.tripStyle}
              onChange={handleTripStyleChange}
            >
              <FormControlLabel value="Relaxed" control={<Radio />} label="Relaxed" />
              <FormControlLabel value="Balanced" control={<Radio />} label="Balanced" />
              <FormControlLabel value="Packed" control={<Radio />} label="Packed" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Budget */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Budget
          </Typography>
          <FormControl component="fieldset">
            <RadioGroup
              row
              value={preferences.budget}
              onChange={handleBudgetChange}
            >
              <FormControlLabel value="Economy" control={<Radio />} label="Economy" />
              <FormControlLabel value="Mid-range" control={<Radio />} label="Mid-range" />
              <FormControlLabel value="Premium" control={<Radio />} label="Premium" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Companions */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="companions-label">Traveling With</InputLabel>
            <Select
              labelId="companions-label"
              id="companions-select"
              value={preferences.companions}
              label="Traveling With"
              onChange={handleCompanionsChange}
            >
              <MenuItem value="Solo">Solo</MenuItem>
              <MenuItem value="Couple">Couple</MenuItem>
              <MenuItem value="Family">Family</MenuItem>
              <MenuItem value="Friends">Friends</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Mobility */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom>
            Mobility
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Maximum walking distance: {preferences.mobility.walkingDistance} meters
            </Typography>
            <Slider
              value={preferences.mobility.walkingDistance}
              onChange={handleWalkingDistanceChange}
              min={500}
              max={5000}
              step={100}
              marks={[
                { value: 500, label: '500m' },
                { value: 2000, label: '2km' },
                { value: 5000, label: '5km' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.mobility.accessibility}
                onChange={handleAccessibilityChange}
              />
            }
            label="Require accessibility features"
          />
        </Grid>

        {/* Interests */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Interests
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(preferences.interests).map(([interest, value]) => (
              <Grid item xs={12} sm={6} md={4} key={interest}>
                <Typography variant="body2" gutterBottom sx={{ textTransform: 'capitalize' }}>
                  {interest}
                </Typography>
                <Slider
                  value={value}
                  onChange={handleInterestChange(interest as keyof typeof preferences.interests)}
                  min={1}
                  max={5}
                  marks
                  valueLabelDisplay="auto"
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PreferencesForm;