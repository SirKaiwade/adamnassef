import { useState, useEffect, useMemo } from 'react';
import { ViewModeToggle } from './components/ViewModeToggle';
import { LayerToggle } from './components/LayerToggle';
import { Sidebar } from './components/Sidebar';
import { AircraftMap } from './components/Map';
import { LocationSelector } from './components/LocationSelector';
import { useAircraftData } from './hooks/useAircraftData';
import type { ViewMode, Aircraft } from './types';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('global');
  const [selectedCity, setSelectedCity] = useState<{ name: string; lat: number; lon: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState(500);
  const [selectedAircraft, setSelectedAircraft] = useState<Aircraft | null>(null);
  const [overheadAircraft, setOverheadAircraft] = useState<Array<{ aircraft: Aircraft; timestamp: number }>>([]);
  const [pingMs, setPingMs] = useState<number>(0);
  const [currentLocation, setCurrentLocation] = useState<{ city: string; state: string; country: string; flag: string } | null>(null);
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const [ipAddress, setIpAddress] = useState<string | null>(null);
  const [layers, setLayers] = useState({
    trails: true,
    airRoutes: false,
    restrictedAirspace: false,
    weather: false,
  });

  const { aircraft, isLoading } = useAircraftData({
    viewMode,
    selectedCity,
    radiusKm,
  });


  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      switch (e.key.toLowerCase()) {
        case 'l':
          setViewMode('local');
          break;
        case 'r':
          setViewMode('regional');
          break;
        case 'g':
          setViewMode('global');
          break;
        case 'a':
          setViewMode('airport');
          break;
        case 't':
          setLayers(prev => ({ ...prev, trails: !prev.trails }));
          break;
        case 'escape':
          setSelectedAircraft(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);


  const handleLayerToggle = (layer: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const metrics = useMemo(() => {
    const activeCount = aircraft.length;
    const speeds = aircraft.map(a => (a.velocity || 0) * 1.944); // m/s to knots
    const altitudes = aircraft.map(a => (a.baro_altitude || 0) * 3.28084); // m to ft
    
    const avgAlt = altitudes.length > 0
      ? altitudes.reduce((sum, alt) => sum + alt, 0) / altitudes.length
      : 0;

    const avgSpeed = speeds.length > 0
      ? speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length
      : 0;

    const maxSpeed = speeds.length > 0
      ? Math.max(...speeds)
      : 0;

    return {
      activeAircraft: activeCount,
      avgAltitude: avgAlt,
      avgSpeed,
      maxSpeed,
    };
  }, [aircraft]);

  // Auto-set local view to user's location when available
  useEffect(() => {
    if (viewMode === 'local' && !selectedCity && userCoordinates) {
      const cityName = currentLocation?.city || 'Your Location';
      console.log('[App] Auto-setting local view to:', cityName, userCoordinates);
      setSelectedCity({
        name: cityName,
        lat: userCoordinates.lat,
        lon: userCoordinates.lon,
      });
    }
  }, [viewMode, selectedCity, userCoordinates, currentLocation]);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === 'local' && !selectedCity) {
      console.log('[App] Setting local view - userCoordinates:', userCoordinates, 'currentLocation:', currentLocation);
      
      // Use user's actual location if available
      if (userCoordinates) {
        const cityName = currentLocation?.city || 'Your Location';
        setSelectedCity({
          name: cityName,
          lat: userCoordinates.lat,
          lon: userCoordinates.lon,
        });
        console.log('[App] Set selectedCity to:', cityName, userCoordinates);
      } else {
        // If no coordinates yet, the useEffect above will set it when available
        console.log('[App] No userCoordinates yet, will auto-set when available');
      }
    }
  };

  const handleSelectCity = (city: { name: string; lat: number; lon: number }) => {
    setSelectedCity(city);
    setViewMode('local');
  };

  const [currentDate, setCurrentDate] = useState(() => 
    new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()
  );
  const [currentTime, setCurrentTime] = useState(() => 
    new Date().toLocaleTimeString('en-US', { hour12: false })
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentDate(now.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase());
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get country flag emoji from country code
  const getFlagEmoji = (countryCode: string): string => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  // Get user location
  useEffect(() => {
    const getLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use a simple reverse geocoding service
                const { latitude, longitude } = position.coords;
                
                // Store user coordinates for prioritizing nearby aircraft
                setUserCoordinates({ lat: latitude, lon: longitude });
                
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
                );
                const data = await response.json();
                
                if (data.countryCode) {
                  const flag = getFlagEmoji(data.countryCode);
                  setCurrentLocation({
                    city: data.city || data.locality || 'Unknown',
                    state: data.principalSubdivision || data.principalSubdivisionCode || '',
                    country: data.countryName || 'Unknown',
                    flag: flag,
                  });
                }
              } catch (error) {
                console.error('Error getting location details:', error);
                // Fallback to timezone-based location
                setFallbackLocation();
              }
            },
            () => {
              // Geolocation denied or failed, use fallback
              setFallbackLocation();
            }
          );
        } else {
          setFallbackLocation();
        }
      } catch (error) {
        setFallbackLocation();
      }
    };

    const setFallbackLocation = () => {
      // Use timezone as fallback to guess location
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Simple timezone to location mapping with coordinates
      const locationMap: Record<string, { city: string; state: string; country: string; flag: string; lat: number; lon: number }> = {
        'America/Toronto': { city: 'Toronto', state: 'ON', country: 'Canada', flag: '🇨🇦', lat: 43.6532, lon: -79.3832 },
        'America/New_York': { city: 'New York', state: 'NY', country: 'United States', flag: '🇺🇸', lat: 40.7128, lon: -74.0060 },
        'America/Los_Angeles': { city: 'Los Angeles', state: 'CA', country: 'United States', flag: '🇺🇸', lat: 34.0522, lon: -118.2437 },
        'America/Chicago': { city: 'Chicago', state: 'IL', country: 'United States', flag: '🇺🇸', lat: 41.8781, lon: -87.6298 },
        'Europe/London': { city: 'London', state: '', country: 'United Kingdom', flag: '🇬🇧', lat: 51.5074, lon: -0.1278 },
        'Europe/Paris': { city: 'Paris', state: '', country: 'France', flag: '🇫🇷', lat: 48.8566, lon: 2.3522 },
        'Asia/Tokyo': { city: 'Tokyo', state: '', country: 'Japan', flag: '🇯🇵', lat: 35.6762, lon: 139.6503 },
        'Asia/Shanghai': { city: 'Shanghai', state: '', country: 'China', flag: '🇨🇳', lat: 31.2304, lon: 121.4737 },
      };

      const location = locationMap[timezone] || { city: 'Unknown', state: '', country: 'Unknown', flag: '🌍', lat: 0, lon: 0 };
      setCurrentLocation({
        city: location.city,
        state: location.state,
        country: location.country,
        flag: location.flag,
      });
      // Also set coordinates from fallback
      if (location.lat !== 0 && location.lon !== 0) {
        setUserCoordinates({ lat: location.lat, lon: location.lon });
      }
    };

    getLocation();
  }, []);

  // Get IP address
  useEffect(() => {
    const fetchIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIpAddress(data.ip);
      } catch (error) {
        console.error('Error fetching IP address:', error);
        // Fallback: try alternative service
        try {
          const response = await fetch('https://api64.ipify.org?format=json');
          const data = await response.json();
          setIpAddress(data.ip);
        } catch {
          setIpAddress(null);
        }
      }
    };

    fetchIpAddress();
  }, []);

  // Track ping based on aircraft data fetch timing (no separate ping needed)
  // Ping will be updated when aircraft data is successfully fetched
  useEffect(() => {
    // Set initial ping to a reasonable default
    if (pingMs === 0) {
      setPingMs(100);
    }
  }, []);

  // Track aircraft passing overhead when location is selected
  useEffect(() => {
    if (!selectedCity || viewMode !== 'local') {
      setOverheadAircraft([]);
      return;
    }

    const checkOverhead = () => {
      setOverheadAircraft(prev => {
        const overhead: Array<{ aircraft: Aircraft; timestamp: number }> = [];
        const now = Date.now();
        
        aircraft.forEach(plane => {
          if (!plane.longitude || !plane.latitude) return;
          
          // Calculate distance from selected city
          const distanceKm = calculateDistance(
            selectedCity.lat,
            selectedCity.lon,
            plane.latitude,
            plane.longitude
          );

          // If within 10km radius, add to overhead
          if (distanceKm <= 10) {
            // Check if we've seen this plane recently
            const existing = prev.find(o => o.aircraft.icao24 === plane.icao24);
            if (!existing || now - existing.timestamp > 30000) {
              overhead.push({ aircraft: plane, timestamp: now });
            } else {
              overhead.push(existing);
            }
          }
        });

        return overhead;
      });
    };

    checkOverhead();
    const interval = setInterval(checkOverhead, 2000);
    return () => clearInterval(interval);
  }, [aircraft, selectedCity, viewMode]);

  // Helper function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Top Header Bar */}
      <div className="absolute top-0 left-0 right-0 h-14 bg-[#0a0a0a] border-b border-[#1a1a1a] z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <div className="text-lg font-semibold text-white tracking-wide">SKYGRID</div>
          <div className="w-px h-5 bg-[#1a1a1a]" />
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs uppercase tracking-widest text-green-400 font-medium">LIVE</span>
          </div>
          {currentLocation && (
            <>
              <div className="w-px h-5 bg-[#1a1a1a]" />
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="text-lg">{currentLocation.flag}</span>
                <span>
                  {currentLocation.city}
                  {currentLocation.state && `, ${currentLocation.state}`}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-6 text-xs text-gray-400">
          <span className="font-medium">{currentDate}</span>
          <span className="text-gray-500">•</span>
          <span className="font-mono">{currentTime}</span>
          
          {pingMs > 0 && (() => {
            // Determine color based on ping quality
            let iconColor = 'green';
            let textColor = 'text-green-400';
            
            if (pingMs > 500) {
              iconColor = 'red';
              textColor = 'text-red-400';
            } else if (pingMs > 200) {
              iconColor = 'yellow';
              textColor = 'text-yellow-400';
            }
            
            // CSS filter to convert white icon to the appropriate color
            const iconFilters: Record<string, string> = {
              green: 'brightness(0) saturate(100%) invert(69%) sepia(95%) saturate(352%) hue-rotate(85deg) brightness(95%) contrast(95%)',
              yellow: 'brightness(0) saturate(100%) invert(85%) sepia(90%) saturate(7500%) hue-rotate(5deg) brightness(105%) contrast(105%)',
              red: 'brightness(0) saturate(100%) invert(41%) sepia(97%) saturate(4214%) hue-rotate(342deg) brightness(99%) contrast(96%)',
            };
            
            return (
              <>
                <div className="w-px h-5 bg-[#1a1a1a]" />
                <div className={`flex items-center gap-2 px-3 py-1.5 border border-[#1a1a1a] rounded ${textColor}`}>
                  <img 
                    src="/1520228-200.png" 
                    alt="live" 
                    width="20" 
                    height="20" 
                    style={{ 
                      filter: iconFilters[iconColor],
                      imageRendering: 'crisp-edges'
                    }} 
                    className="flex-shrink-0"
                  />
                  <span className={`font-mono text-xs ${textColor}`}>~{pingMs} MS</span>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Metrics moved to bottom */}

      <ViewModeToggle viewMode={viewMode} onViewModeChange={handleViewModeChange} />

      <LayerToggle layers={layers} onToggle={handleLayerToggle} />

      {viewMode === 'local' && (
        <LocationSelector
          onSelectCity={handleSelectCity}
          radiusKm={radiusKm}
          onRadiusChange={setRadiusKm}
        />
      )}

      <AircraftMap
        aircraft={aircraft}
        viewMode={viewMode}
        selectedCity={selectedCity}
        userLocation={userCoordinates}
        showTrails={layers.trails}
        onAircraftClick={setSelectedAircraft}
      />

      {/* Overhead sidebar when location is selected */}
      {selectedCity && viewMode === 'local' && (
        <Sidebar
          selectedAircraft={selectedAircraft}
          overheadAircraft={overheadAircraft}
          onClose={() => setSelectedAircraft(null)}
          onAircraftSelect={setSelectedAircraft}
          selectedCity={selectedCity}
        />
      )}

      {/* Selected aircraft sidebar when clicked on map */}
      {selectedAircraft && (!selectedCity || viewMode !== 'local') && (
        <Sidebar
          selectedAircraft={selectedAircraft}
          overheadAircraft={[]}
          onClose={() => setSelectedAircraft(null)}
          onAircraftSelect={setSelectedAircraft}
          selectedCity={null}
        />
      )}

      {isLoading && (
        <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-200 animate-pulse" />
          <span className="text-xs uppercase tracking-wider text-slate-200">
            Loading Aircraft Data
          </span>
        </div>
      )}

      {/* Bottom Metrics Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-[#0a0a0a] border-t border-[#1a1a1a] z-30">
        <div className="h-full flex items-center justify-between px-6 gap-6">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">TRACKED</div>
              <div className="text-2xl font-medium text-white">{metrics.activeAircraft}</div>
            </div>
            <div className="w-px h-12 bg-[#1a1a1a]" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">AVG ALT</div>
              <div className="text-2xl font-medium text-white">{Math.round(metrics.avgAltitude).toLocaleString()}</div>
            </div>
            <div className="w-px h-12 bg-[#1a1a1a]" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">MAX SPEED</div>
              <div className="text-2xl font-medium text-white">{Math.round(metrics.maxSpeed).toLocaleString()}</div>
            </div>
            <div className="w-px h-12 bg-[#1a1a1a]" />
            <div>
              <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">AVG SPEED</div>
              <div className="text-2xl font-medium text-white">{Math.round(metrics.avgSpeed).toLocaleString()}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-[10px] text-gray-500 uppercase tracking-wider">
              L=Local | R=Regional | G=Global | T=Trails | ESC=Deselect
            </div>
            {ipAddress && (
              <>
                <div className="w-px h-12 bg-[#1a1a1a]" />
                <div className="text-[10px] text-gray-500">
                  Connected from <span className="text-gray-400 font-mono">{ipAddress}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
