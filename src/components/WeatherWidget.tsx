import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudSnow, Wind } from 'lucide-react';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

export const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use mock data
    // In production, you'd use OpenWeatherMap API
    const fetchWeather = async () => {
      try {
        // Mock weather data
        const mockWeather: WeatherData = {
          temp: 22,
          condition: 'Partly Cloudy',
          icon: 'cloud'
        };
        
        setWeather(mockWeather);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherIcon = (icon: string) => {
    switch (icon) {
      case 'sun':
        return <Sun className="h-5 w-5" />;
      case 'cloud':
        return <Cloud className="h-5 w-5" />;
      case 'rain':
        return <CloudRain className="h-5 w-5" />;
      case 'snow':
        return <CloudSnow className="h-5 w-5" />;
      default:
        return <Wind className="h-5 w-5" />;
    }
  };

  if (loading || !weather) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {getWeatherIcon(weather.icon)}
      <span>{weather.temp}°C</span>
      <span className="hidden sm:inline">• {weather.condition}</span>
    </div>
  );
};

// To use OpenWeatherMap API (free tier):
// 1. Sign up at https://openweathermap.org/api
// 2. Get your API key
// 3. Replace the mock data with:
/*
const API_KEY = 'your-api-key';
const lat = 45.4215; // Ottawa
const lon = -75.6972;
const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

const response = await fetch(url);
const data = await response.json();

const weatherData: WeatherData = {
  temp: Math.round(data.main.temp),
  condition: data.weather[0].main,
  icon: mapWeatherIcon(data.weather[0].icon)
};
*/