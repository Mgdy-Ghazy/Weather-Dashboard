import { useState, useEffect } from 'react'
import Header from './components/Header'
import SearchCity from './components/SearchCity'
import WeatherCard from './components/WeatherCard'
import type { CityData } from './types/CityData'

function App() {
  // 1. استرجاع المدن من LocalStorage أو البدء بمصفوفة فارغة
  const [cities, setCities] = useState<CityData[]>(() => {
    const saved = localStorage.getItem("weather_cities");
    return saved ? JSON.parse(saved) : [];
  });

  const [notification, setNotification] = useState<string | null>(null);
  // 2. حالة وحدة درجة الحرارة (Celsius / Fahrenheit)
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  // حفظ المدن في LocalStorage كلما تغيرت
  useEffect(() => {
    localStorage.setItem("weather_cities", JSON.stringify(cities));
  }, [cities]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleAddCity = (city: CityData) => {
    if (cities.some(c => c.id === city.id)) {
      showNotification(`${city.name} is already added!`);
      return;
    }
    setCities(prev => [...prev, city]);
    showNotification(`${city.name} added successfully!`);
  };

  const handleDeleteCity = (id: string | number, cityName: string) => {
    setCities(prev => prev.filter(city => city.id !== id));
    showNotification(`${cityName} removed`);
  };

  return (
    <div className="min-h-screen bg-[#070e17] text-white p-6 md:p-10 relative flex flex-col gap-8 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* Toast Notification الزجاجي الفاخر */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3 bg-[#e6f4ea]/90 backdrop-blur-md text-[#137333] border border-[#ceead6] px-5 py-3.5 rounded-2xl shadow-2xl transition-all animate-bounce">
          <span className="bg-[#137333] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">✓</span>
          <span className="font-semibold text-base tracking-wide">{notification}</span>
        </div>
      )}

      {/* الهيدر مع التوجل الخاص بالحرارة */}
      <Header unit={unit} setUnit={setUnit} />

      <SearchCity handleAddCity={handleAddCity} />

      {/* Empty State */}
      {cities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-28 gap-6 text-[#516377]">
          <div className="text-9xl opacity-30 animate-pulse">⛅</div>
          <p className="text-2xl font-medium text-[#798ea4] text-center max-w-md leading-relaxed">
            No cities added yet. Search and add cities to see their weather!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-2">
          {cities.map((city) => (
            <WeatherCard
              key={city.id}
              city={city}
              unit={unit}
              onDelete={(id) => handleDeleteCity(id, city.name)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App