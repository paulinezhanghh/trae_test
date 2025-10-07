import React from 'react';
import { Box, Paper } from '@mui/material';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import { DailyItinerary } from '../../types';

interface MapPreviewProps {
  dayItinerary: DailyItinerary;
}

const MapPreview: React.FC<MapPreviewProps> = ({ dayItinerary }) => {
  // In a real app, this would be stored in environment variables
  const API_KEY = 'YOUR_GOOGLE_API_KEY';
  
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
  });

  const mapContainerStyle = {
    width: '100%',
    height: '250px',
    borderRadius: '8px',
  };

  // Calculate center of the map based on activity coordinates
  const calculateCenter = () => {
    if (dayItinerary.items.length === 0) {
      return { lat: 48.8566, lng: 2.3522 }; // Default to Paris
    }

    const sumLat = dayItinerary.items.reduce(
      (sum, item) => sum + item.activity.coordinates.lat, 
      0
    );
    const sumLng = dayItinerary.items.reduce(
      (sum, item) => sum + item.activity.coordinates.lng, 
      0
    );

    return {
      lat: sumLat / dayItinerary.items.length,
      lng: sumLng / dayItinerary.items.length,
    };
  };

  // Create path for polyline
  const createPath = () => {
    return dayItinerary.items.map(item => ({
      lat: item.activity.coordinates.lat,
      lng: item.activity.coordinates.lng,
    }));
  };

  return (
    <Box sx={{ width: '100%', height: '250px', borderRadius: 2, overflow: 'hidden' }}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={calculateCenter()}
          zoom={13}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* Markers for each activity */}
          {dayItinerary.items.map((item, index) => (
            <Marker
              key={item.activity.id}
              position={{
                lat: item.activity.coordinates.lat,
                lng: item.activity.coordinates.lng,
              }}
              label={{
                text: `${index + 1}`,
                color: 'white',
              }}
            />
          ))}

          {/* Polyline connecting activities */}
          <Polyline
            path={createPath()}
            options={{
              strokeColor: '#4285F4',
              strokeOpacity: 0.8,
              strokeWeight: 3,
            }}
          />
        </GoogleMap>
      ) : (
        <Paper 
          elevation={0} 
          sx={{ 
            width: '100%', 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            color: 'text.secondary',
          }}
        >
          Loading map...
        </Paper>
      )}
    </Box>
  );
};

export default MapPreview;