import { TripDetails, Activity, Itinerary, DailyItinerary, ItineraryItem, CommuteInfo } from '../types';
import { getNearbyPlaces, getDirections } from './GooglePlacesService';
import { getWeatherForecast, shouldAdjustForWeather } from './WeatherService';
import { getLocalEvents, convertEventToActivity } from './EventsService';
import { addDays, format, differenceInDays, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Activity categories mapped to interest types
const CATEGORY_INTEREST_MAP: Record<string, keyof TripDetails['preferences']['interests']> = {
  restaurant: 'food',
  cafe: 'food',
  bar: 'nightlife',
  night_club: 'nightlife',
  museum: 'culture',
  art_gallery: 'culture',
  park: 'nature',
  shopping_mall: 'shopping',
  clothing_store: 'shopping',
};



// Budget level mapping
const BUDGET_PRICE_MAP: Record<TripDetails['preferences']['budget'], number[]> = {
  Economy: [0, 1],
  'Mid-range': [0, 1, 2],
  Premium: [0, 1, 2, 3, 4],
};

// Trip style affects number of activities per day
const TRIP_STYLE_ACTIVITY_COUNT: Record<TripDetails['preferences']['tripStyle'], number> = {
  Relaxed: 3,
  Balanced: 5,
  Packed: 7,
};

export const generateItinerary = async (tripDetails: TripDetails): Promise<Itinerary> => {
  if (!tripDetails.startDate || !tripDetails.endDate || !tripDetails.placeId) {
    throw new Error('Missing required trip details');
  }

  // For demo purposes, we'll use mock data instead of actual API calls
  const placeCoordinates = { lat: 48.8566, lng: 2.3522 }; // Paris coordinates
  
  // Calculate trip duration
  const tripDuration = differenceInDays(tripDetails.endDate, tripDetails.startDate) + 1;
  
  // Get activities based on preferences
  const activities = await fetchActivitiesBasedOnPreferences(tripDetails, placeCoordinates);
  
  // Generate daily itineraries
  const days: DailyItinerary[] = [];
  
  for (let i = 0; i < tripDuration; i++) {
    const date = addDays(tripDetails.startDate, i);
    const dailyActivities = selectDailyActivities(
      activities,
      tripDetails.preferences,
      i,
      tripDuration
    );
    
    // Schedule activities throughout the day
    const scheduledItems = scheduleActivities(dailyActivities, tripDetails.preferences.tripStyle);
    
    // Add commute information between activities
    const itemsWithCommute = await addCommuteInfo(scheduledItems);
    
    days.push({
      date,
      items: itemsWithCommute,
      // Mock weather data
      weatherForecast: {
        temperature: 20 + Math.floor(Math.random() * 10),
        condition: ['Sunny', 'Cloudy', 'Partly Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
        icon: 'sun',
        precipitation: Math.random() * 10,
      },
    });
  }
  
  return {
    id: uuidv4(),
    tripDetails,
    days,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

const fetchActivitiesBasedOnPreferences = async (
  tripDetails: TripDetails,
  location: { lat: number; lng: number }
): Promise<Activity[]> => {
  const { preferences } = tripDetails;
  const radius = preferences.mobility.walkingDistance;
  
  // Fetch activities for each interest category
  const allActivities: Activity[] = [];
  
  // Food
  if (preferences.interests.food > 2) {
    const foodPlaces = await getNearbyPlaces(location, radius, 'restaurant');
    allActivities.push(...foodPlaces);
  }
  
  // Culture
  if (preferences.interests.culture > 2) {
    const culturePlaces = await getNearbyPlaces(location, radius, 'museum');
    allActivities.push(...culturePlaces);
  }
  
  // Nature
  if (preferences.interests.nature > 2) {
    const naturePlaces = await getNearbyPlaces(location, radius, 'park');
    allActivities.push(...naturePlaces);
  }
  
  // Nightlife
  if (preferences.interests.nightlife > 2) {
    const nightlifePlaces = await getNearbyPlaces(location, radius, 'bar');
    allActivities.push(...nightlifePlaces);
  }
  
  // Shopping
  if (preferences.interests.shopping > 2) {
    const shoppingPlaces = await getNearbyPlaces(location, radius, 'shopping_mall');
    allActivities.push(...shoppingPlaces);
  }
  
  // Filter by budget
  const budgetPriceLevels = BUDGET_PRICE_MAP[preferences.budget];
  const filteredActivities = allActivities.filter(
    activity => activity.price === undefined || budgetPriceLevels.includes(activity.price)
  );
  
  // Filter by accessibility if needed
  if (preferences.mobility.accessibility) {
    // In a real app, we would check for accessibility features
    // For now, we'll just return all activities
  }
  
  return filteredActivities;
};

const selectDailyActivities = (
  activities: Activity[],
  preferences: TripDetails['preferences'],
  dayIndex: number,
  totalDays: number
): Activity[] => {
  // Calculate how many activities to include based on trip style
  const activityCount = TRIP_STYLE_ACTIVITY_COUNT[preferences.tripStyle];
  
  // Score and sort activities based on preferences
  const scoredActivities = activities.map(activity => {
    let score = 0;
    
    // Add score based on category match with interests
    const category = activity.category;
    const interestType = CATEGORY_INTEREST_MAP[category];
    
    if (interestType && preferences.interests[interestType]) {
      score += preferences.interests[interestType] * 2;
    }
    
    // Add score based on rating
    if (activity.rating) {
      score += activity.rating;
    }
    
    return { activity, score };
  });
  
  // Sort by score
  scoredActivities.sort((a, b) => b.score - a.score);
  
  // Select activities for this day, ensuring variety
  const selectedActivities: Activity[] = [];
  const usedCategories = new Set<string>();
  
  // First, try to get one activity from each preferred interest category
  for (const interestType of Object.keys(preferences.interests)) {
    if (preferences.interests[interestType as keyof typeof preferences.interests] >= 4) {
      const matchingActivity = scoredActivities.find(
        ({ activity }) => {
          const category = activity.category;
          return CATEGORY_INTEREST_MAP[category] === interestType && !usedCategories.has(category);
        }
      );
      
      if (matchingActivity) {
        selectedActivities.push(matchingActivity.activity);
        usedCategories.add(matchingActivity.activity.category);
        
        // Remove this activity from the pool
        const index = scoredActivities.indexOf(matchingActivity);
        scoredActivities.splice(index, 1);
        
        if (selectedActivities.length >= activityCount) {
          break;
        }
      }
    }
  }
  
  // Fill remaining slots with highest-scored activities
  while (selectedActivities.length < activityCount && scoredActivities.length > 0) {
    selectedActivities.push(scoredActivities[0].activity);
    scoredActivities.splice(0, 1);
  }
  
  return selectedActivities;
};

const scheduleActivities = (
  activities: Activity[],
  tripStyle: TripDetails['preferences']['tripStyle']
): ItineraryItem[] => {
  // Define time slots based on trip style
  let startTime = 9; // 9:00 AM
  const items: ItineraryItem[] = [];
  
  // Adjust start time based on trip style
  if (tripStyle === 'Relaxed') {
    startTime = 10; // 10:00 AM for relaxed trips
  } else if (tripStyle === 'Packed') {
    startTime = 8; // 8:00 AM for packed trips
  }
  
  let currentTime = startTime;
  
  for (const activity of activities) {
    const duration = activity.duration / 60; // Convert minutes to hours
    
    const startTimeStr = `${Math.floor(currentTime)}:${(currentTime % 1) * 60 || '00'}`;
    currentTime += duration;
    const endTimeStr = `${Math.floor(currentTime)}:${(currentTime % 1) * 60 || '00'}`;
    
    items.push({
      activity,
      startTime: startTimeStr,
      endTime: endTimeStr,
    });
    
    // Add buffer time between activities based on trip style
    if (tripStyle === 'Relaxed') {
      currentTime += 1; // 1 hour buffer for relaxed
    } else if (tripStyle === 'Balanced') {
      currentTime += 0.5; // 30 min buffer for balanced
    } else {
      currentTime += 0.25; // 15 min buffer for packed
    }
  }
  
  return items;
};

const addCommuteInfo = async (items: ItineraryItem[]): Promise<ItineraryItem[]> => {
  const itemsWithCommute: ItineraryItem[] = [];
  
  for (let i = 0; i < items.length; i++) {
    const currentItem = { ...items[i] };
    
    if (i > 0) {
      const prevActivity = items[i - 1].activity;
      const currentActivity = items[i].activity;
      
      const commuteInfo = await getDirections(
        prevActivity.coordinates,
        currentActivity.coordinates,
        'walking'
      );
      
      currentItem.commuteFromPrevious = {
        duration: commuteInfo.duration,
        distance: commuteInfo.distance,
        mode: commuteInfo.mode as 'WALKING' | 'TRANSIT' | 'DRIVING',
      };
    }
    
    itemsWithCommute.push(currentItem);
  }
  
  return itemsWithCommute;
};

export const regenerateDay = async (
  itinerary: Itinerary,
  dayIndex: number
): Promise<Itinerary> => {
  const updatedItinerary = { ...itinerary };
  const tripDetails = itinerary.tripDetails;
  
  // For demo purposes, we'll use mock data instead of actual API calls
  const placeCoordinates = { lat: 48.8566, lng: 2.3522 }; // Paris coordinates
  
  // Get activities based on preferences
  const activities = await fetchActivitiesBasedOnPreferences(tripDetails, placeCoordinates);
  
  // Generate new daily itinerary
  const dailyActivities = selectDailyActivities(
    activities,
    tripDetails.preferences,
    dayIndex,
    itinerary.days.length
  );
  
  // Schedule activities throughout the day
  const scheduledItems = scheduleActivities(dailyActivities, tripDetails.preferences.tripStyle);
  
  // Add commute information between activities
  const itemsWithCommute = await addCommuteInfo(scheduledItems);
  
  // Update the specific day
  updatedItinerary.days[dayIndex] = {
    ...updatedItinerary.days[dayIndex],
    items: itemsWithCommute,
  };
  
  updatedItinerary.updatedAt = new Date();
  
  return updatedItinerary;
};

export const swapActivity = async (
  itinerary: Itinerary,
  dayIndex: number,
  activityIndex: number,
  newActivity: Activity
): Promise<Itinerary> => {
  const updatedItinerary = { ...itinerary };
  const day = { ...updatedItinerary.days[dayIndex] };
  const items = [...day.items];
  
  // Replace the activity
  items[activityIndex] = {
    ...items[activityIndex],
    activity: newActivity,
  };
  
  // Recalculate commute info for affected items
  if (activityIndex > 0) {
    const prevActivity = items[activityIndex - 1].activity;
    const commuteInfo = await getDirections(
      prevActivity.coordinates,
      newActivity.coordinates,
      'walking'
    );
    
    items[activityIndex].commuteFromPrevious = {
      duration: commuteInfo.duration,
      distance: commuteInfo.distance,
      mode: commuteInfo.mode as 'WALKING' | 'TRANSIT' | 'DRIVING',
    };
  }
  
  if (activityIndex < items.length - 1) {
    const nextActivity = items[activityIndex + 1].activity;
    const commuteInfo = await getDirections(
      newActivity.coordinates,
      nextActivity.coordinates,
      'walking'
    );
    
    items[activityIndex + 1].commuteFromPrevious = {
      duration: commuteInfo.duration,
      distance: commuteInfo.distance,
      mode: commuteInfo.mode as 'WALKING' | 'TRANSIT' | 'DRIVING',
    };
  }
  
  // Update the day with new items
  day.items = items;
  updatedItinerary.days[dayIndex] = day;
  updatedItinerary.updatedAt = new Date();
  
  return updatedItinerary;
};

export const getAlternativeActivities = async (
  activity: Activity,
  tripDetails: TripDetails,
  count: number = 3
): Promise<Activity[]> => {
  // For demo purposes, we'll use mock data instead of actual API calls
  const placeCoordinates = { lat: 48.8566, lng: 2.3522 }; // Paris coordinates
  
  // Get activities of the same category
  const category = activity.category;
  const activities = await getNearbyPlaces(
    placeCoordinates,
    tripDetails.preferences.mobility.walkingDistance,
    category
  );
  
  // Filter out the current activity
  const alternatives = activities.filter(a => a.id !== activity.id);
  
  // Sort by rating and return top results
  return alternatives
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, count);
};

// Export the service as a default object
const ItineraryService = {
  generateItinerary,
  getAlternativeActivities
};

export default ItineraryService;