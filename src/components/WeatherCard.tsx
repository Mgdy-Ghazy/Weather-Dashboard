// components/WeatherCard.tsx
import { useEffect, useState } from "react";
import type { CityData } from "../types/CityData";
import type { WeatherAPIResponse } from "../types/WeatherData";

interface WeatherCardProps {
  city: CityData;
  unit: 'C' | 'F';
  onDelete: (id: string | number) => void;
}

function WeatherCard({ city, unit, onDelete }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [key, setKey] = useState<number>(0); // لإعادة تشغيل شريط التحديث

  const fetchWeather = async () => {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,wind_speed_10m,weather_code`
      );
      const data: WeatherAPIResponse = await response.json();

      setWeather(data);
      const now = new Date();
      setLastUpdated(now.toTimeString().split(' ')[0]);
      setLoading(false);
      setKey(prev => prev + 1); // Reset شريط التقدم
    } catch (error) {
      console.error("Error fetching weather:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(() => {
      fetchWeather();
    }, 15000);

    return () => clearInterval(interval);
  }, [city]);

  // دالة تحويل درجة الحرارة لـ Fahrenheit
  const getTemperature = (tempInC?: number) => {
    if (tempInC === undefined) return 0;
    if (unit === 'F') {
      return Math.round((tempInC * 9) / 5 + 32);
    }
    return Math.round(tempInC);
  };

  const getWeatherIcon = (code?: number) => {
    if (code === undefined) return "⏳";
    if (code === 0) return "☀️";
    if ([1, 2, 3].includes(code)) return "⛅";
    if ([45, 48].includes(code)) return "🌫️";
    if ([51, 53, 55].includes(code)) return "🌦️";
    if ([61, 63, 65].includes(code)) return "🌧️";
    if ([71, 73, 75].includes(code)) return "❄️";
    if ([95, 96, 99].includes(code)) return "⛈️";
    return "❓";
  };

  const getWeatherStatus = (code?: number) => {
    if (code === undefined) return "Loading...";
    if (code === 0) return "Clear Sky";
    if ([1, 2, 3].includes(code)) return "Partly Cloudy";
    if ([45, 48].includes(code)) return "Foggy";
    if ([51, 53, 55].includes(code)) return "Drizzle";
    if ([61, 63, 65].includes(code)) return "Rainy";
    if ([71, 73, 75].includes(code)) return "Snowy";
    if ([95, 96, 99].includes(code)) return "Thunderstorm";
    return "Unknown";
  };

  // شاشة التحميل الهيكلية بنفس الشكل والتصميم الأصلي
  if (loading) {
    return (
      <div className="bg-[#090e1a] border border-gray-800 rounded-3xl p-6 shadow-xl text-white flex flex-col gap-4 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 bg-gray-800 rounded-lg w-1/2"></div>
          <div className="h-5 bg-gray-800/60 rounded-lg w-1/3"></div>
        </div>
        <div className="flex items-center gap-6 my-4">
          <div className="w-16 h-16 bg-gray-800 rounded-full"></div>
          <div className="h-14 bg-gray-800 rounded-lg w-1/3"></div>
        </div>
        <div className="h-6 bg-gray-800/60 rounded-md w-1/4"></div>
        <div className="h-12 bg-gray-800/40 rounded-xl mt-2"></div>
      </div>
    );
  }

  return (
    <div className="group relative cursor-pointer bg-[#090e1a] border border-gray-800 rounded-3xl p-6 shadow-xl text-white transition-all duration-300 transform hover:scale-105 hover:border-gray-700 hover:shadow-2xl overflow-hidden">
      
      {/* زر الحذف مع تأثير التكبير المفضل لديك */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(city.id);
        }}
        className="absolute top-4 right-4 bg-red-600/90 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg transition-all duration-200 transform hover:scale-125 active:scale-95 cursor-pointer z-10"
        aria-label="Delete city"
      >
        ✕
      </button>

      {/* العنوان والمكان */}
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold tracking-tight">
          {city.name}
        </h1>
        <p className="text-lg text-gray-400 mt-1">
          {city.country}
        </p>
      </div>

      {/* درجات الحرارة والطقس */}
      <div className="flex items-center gap-6 my-4">
        <span className="text-7xl opacity-80 transition-transform duration-300 group-hover:scale-110">
          {getWeatherIcon(weather?.current.weather_code)}
        </span>
        <p className="text-7xl font-extrabold tracking-tighter">
          {weather ? getTemperature(weather.current.temperature_2m) : "--"}
          <span className="text-6xl font-light text-gray-300">°</span>
        </p>
      </div>
      
      <p className="text-xl text-gray-300 font-medium">
        {getWeatherStatus(weather?.current.weather_code)}
      </p>

      {/* سرعة الرياح */}
      <div className="border border-gray-800/60 rounded-xl p-3 text-gray-400 bg-black/10 mt-2 flex items-center justify-between">
        <span><strong className="text-gray-200">Wind:</strong> {weather ? Math.round(weather.current.wind_speed_10m) : 0} {weather?.current_units.wind_speed_10m}</span>
      </div>

      {/* تاريخ وتاريخ آخر تحديث */}
      <div className="text-sm text-gray-500 mt-1 flex justify-between items-center">
        <span>Updated: {lastUpdated || "Updating..."}</span>
      </div>

      {/* شريط تقدم أنيميشن للتحديث القادم (15 ثانية) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-900">
        <div 
          key={key} 
          className="h-full bg-blue-500/60 transition-all duration-15000 ease-linear w-0"
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

export default WeatherCard;