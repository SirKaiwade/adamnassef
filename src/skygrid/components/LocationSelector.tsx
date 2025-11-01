import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

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
  const { theme } = useTheme();
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
        className={`flex items-center gap-2 px-3 py-2 border transition-all text-[10px] uppercase tracking-widest font-medium ${
          theme === 'light'
            ? 'bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400'
            : 'bg-[#0a0a0a] border-slate-700 text-gray-400 hover:text-slate-200 hover:border-slate-600'
        }`}
      >
        <MapPin className="w-3 h-3" />
        <span>Select Location</span>
      </button>

      {isOpen && (
        <div className={`absolute bottom-full left-0 mb-2 w-80 border ${
          theme === 'light'
            ? 'bg-white border-slate-300'
            : 'bg-[#0a0a0a] border-slate-700'
        }`}>
          <div className={`p-4 border-b ${
            theme === 'light' ? 'border-slate-200' : 'border-slate-700'
          }`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 ${
                theme === 'light' ? 'text-slate-500' : 'text-gray-500'
              }`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities..."
                className={`w-full pl-9 pr-4 py-2 border text-xs focus:outline-none font-mono ${
                  theme === 'light'
                    ? 'bg-white border-slate-300 text-slate-900 focus:border-slate-400'
                    : 'bg-[#0a0a0a] border-slate-700 text-white focus:border-slate-500'
                }`}
              />
            </div>
          </div>

          <div className="p-2 max-h-64 overflow-y-auto">
            {filteredCities.map((city) => (
              <button
                key={city.name}
                onClick={() => handleSelectCity(city)}
                className={`w-full px-3 py-2 text-left text-xs transition-colors font-mono ${
                  theme === 'light'
                    ? 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-slate-200'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>

          <div className={`p-4 border-t ${
            theme === 'light' ? 'border-slate-200' : 'border-slate-700'
          }`}>
            <div className={`text-[10px] uppercase tracking-widest mb-3 font-medium ${
              theme === 'light' ? 'text-slate-500' : 'text-gray-500'
            }`}>Radius: {radiusKm}km</div>
            <input
              type="range"
              min="50"
              max="1000"
              step="50"
              value={radiusKm}
              onChange={(e) => onRadiusChange(Number(e.target.value))}
              className={`w-full h-1 appearance-none cursor-pointer ${
                theme === 'light' ? 'bg-slate-200' : 'bg-[#1a1a1a]'
              }`}
              style={{
                background: theme === 'light'
                  ? `linear-gradient(to right, #475569 0%, #475569 ${((radiusKm - 50) / 950) * 100}%, #cbd5e1 ${((radiusKm - 50) / 950) * 100}%, #cbd5e1 100%)`
                  : `linear-gradient(to right, #e2e8f0 0%, #e2e8f0 ${((radiusKm - 50) / 950) * 100}%, #1a1a1a ${((radiusKm - 50) / 950) * 100}%, #1a1a1a 100%)`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
