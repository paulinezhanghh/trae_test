import axios from 'axios';

// In a real application, you would store this in an environment variable
const API_KEY = 'YOUR_WEATHER_API_KEY';

export interface WeatherForecast {
  date: Date;
  temperature: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
  windSpeed: number;
}

export const getWeatherForecast = async (
  location: string,
  startDate: Date,
  endDate: Date
): Promise<WeatherForecast[]> => {
  try {
    // This would be a real API call in production
    // const response = await axios.get(
    //   `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=10&aqi=no&alerts=no`
    // );
    
    // return response.data.forecast.forecastday.map((day: any) => ({
    //   date: new Date(day.date),
    //   temperature: day.day.avgtemp_c,
    //   condition: day.day.condition.text,
    //   icon: day.day.condition.icon,
    //   precipitation: day.day.totalprecip_mm,
    //   humidity: day.day.avghumidity,
    //   windSpeed: day.day.maxwind_kph,
    // }));

    // Mock implementation for development
    return generateMockWeatherForecast(startDate, endDate);
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return [];
  }
};

// Generate mock weather data for development
const generateMockWeatherForecast = (startDate: Date, endDate: Date): WeatherForecast[] => {
  const forecasts: WeatherForecast[] = [];
  const dayCount = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const weatherConditions = [
    { condition: 'Sunny', icon: 'sun', precipitation: 0 },
    { condition: 'Partly Cloudy', icon: 'partly-cloudy', precipitation: 0 },
    { condition: 'Cloudy', icon: 'cloudy', precipitation: 0 },
    { condition: 'Light Rain', icon: 'rain', precipitation: 2.5 },
    { condition: 'Heavy Rain', icon: 'heavy-rain', precipitation: 8.0 },
  ];
  
  for (let i = 0; i < dayCount; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    const randomConditionIndex = Math.floor(Math.random() * weatherConditions.length);
    const condition = weatherConditions[randomConditionIndex];
    
    forecasts.push({
      date,
      temperature: 15 + Math.floor(Math.random() * 15), // 15-30°C
      condition: condition.condition,
      icon: condition.icon,
      precipitation: condition.precipitation,
      humidity: 40 + Math.floor(Math.random() * 40), // 40-80%
      windSpeed: 5 + Math.floor(Math.random() * 20), // 5-25 kph
    });
  }
  
  return forecasts;
};

// Check if weather conditions require adjustments to the itinerary
export const shouldAdjustForWeather = (forecast: WeatherForecast): {
  needsAdjustment: boolean;
  reason: 'rain' | 'heat' | 'none';
} => {
  // Check for rain
  if (
    forecast.condition.toLowerCase().includes('rain') ||
    forecast.condition.toLowerCase().includes('shower') ||
    forecast.precipitation > 5
  ) {
    return { needsAdjustment: true, reason: 'rain' };
  }
  
  // Check for extreme heat
  if (forecast.temperature > 30) {
    return { needsAdjustment: true, reason: 'heat' };
  }
  
  return { needsAdjustment: false, reason: 'none' };
};