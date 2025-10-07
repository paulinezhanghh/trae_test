import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Box, CircularProgress } from '@mui/material';
import { useTripContext } from '../../contexts/TripContext';

// This is a placeholder for the Google Places API integration
// In a real implementation, we would use the actual API
const mockPlaceSuggestions = [
  { description: 'Paris, France', placeId: 'place-paris' },
  { description: 'London, United Kingdom', placeId: 'place-london' },
  { description: 'New York, USA', placeId: 'place-newyork' },
  { description: 'Tokyo, Japan', placeId: 'place-tokyo' },
  { description: 'Rome, Italy', placeId: 'place-rome' },
];

interface PlaceSuggestion {
  description: string;
  placeId: string;
}

const DestinationInput: React.FC = () => {
  const { tripDetails, setTripDetails } = useTripContext();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<PlaceSuggestion[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions([]);
      return undefined;
    }

    setLoading(true);

    // In a real implementation, this would be an API call to Google Places
    const fetchPlaces = () => {
      setTimeout(() => {
        if (active) {
          const filteredOptions = mockPlaceSuggestions.filter((option) =>
            option.description.toLowerCase().includes(inputValue.toLowerCase())
          );
          setOptions(filteredOptions);
          setLoading(false);
        }
      }, 500);
    };

    fetchPlaces();

    return () => {
      active = false;
    };
  }, [inputValue]);

  return (
    <Autocomplete
      id="destination-autocomplete"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.description === value.description}
      getOptionLabel={(option) => option.description}
      options={options}
      loading={loading}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      onChange={(event, newValue) => {
        if (newValue) {
          setTripDetails({
            ...tripDetails,
            destination: newValue.description,
            placeId: newValue.placeId,
          });
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Where do you want to go?"
          variant="outlined"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
};

export default DestinationInput;