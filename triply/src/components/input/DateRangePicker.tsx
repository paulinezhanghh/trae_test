import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useTripContext } from '../../contexts/TripContext';

const DateRangePicker: React.FC = () => {
  const { tripDetails, setTripDetails } = useTripContext();

  const handleStartDateChange = (date: Date | null) => {
    setTripDetails({
      ...tripDetails,
      startDate: date,
      // If end date is before new start date, update end date
      endDate: tripDetails.endDate && date && tripDetails.endDate < date ? date : tripDetails.endDate,
    });
  };

  const handleEndDateChange = (date: Date | null) => {
    setTripDetails({
      ...tripDetails,
      endDate: date,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: '100%' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Start Date
          </Typography>
          <DatePicker
            value={tripDetails.startDate}
            onChange={handleStartDateChange}
            disablePast
            sx={{ width: '100%' }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            End Date
          </Typography>
          <DatePicker
            value={tripDetails.endDate}
            onChange={handleEndDateChange}
            disablePast
            minDate={tripDetails.startDate || undefined}
            sx={{ width: '100%' }}
          />
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default DateRangePicker;