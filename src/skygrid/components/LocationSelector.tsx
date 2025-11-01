import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';

interface LocationSelectorProps {
  onSelectCity: (city: { name: string; lat: number; lon: number }) => void;
  radiusKm: number;
  onRadiusChange: (radius: number) => void;
}

const MAJOR_CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.0060 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Paris', lat: 48.8566, lon: 2.3522 },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437 },
  { name: 'Chicago', lat: 41.8781, lon: -87.6298 },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Hong Kong', lat: 22.3193, lon: 114.1694 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Berlin', lat: 52.5200, lon: 13.4050 },
  { name: 'Toronto', lat: 43.6532, lon: -79.3832 },
];

export function LocationSelector({ onSelectCity, radiusKm, onRadiusChange }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCities = MAJOR_CITIES.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (city: typeof MAJOR_CITIES[0]) => {
    onSelectCity(city);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="absolute bottom-6 left-6 z-10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-[#0a0a0a] border border-[#1a1a1a] text-gray-400 hover:text-slate-200 hover:border-slate-200 transition-all text-[10px] uppercase tracking-widest font-medium"
      >
        <MapPin className="w-3 h-3" />
        <span>Select Location</span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-80 bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="p-4 border-b border-[#1a1a1a]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities..."
                className="w-full pl-9 pr-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a] text-white text-xs focus:outline-none focus:border-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="p-2 max-h-64 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleSelectCity(city)}
                className="w-full px-3 py-2 text-left text-xs text-gray-400 hover:bg-[#1a1a1a] hover:text-slate-200 transition-colors font-mono"
              >
                {city.name}
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-[#1a1a1a]">
            <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-3 font-medium">Radius: {radiusKm}km</div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className="w-full h-1 bg-[#1a1a1a] appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${((radiusKm - 50) / 950) * 100}%, #1a1a1a ${((radiusKm - 50) / 950) * 100}%, #1a1a1a 100%)`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
