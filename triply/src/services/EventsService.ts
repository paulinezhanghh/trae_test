import { format } from 'date-fns';
import { Activity } from '../types';

export interface LocalEvent {
  id: string;
  name: string;
  description: string;
  location: string;
  address: string;
  startTime: string;
  endTime: string;
  date: Date;
  category: string;
  imageUrl?: string;
  price?: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const getLocalEvents = async (
  location: string,
  startDate: Date,
  endDate: Date
): Promise<LocalEvent[]> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(
    //   `https://api.eventful.com/json/events/search?app_key=${API_KEY}&location=${location}&date=${format(startDate, 'yyyyMMdd00')}-${format(endDate, 'yyyyMMdd00')}`
    // );
    
    // return response.data.events.event.map((event: any) => ({
    //   id: event.id,
    //   name: event.title,
    //   description: event.description,
    //   location: event.venue_name,
    //   address: event.venue_address,
    //   startTime: event.start_time,
    //   endTime: event.stop_time,
    //   date: new Date(event.start_time),
    //   category: event.categories.category[0].name,
    //   imageUrl: event.image?.url,
    //   coordinates: {
    //     lat: parseFloat(event.latitude),
    //     lng: parseFloat(event.longitude),
    //   },
    // }));

    // Mock implementation for development
    return generateMockEvents(location, startDate, endDate);
  } catch (error) {
    console.error('Error fetching local events:', error);
    return [];
  }
};

// Convert local events to activities for itinerary integration
export const convertEventToActivity = (event: LocalEvent): Activity => {
  return {
    id: event.id,
    name: event.name,
    address: event.address,
    description: event.description,
    imageUrl: event.imageUrl,
    placeId: `event-${event.id}`,
    category: 'event',
    price: event.price,
    coordinates: event.coordinates,
    duration: 120, // Default 2 hours for events
  };
};

// Generate mock events for development
const generateMockEvents = (location: string, startDate: Date, endDate: Date): LocalEvent[] => {
  const events: LocalEvent[] = [];
  const dayCount = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  // Mock events based on location
  const mockEventsByLocation: Record<string, LocalEvent[]> = {
    'Paris, France': [
      {
        id: 'event-paris-1',
        name: 'Jazz Concert at Parc des Buttes-Chaumont',
        description: 'Enjoy an evening of jazz music in one of Paris\'s most beautiful parks.',
        location: 'Parc des Buttes-Chaumont',
        address: '1 Rue Botzaris, 75019 Paris, France',
        startTime: '19:00',
        endTime: '22:00',
        date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days after start
        category: 'concert',
        imageUrl: 'https://example.com/jazz-concert.jpg',
        price: 0,
        coordinates: {
          lat: 48.8768,
          lng: 2.3819,
        },
      },
      {
        id: 'event-paris-2',
        name: 'Food Market at Place de la Bastille',
        description: 'Weekly food market featuring local producers and specialties.',
        location: 'Place de la Bastille',
        address: 'Place de la Bastille, 75011 Paris, France',
        startTime: '10:00',
        endTime: '18:00',
        date: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 days after start
        category: 'market',
        imageUrl: 'https://example.com/food-market.jpg',
        price: 0,
        coordinates: {
          lat: 48.8531,
          lng: 2.3693,
        },
      },
      {
        id: 'event-paris-3',
        name: 'Art Exhibition at Palais de Tokyo',
        description: 'Contemporary art exhibition featuring international artists.',
        location: 'Palais de Tokyo',
        address: '13 Avenue du Président Wilson, 75116 Paris, France',
        startTime: '12:00',
        endTime: '20:00',
        date: new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000), // 1 day after start
        category: 'exhibition',
        imageUrl: 'https://example.com/art-exhibition.jpg',
        price: 12,
        coordinates: {
          lat: 48.8639,
          lng: 2.2974,
        },
      },
    ],
    'London, United Kingdom': [
      {
        id: 'event-london-1',
        name: 'Camden Market Food Festival',
        description: 'Special food festival at Camden Market with international cuisine.',
        location: 'Camden Market',
        address: 'Camden Lock Place, London NW1 8AF, UK',
        startTime: '11:00',
        endTime: '20:00',
        date: new Date(startDate.getTime() + 2 * 24 * 60 * 60 * 1000), // 2 days after start
        category: 'festival',
        imageUrl: 'https://example.com/camden-market.jpg',
        price: 0,
        coordinates: {
          lat: 51.5415,
          lng: -0.1468,
        },
      },
      {
        id: 'event-london-2',
        name: 'Shakespeare in the Park',
        description: 'Open-air theater performance of a Shakespeare classic.',
        location: 'Regent\'s Park Open Air Theatre',
        address: 'Inner Cir, London NW1 4NU, UK',
        startTime: '19:30',
        endTime: '22:00',
        date: new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000), // 4 days after start
        category: 'theater',
        imageUrl: 'https://example.com/shakespeare.jpg',
        price: 25,
        coordinates: {
          lat: 51.5283,
          lng: -0.1526,
        },
      },
    ],
  };
  
  // Get events for the specified location
  const locationEvents = mockEventsByLocation[location] || [];
  
  // Filter events that fall within the trip dates
  return locationEvents.filter(event => {
    return event.date >= startDate && event.date <= endDate;
  });
};