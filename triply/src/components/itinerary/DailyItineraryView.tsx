import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider,
  Card,
  CardContent,
  Chip,
  Stack
} from '@mui/material';
import { format } from 'date-fns';
import { 
  WbSunny as SunnyIcon,
  Cloud as CloudyIcon,
  Opacity as RainIcon,
  Refresh as RefreshIcon,
  AcUnit as SnowIcon,
  Event as EventIcon
} from '@mui/icons-material';
import { DailyItinerary } from '../../types';
import ActivityCard from './ActivityCard';
import MapPreview from '../maps/MapPreview';

interface DailyItineraryViewProps {
  day: DailyItinerary;
  dayIndex: number;
  onRegenerateDay: (dayIndex: number) => void;
  onSwapActivity: (dayIndex: number, activityIndex: number) => void;
}

const DailyItineraryView: React.FC<DailyItineraryViewProps> = ({ 
  day, 
  dayIndex, 
  onRegenerateDay,
  onSwapActivity
}) => {
  // Get weather icon based on condition
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <RainIcon sx={{ color: '#42A5F5' }} />;
    } else if (lowerCondition.includes('cloud')) {
      return <CloudyIcon sx={{ color: '#78909C' }} />;
    } else if (lowerCondition.includes('snow')) {
      return <SnowIcon sx={{ color: '#B3E5FC' }} />;
    } else {
      return <SunnyIcon sx={{ color: '#FFB300' }} />;
    }
  };
  
  // Check if any activity is an event
  const hasEvents = day.items.some(item => item.activity.category === 'event');

  return (
    <Box sx={{ mb: 4 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          borderRadius: 2, 
          bgcolor: 'background.paper',
          mb: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Day {dayIndex + 1}: {format(day.date, 'EEEE, MMMM d')}
          </Typography>
          
          <Button 
            startIcon={<RefreshIcon />}
            variant="outlined"
            size="small"
            onClick={() => onRegenerateDay(dayIndex)}
          >
            Regenerate Day
          </Button>
        </Box>
        
        {/* Weather and Events Info */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {day.weatherForecast && (
            <Chip
              icon={getWeatherIcon(day.weatherForecast.condition)}
              label={`${day.weatherForecast.temperature}°C - ${day.weatherForecast.condition}`}
              color={day.weatherForecast.precipitation > 5 ? "error" : day.weatherForecast.temperature > 30 ? "warning" : "primary"}
              variant="outlined"
            />
          )}
          {hasEvents && (
            <Chip
              icon={<EventIcon />}
              label="Local Event"
              color="secondary"
              variant="outlined"
            />
          )}
        </Stack>
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <MapPreview dayItinerary={day} />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Schedule
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          pl: 2
        }}>
          {/* Vertical timeline line */}
          <Box sx={{ 
            position: 'absolute', 
            left: 0, 
            top: 0, 
            bottom: 0, 
            width: 2, 
            bgcolor: 'primary.main',
            zIndex: 1
          }} />
          
          {day.items.map((item, index) => (
            <Box 
              key={item.activity.id} 
              sx={{ 
                position: 'relative',
                pl: 3,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: -4,
                  top: 20,
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  zIndex: 2
                }
              }}
            >
              <ActivityCard 
                item={item} 
                onSwapActivity={() => onSwapActivity(dayIndex, index)}
                showCommute={index > 0}
              />
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default DailyItineraryView;