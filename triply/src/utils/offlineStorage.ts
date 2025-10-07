import { Itinerary, TripDetails } from '../types';

// IndexedDB database name and version
const DB_NAME = 'triply_offline_db';
const DB_VERSION = 1;
const ITINERARY_STORE = 'itineraries';
const TRIP_DETAILS_STORE = 'tripDetails';

// Initialize the database
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      reject('Error opening IndexedDB');
    };
    
    request.onsuccess = (event) => {
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains(ITINERARY_STORE)) {
        db.createObjectStore(ITINERARY_STORE, { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains(TRIP_DETAILS_STORE)) {
        db.createObjectStore(TRIP_DETAILS_STORE, { keyPath: 'id' });
      }
    };
  });
};

// Save itinerary for offline access
export const saveItineraryOffline = async (itinerary: Itinerary): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([ITINERARY_STORE], 'readwrite');
    const store = transaction.objectStore(ITINERARY_STORE);
    
    // Add a unique ID if not present
    const itineraryToSave = {
      ...itinerary,
      id: itinerary.id || `itinerary_${Date.now()}`
    };
    
    store.put(itineraryToSave);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Error saving itinerary offline');
    });
  } catch (error) {
    console.error('Failed to save itinerary offline:', error);
    throw error;
  }
};

// Save trip details for offline access
export const saveTripDetailsOffline = async (tripDetails: TripDetails): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([TRIP_DETAILS_STORE], 'readwrite');
    const store = transaction.objectStore(TRIP_DETAILS_STORE);
    
    // Add a unique ID if not present
    const detailsToSave = {
      ...tripDetails,
      id: tripDetails.id || `trip_${Date.now()}`
    };
    
    store.put(detailsToSave);
    
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Error saving trip details offline');
    });
  } catch (error) {
    console.error('Failed to save trip details offline:', error);
    throw error;
  }
};

// Get saved itinerary
export const getOfflineItinerary = async (id: string): Promise<Itinerary | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([ITINERARY_STORE], 'readonly');
    const store = transaction.objectStore(ITINERARY_STORE);
    const request = store.get(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject('Error retrieving itinerary');
    });
  } catch (error) {
    console.error('Failed to get offline itinerary:', error);
    return null;
  }
};

// Get saved trip details
export const getOfflineTripDetails = async (id: string): Promise<TripDetails | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([TRIP_DETAILS_STORE], 'readonly');
    const store = transaction.objectStore(TRIP_DETAILS_STORE);
    const request = store.get(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject('Error retrieving trip details');
    });
  } catch (error) {
    console.error('Failed to get offline trip details:', error);
    return null;
  }
};

// Get all saved itineraries
export const getAllOfflineItineraries = async (): Promise<Itinerary[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([ITINERARY_STORE], 'readonly');
    const store = transaction.objectStore(ITINERARY_STORE);
    const request = store.getAll();
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject('Error retrieving itineraries');
    });
  } catch (error) {
    console.error('Failed to get offline itineraries:', error);
    return [];
  }
};

// Check if the app is online
export const isOnline = (): boolean => {
  return navigator.onLine;
};

// Register service worker for offline capabilities
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/service-worker.js');
      console.log('Service worker registered successfully');
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
};