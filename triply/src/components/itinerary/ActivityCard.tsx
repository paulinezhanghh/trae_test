import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Refresh as RefreshIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import { ItineraryItem } from '../../types';

interface ActivityCardProps {
  item: ItineraryItem;
  onSwapActivity?: () => void;
  showCommute?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ 
  item, 
  onSwapActivity,
  showCommute = true
}) => {
  const { activity, startTime, endTime, commuteFromPrevious } = item;

  // Format distance for display
  const formatDistance = (meters: number): string => {
    return meters >= 1000 
      ? `${(meters / 1000).toFixed(1)} km` 
      : `${meters} m`;
  };

  return (
    <Card sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      mb: 2, 
      borderRadius: 2,
      boxShadow: 2
    }}>
      {showCommute && commuteFromPrevious && (
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            bgcolor: 'background.default',
            borderBottom: '1px dashed #ccc'
          }}
        >
          <DirectionsWalkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {commuteFromPrevious.duration} min • {formatDistance(commuteFromPrevious.distance)}
          </Typography>
        </Box>
      )}
      
      {activity.imageUrl && (
        <CardMedia
          component="img"
          height="140"
          image={activity.imageUrl}
          alt={activity.name}
        />
      )}
      
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              {activity.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {startTime} - {endTime}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PlaceIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {activity.address}
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" paragraph>
              {activity.description}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              <Chip 
                label={activity.category.replace('_', ' ')} 
                size="small" 
                sx={{ textTransform: 'capitalize' }} 
              />
              {activity.rating && (
                <Chip 
                  label={`${activity.rating}★`} 
                  size="small" 
                  color="primary" 
                  variant="outlined" 
                />
              )}
            </Box>
          </Box>
          
          {onSwapActivity && (
            <Tooltip title="Swap activity">
              <IconButton 
                onClick={onSwapActivity} 
                size="small" 
                sx={{ ml: 1 }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;