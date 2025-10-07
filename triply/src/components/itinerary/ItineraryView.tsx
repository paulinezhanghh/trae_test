import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  SwipeableDrawer,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  SwapHoriz as SwapIcon,
  IosShare as ShareIcon,
  CalendarMonth as CalendarIcon,
  PictureAsPdf as PdfIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { Itinerary, Activity } from '../../types';
import DailyItineraryView from './DailyItineraryView';
import { useTripContext } from '../../contexts/TripContext';
import { regenerateDay, swapActivity, getAlternativeActivities } from '../../services/ItineraryService';
import ExportOptions from '../export/ExportOptions';

interface ItineraryViewProps {
  itinerary: Itinerary;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary }) => {
  const { setItinerary } = useTripContext();
  const [currentDay, setCurrentDay] = useState(0);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [alternativeActivities, setAlternativeActivities] = useState<Activity[]>([]);
  const [selectedActivityIndices, setSelectedActivityIndices] = useState<{day: number, activity: number}>({day: 0, activity: 0});
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentDay(newValue);
  };

  const handleRegenerateDay = async (dayIndex: number) => {
    try {
      const updatedItinerary = await regenerateDay(itinerary, dayIndex);
      setItinerary(updatedItinerary);
    } catch (error) {
      console.error('Error regenerating day:', error);
    }
  };

  const handleSwapActivityClick = async (dayIndex: number, activityIndex: number) => {
    try {
      const activity = itinerary.days[dayIndex].items[activityIndex].activity;
      const alternatives = await getAlternativeActivities(activity, itinerary.tripDetails);
      
      setAlternativeActivities(alternatives);
      setSelectedActivityIndices({day: dayIndex, activity: activityIndex});
      setSwapDialogOpen(true);
    } catch (error) {
      console.error('Error getting alternative activities:', error);
    }
  };

  const handleSwapConfirm = async (newActivity: Activity) => {
    try {
      const { day, activity } = selectedActivityIndices;
      const updatedItinerary = await swapActivity(itinerary, day, activity, newActivity);
      setItinerary(updatedItinerary);
      setSwapDialogOpen(false);
    } catch (error) {
      console.error('Error swapping activity:', error);
    }
  };

  const handleCloseExportDialog = () => {
    setExportDialogOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Your Trip to {itinerary.tripDetails.destination}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {format(itinerary.tripDetails.startDate!, 'MMM d')} - {format(itinerary.tripDetails.endDate!, 'MMM d, yyyy')}
          </Typography>
        </Box>
        
        <Button 
          variant="contained" 
          startIcon={<ShareIcon />}
          onClick={() => setExportDialogOpen(true)}
        >
          Export & Share
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={currentDay} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {itinerary.days.map((day, index) => (
            <Tab 
              key={index} 
              label={`Day ${index + 1}`} 
              id={`day-tab-${index}`}
              aria-controls={`day-tabpanel-${index}`}
            />
          ))}
        </Tabs>
      </Box>

      {itinerary.days.map((day, index) => (
        <Box
          key={index}
          role="tabpanel"
          hidden={currentDay !== index}
          id={`day-tabpanel-${index}`}
          aria-labelledby={`day-tab-${index}`}
        >
          {currentDay === index && (
            <DailyItineraryView 
              day={day} 
              dayIndex={index} 
              onRegenerateDay={handleRegenerateDay}
              onSwapActivity={handleSwapActivityClick}
            />
          )}
        </Box>
      ))}

      {/* Swap Activity Dialog */}
      <Dialog 
        open={swapDialogOpen} 
        onClose={() => setSwapDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Choose Alternative Activity</DialogTitle>
        <DialogContent>
          <List>
            {alternativeActivities.map((activity) => (
              <ListItem 
                key={activity.id} 
                button 
                onClick={() => handleSwapConfirm(activity)}
                divider
              >
                <ListItemText 
                  primary={activity.name} 
                  secondary={
                    <>
                      {activity.address}
                      <br />
                      {activity.rating && `Rating: ${activity.rating}★`}
                    </>
                  } 
                />
                <SwapIcon color="primary" />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSwapDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Export Options Dialog */}
      <ExportOptions 
        itinerary={itinerary}
        open={exportDialogOpen}
        onClose={handleCloseExportDialog}
      />
    </Container>
  );
};

export default ItineraryView;