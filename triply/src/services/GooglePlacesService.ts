import axios from 'axios';
import { Activity } from '../types';

// In a real application, you would store this in an environment variable
// and implement proper API key security
const API_KEY = 'YOUR_GOOGLE_API_KEY';

export interface PlaceSuggestion {
  description: string;
  placeId: string;
}

export const getPlaceSuggestions = async (query: string): Promise<PlaceSuggestion[]> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(
    //   `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${query}&types=(cities)&key=${API_KEY}`
    // );
    // return response.data.predictions.map((prediction: any) => ({
    //   description: prediction.description,
    //   placeId: prediction.place_id,
    // }));

    // Mock implementation for development
    return mockPlaceSuggestions.filter((place) =>
      place.description.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching place suggestions:', error);
    return [];
  }
};

export const getPlaceDetails = async (placeId: string): Promise<any> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(
    //   `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,geometry,photos,types,opening_hours,price_level,rating&key=${API_KEY}`
    // );
    // return response.data.result;

    // Mock implementation for development
    return mockPlaceDetails[placeId] || null;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
};

export const getNearbyPlaces = async (
  location: { lat: number; lng: number },
  radius: number,
  type: string
): Promise<Activity[]> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(
    //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=${type}&key=${API_KEY}`
    // );
    
    // return response.data.results.map((place: any) => ({
    //   id: place.place_id,
    //   name: place.name,
    //   address: place.vicinity,
    //   description: '', // Need to fetch details for description
    //   placeId: place.place_id,
    //   category: place.types[0],
    //   rating: place.rating,
    //   price: place.price_level,
    //   coordinates: {
    //     lat: place.geometry.location.lat,
    //     lng: place.geometry.location.lng,
    //   },
    //   duration: 60, // Default duration in minutes
    // }));

    // Mock implementation for development
    return mockActivities.filter((activity) => activity.category.includes(type));
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    return [];
  }
};

export const getDirections = async (
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number },
  mode: 'walking' | 'transit' | 'driving' = 'walking'
) => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(
    //   `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&mode=${mode}&key=${API_KEY}`
    // );
    
    // const route = response.data.routes[0];
    // return {
    //   distance: route.legs[0].distance.value,
    //   duration: route.legs[0].duration.value / 60, // Convert seconds to minutes
    //   mode: mode.toUpperCase(),
    // };

    // Mock implementation for development
    return {
      distance: Math.round(
        Math.sqrt(
          Math.pow(destination.lat - origin.lat, 2) + 
          Math.pow(destination.lng - origin.lng, 2)
        ) * 111000 // Rough conversion to meters
      ),
      duration: Math.round(
        Math.sqrt(
          Math.pow(destination.lat - origin.lat, 2) + 
          Math.pow(destination.lng - origin.lng, 2)
        ) * 111000 / 80 // Rough walking time (80m per minute)
      ),
      mode: mode.toUpperCase(),
    };
  } catch (error) {
    console.error('Error fetching directions:', error);
    return {
      distance: 0,
      duration: 0,
      mode: mode.toUpperCase(),
    };
  }
};

// Mock data for development
const mockPlaceSuggestions: PlaceSuggestion[] = [
  { description: 'Paris, France', placeId: 'place-paris' },
  { description: 'London, United Kingdom', placeId: 'place-london' },
  { description: 'New York, USA', placeId: 'place-newyork' },
  { description: 'Tokyo, Japan', placeId: 'place-tokyo' },
  { description: 'Rome, Italy', placeId: 'place-rome' },
];

const mockPlaceDetails: { [key: string]: any } = {
  'place-paris': {
    name: 'Paris',
    formatted_address: 'Paris, France',
    geometry: {
      location: {
        lat: 48.8566,
        lng: 2.3522,
      },
    },
  },
  'place-london': {
    name: 'London',
    formatted_address: 'London, UK',
    geometry: {
      location: {
        lat: 51.5074,
        lng: -0.1278,
      },
    },
  },
};

const mockActivities: Activity[] = [
  {
    id: 'eiffel-tower',
    name: 'Eiffel Tower',
    address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
    description: 'Iconic iron tower built in 1889 that defines the Paris skyline.',
    imageUrl: 'https://example.com/eiffel-tower.jpg',
    placeId: 'ChIJLU7jZClu5kcR4PcOOO6p3I0',
    category: 'tourist_attraction',
    rating: 4.6,
    price: 2,
    coordinates: {
      lat: 48.8584,
      lng: 2.2945,
    },
    duration: 120,
  },
  {
    id: 'louvre-museum',
    name: 'Louvre Museum',
    address: 'Rue de Rivoli, 75001 Paris, France',
    description: 'World\'s largest art museum and historic monument in Paris.',
    imageUrl: 'https://example.com/louvre.jpg',
    placeId: 'ChIJD3uTd9hx5kcR1IQvGfr8dbk',
    category: 'museum',
    rating: 4.7,
    price: 2,
    coordinates: {
      lat: 48.8606,
      lng: 2.3376,
    },
    duration: 180,
  },
  {
    id: 'notre-dame',
    name: 'Notre-Dame Cathedral',
    address: '6 Parvis Notre-Dame - Pl. Jean-Paul II, 75004 Paris, France',
    description: 'Medieval Catholic cathedral on the Île de la Cité in Paris.',
    imageUrl: 'https://example.com/notre-dame.jpg',
    placeId: 'ChIJATr1n-Fx5kcRjQb6q6cdQDY',
    category: 'church',
    rating: 4.7,
    price: 0,
    coordinates: {
      lat: 48.8530,
      lng: 2.3499,
    },
    duration: 90,
  },
  {
    id: 'sacre-coeur',
    name: 'Sacré-Cœur Basilica',
    address: '35 Rue du Chevalier de la Barre, 75018 Paris, France',
    description: 'Roman Catholic church and minor basilica in Paris.',
    imageUrl: 'https://example.com/sacre-coeur.jpg',
    placeId: 'ChIJbVDuPTRu5kcRoIgN2g0wUQQ',
    category: 'church',
    rating: 4.8,
    price: 0,
    coordinates: {
      lat: 48.8867,
      lng: 2.3431,
    },
    duration: 60,
  },
  {
    id: 'champs-elysees',
    name: 'Champs-Élysées',
    address: 'Champs-Élysées, 75008 Paris, France',
    description: 'Famous avenue in Paris known for luxury shops and theaters.',
    imageUrl: 'https://example.com/champs-elysees.jpg',
    placeId: 'ChIJjx37cOxv5kcRPWQuEW5ntdk',
    category: 'shopping',
    rating: 4.6,
    price: 3,
    coordinates: {
      lat: 48.8698,
      lng: 2.3075,
    },
    duration: 120,
  },
];