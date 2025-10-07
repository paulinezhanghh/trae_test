import React, { createContext, useContext, useState } from 'react';
import { TripDetails, TripPreferences, Itinerary } from '../types';

interface TripContextType {
  tripDetails: TripDetails;
  setTripDetails: React.Dispatch<React.SetStateAction<TripDetails>>;
  itinerary: Itinerary | null;
  setItinerary: React.Dispatch<React.SetStateAction<Itinerary | null>>;
  isGenerating: boolean;
  setIsGenerating: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultPreferences: TripPreferences = {
  tripStyle: 'Balanced',
  interests: {
    food: 3,
    culture: 3,
    nature: 3,
    nightlife: 3,
    shopping: 3,
  },
  budget: 'Mid-range',
  companions: 'Solo',
  mobility: {
    walkingDistance: 2000, // 2km default
    accessibility: false,
  },
};

const defaultTripDetails: TripDetails = {
  destination: '',
  startDate: null,
  endDate: null,
  preferences: defaultPreferences,
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tripDetails, setTripDetails] = useState<TripDetails>(defaultTripDetails);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  return (
    <TripContext.Provider
      value={{
        tripDetails,
        setTripDetails,
        itinerary,
        setItinerary,
        isGenerating,
        setIsGenerating,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTripContext = (): TripContextType => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTripContext must be used within a TripProvider');
  }
  return context;
};