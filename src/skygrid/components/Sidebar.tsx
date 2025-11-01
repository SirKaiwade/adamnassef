import { X, Plane, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import type { Aircraft } from '../types';
import { lookupFlightInfo, type FlightInfo } from '../lib/flightInfo';

interface SidebarProps {
  selectedAircraft: Aircraft | null;
  overheadAircraft: Array<{ aircraft: Aircraft; timestamp: number }>;
  onClose: () => void;
  onAircraftSelect: (aircraft: Aircraft) => void;
  selectedCity?: { name: string; lat: number; lon: number } | null;
}

export function Sidebar({ selectedAircraft, overheadAircraft, onClose, onAircraftSelect, selectedCity }: SidebarProps) {
  const { theme } = useTheme();
  const [flightInfo, setFlightInfo] = useState<FlightInfo | null>(null);
  const [loadingFlightInfo, setLoadingFlightInfo] = useState(false);

  // Look up flight info when aircraft is selected
  useEffect(() => {
    if (selectedAircraft?.callsign) {
      setLoadingFlightInfo(true);
      setFlightInfo(null);
      
      // Add a timeout to ensure we always stop loading
      const timeoutId = setTimeout(() => {
        setLoadingFlightInfo(false);
      }, 10000); // 10 second max
      
      lookupFlightInfo(selectedAircraft.callsign, selectedAircraft.icao24)
        .then(info => {
          clearTimeout(timeoutId);
          setFlightInfo(info);
          setLoadingFlightInfo(false);
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          console.error('Error fetching flight info:', error);
          setFlightInfo(null);
          setLoadingFlightInfo(false);
        });
      
      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      setFlightInfo(null);
      setLoadingFlightInfo(false);
    }
  }, [selectedAircraft?.callsign]);

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  };

  return (
    <div className={`absolute top-14 right-0 bottom-20 w-[400px] z-20 overflow-hidden flex flex-col ${
      theme === 'light'
        ? 'bg-white border-l border-slate-200'
        : 'bg-[#0a0a0a] border-l border-[#1a1a1a]'
    }`}>
      <div className="flex-1 overflow-y-auto">
        {/* Selected Aircraft Details */}
        {selectedAircraft ? (
          <div className={`p-6 border-b ${
            theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
          }`}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className={`text-[10px] uppercase tracking-widest mb-2 ${
                  theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                }`}>AIRCRAFT SELECTED</div>
                <div className={`text-xl font-semibold ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>
                  {selectedAircraft.callsign?.trim() || selectedAircraft.icao24}
                </div>
              </div>
              <button
                onClick={onClose}
                className={`transition-colors p-1 ${
                  theme === 'light' ? 'text-slate-500 hover:text-slate-900' : 'text-gray-500 hover:text-white'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`flex justify-between items-center py-2 border-b ${
                theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
              }`}>
                <span className={`text-[10px] uppercase tracking-widest ${
                  theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                }`}>ICAO24</span>
                <span className={`text-sm font-medium ${
                  theme === 'light' ? 'text-slate-900' : 'text-white'
                }`}>{selectedAircraft.icao24}</span>
              </div>

              {selectedAircraft.registration && (
                <div className={`flex justify-between items-center py-2 border-b ${
                  theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
                }`}>
                  <span className={`text-[10px] uppercase tracking-widest ${
                    theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                  }`}>Registration</span>
                  <span className={`text-sm font-medium ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                  }`}>{selectedAircraft.registration}</span>
                </div>
              )}

              {selectedAircraft.aircraft_description && (
                <div className={`flex justify-between items-center py-2 border-b ${
                  theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
                }`}>
                  <span className={`text-[10px] uppercase tracking-widest ${
                    theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                  }`}>Aircraft</span>
                  <span className={`text-sm font-medium ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                  }`}>{selectedAircraft.aircraft_description}</span>
                </div>
              )}

              {selectedAircraft.aircraft_type && !selectedAircraft.aircraft_description && (
                <div className={`flex justify-between items-center py-2 border-b ${
                  theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
                }`}>
                  <span className={`text-[10px] uppercase tracking-widest ${
                    theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                  }`}>Type</span>
                  <span className={`text-sm font-medium ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                  }`}>{selectedAircraft.aircraft_type}</span>
                </div>
              )}

              <div className={`flex justify-between items-center py-2 border-b ${
                theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
              }`}>
                <span className={`text-[10px] uppercase tracking-widest ${
                  theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                }`}>Origin</span>
                <span className={`text-sm font-medium ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  {loadingFlightInfo ? (
                    <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-500'}>Loading...</span>
                  ) : flightInfo?.origin ? (
                    flightInfo.origin
                  ) : (
                    <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-500'}>{selectedAircraft.origin_country || 'Unknown'}</span>
                  )}
                </span>
              </div>

              {selectedAircraft.callsign && (
                <div className={`flex justify-between items-center py-2 border-b ${
                  theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
                }`}>
                  <span className={`text-[10px] uppercase tracking-widest ${
                    theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                  }`}>Destination</span>
                  <span className={`text-sm font-medium ${
                    theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                  }`}>
                    {loadingFlightInfo ? (
                      <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-500'}>Loading...</span>
                    ) : flightInfo?.destination ? (
                      flightInfo.destination
                    ) : (
                      <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-500'}>Not available</span>
                    )}
                  </span>
                </div>
              )}

              <div className={`flex justify-between items-center py-2 border-b ${
                theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
              }`}>
                <span className={`text-[10px] uppercase tracking-widest ${
                  theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                }`}>Altitude</span>
                <span className={`text-sm font-medium ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  {selectedAircraft.baro_altitude ? `${Math.round(selectedAircraft.baro_altitude * 3.28084).toLocaleString()} ft` : 'N/A'}
                </span>
              </div>

              <div className={`flex justify-between items-center py-2 border-b ${
                theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
              }`}>
                <span className={`text-[10px] uppercase tracking-widest ${
                  theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                }`}>Velocity</span>
                <span className={`text-sm font-medium ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  {selectedAircraft.velocity ? `${Math.round(selectedAircraft.velocity * 1.944)} kt` : 'N/A'}
                </span>
              </div>

              <div className={`flex justify-between items-center py-2 border-b ${
                theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
              }`}>
                <span className={`text-[10px] uppercase tracking-widest ${
                  theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                }`}>Heading</span>
                <span className={`text-sm font-medium ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  {selectedAircraft.true_track ? `${Math.round(selectedAircraft.true_track)}°` : 'N/A'}
                </span>
              </div>

              <div className={`flex justify-between items-center py-2 border-b ${
                theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
              }`}>
                <span className={`text-[10px] uppercase tracking-widest ${
                  theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                }`}>V/S</span>
                <span className={`text-sm font-medium ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                }`}>
                  {selectedAircraft.vertical_rate ? `${Math.round(selectedAircraft.vertical_rate * 196.85)} ft/min` : 'N/A'}
                </span>
              </div>

              {selectedAircraft.squawk && (
                <div className={`flex justify-between items-center py-2 border-b ${
                  theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
                }`}>
                  <span className={`text-[10px] uppercase tracking-widest ${
                    theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                  }`}>Squawk</span>
                  <span className="text-sm text-amber-400 font-mono font-medium">{selectedAircraft.squawk}</span>
                </div>
              )}
            </div>
          </div>
        ) : overheadAircraft.length > 0 ? (
          <>
            <div className={`p-6 border-b ${
              theme === 'light' ? 'border-slate-200' : 'border-[#1a1a1a]'
            }`}>
              <div className={`text-[10px] uppercase tracking-widest mb-2 ${
                theme === 'light' ? 'text-slate-500' : 'text-gray-500'
              }`}>AIRCRAFT OVERHEAD</div>
              <div className={`text-sm ${
                theme === 'light' ? 'text-slate-600' : 'text-gray-400'
              }`}>{overheadAircraft.length} aircraft within 10km</div>
            </div>
            <div className="p-4 space-y-3">
              {overheadAircraft.map(({ aircraft, timestamp }) => (
                <button
                  key={aircraft.icao24}
                  onClick={() => onAircraftSelect(aircraft)}
                  className={`w-full p-4 border transition-colors text-left ${
                    theme === 'light'
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-[#1a1a1a] border-[#1a1a1a] hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Plane className={`w-3 h-3 ${
                        theme === 'light' ? 'text-slate-700' : 'text-slate-200'
                      }`} />
                      <div className={`text-sm font-semibold ${
                        theme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}>
                        {aircraft.callsign?.trim() || aircraft.icao24}
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 text-[10px] ${
                      theme === 'light' ? 'text-slate-500' : 'text-gray-500'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {formatTimeAgo(timestamp)}
                    </div>
                  </div>
                  <div className={`grid grid-cols-2 gap-2 text-[10px] mt-2 ${
                    theme === 'light' ? 'text-slate-600' : 'text-gray-400'
                  }`}>
                    <div>
                      <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-500'}>Alt:</span>{' '}
                      <span className={theme === 'light' ? 'text-slate-900' : 'text-slate-200'}>
                        {aircraft.baro_altitude ? `${Math.round(aircraft.baro_altitude * 3.28084).toLocaleString()} ft` : 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className={theme === 'light' ? 'text-slate-500' : 'text-gray-500'}>Speed:</span>{' '}
                      <span className={theme === 'light' ? 'text-slate-900' : 'text-slate-200'}>
                        {aircraft.velocity ? `${Math.round(aircraft.velocity * 1.944)} kt` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className={`text-[10px] uppercase tracking-widest mb-2 ${
              theme === 'light' ? 'text-slate-500' : 'text-gray-500'
            }`}>AIRCRAFT OVERHEAD</div>
            <div className={`text-sm ${
              theme === 'light' ? 'text-slate-500' : 'text-gray-500'
            }`}>
              No aircraft currently overhead
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
