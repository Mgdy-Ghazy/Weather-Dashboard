import { useState, useEffect, useRef } from "react";
import type { CityDataAPIResonse, CityData } from "../types/CityData";

type Props = {
  handleAddCity: (city: CityData) => void;
};

function SearchCity({ handleAddCity }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // إغلاق المنسدلة عند الضغط في أي مكان خارجي
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    if (newQuery.trim().length < 3) {
      setResults([]);
      return;
    }

    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(newQuery)}`
      );
      const data: CityDataAPIResonse = await response.json();
      setResults(data.results ?? []);
    } catch (err) {
      console.error(err);
    }
  };

  const onCitySelect = (city: CityData) => {
    handleAddCity(city);
    setResults([]);
    setQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && results.length > 0) {
      onCitySelect(results[0]);
    } else if (e.key === 'Escape') {
      setResults([]);
    }
  };

  return (
    <div ref={containerRef} className="w-full relative">
      <input
        value={query}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        className="w-full rounded-2xl border border-[#182538] bg-[#0c1524]/80 backdrop-blur-md p-4 pl-6 text-lg text-white placeholder:text-[#516377] focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none shadow-lg"
        type="text"
        placeholder="Search for a city..."
      />

      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[#0c1524]/95 backdrop-blur-xl border border-[#182538] rounded-2xl shadow-2xl z-50 overflow-hidden divide-y divide-[#182538]">
          {results.map((result) => (
            <div
              key={result.id}
              onClick={() => onCitySelect(result)}
              className="cursor-pointer p-4 text-gray-300 hover:bg-blue-600/20 hover:text-white transition-colors flex justify-between items-center"
            >
              <span className="font-medium">{result.name}</span>
              <span className="text-sm text-gray-500">{result.country}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchCity;