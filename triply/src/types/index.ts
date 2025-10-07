export interface TripPreferences {
  tripStyle: 'Relaxed' | 'Balanced' | 'Packed';
  interests: {
    food: number;
    culture: number;
    nature: number;
    nightlife: number;
    shopping: number;
  };
  budget: 'Economy' | 'Mid-range' | 'Premium';
  companions: 'Solo' | 'Couple' | 'Family' | 'Friends';
  mobility: {
    walkingDistance: number; // in meters
    accessibility: boolean;
  };
}

export interface TripDetails {
  id?: string;
  destination: string;
  placeId?: string;
  startDate: Date | null;
  endDate: Date | null;
  preferences: TripPreferences;
}

export interface Activity {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl?: string;
  placeId: string;
  category: string;
  rating?: number;
  price?: number;
  openingHours?: {
    [day: string]: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  duration: number; // in minutes
  isOutdoor?: boolean;
}

export interface CommuteInfo {
  duration: number; // in minutes
  distance: number; // in meters
  mode: 'WALKING' | 'TRANSIT' | 'DRIVING';
}

export interface ItineraryItem {
  activity: Activity;
  startTime: string;
  endTime: string;
  commuteFromPrevious?: CommuteInfo;
}

export interface DailyItinerary {
  date: Date;
  items: ItineraryItem[];
  weatherForecast?: {
    temperature: number;
    condition: string;
    icon: string;
    precipitation: number;
  };
}

export interface Itinerary {
  id: string;
  tripDetails: TripDetails;
  days: DailyItinerary[];
  createdAt: Date;
  updatedAt: Date;
}