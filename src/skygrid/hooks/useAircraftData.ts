import { useState, useEffect, useRef } from 'react';
import { openskyAPI, type AircraftState } from '../lib/opensky';
import type { Aircraft, ViewMode } from '../types';

interface UseAircraftDataOptions {
  viewMode: ViewMode;
  selectedCity: { lat: number; lon: number } | null;
  radiusKm: number;
  refreshInterval?: number;
}

// Airplanes.live rate limit is 1 request per second
// Global view needs ~10 seconds (7 points × 1.2s), so use longer interval for global
export function useAircraftData({ viewMode, selectedCity, radiusKm, refreshInterval }: UseAircraftDataOptions) {
  // Default refresh interval: longer for global view (needs multiple API calls)
  const defaultInterval = viewMode === 'global' ? 15000 : 5000;
  const actualRefreshInterval = refreshInterval || defaultInterval;
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const previousDataRef = useRef<Map<string, Aircraft>>(new Map());
  const interpolationIntervalRef = useRef<number | null>(null);

  const convertToAircraft = (state: AircraftState): Aircraft | null => {
    if (state.longitude === null || state.latitude === null) return null;

    return {
      icao24: state.icao24,
      callsign: state.callsign,
      origin_country: state.origin_country,
      longitude: state.longitude,
      latitude: state.latitude,
      baro_altitude: state.baro_altitude || 0,
      velocity: state.velocity || 0,
      true_track: state.true_track || 0,
      vertical_rate: state.vertical_rate || 0,
      on_ground: state.on_ground,
      squawk: state.squawk,
      last_contact: state.last_contact,
      // Pass through additional juicy info
      registration: state.registration,
      aircraft_type: state.aircraft_type,
      aircraft_description: state.aircraft_description,
      destination: state.destination,
      direction: state.direction,
    };
  };

  const calculateBounds = () => {
    // Only calculate bounds for local view with a selected city
    // For global/regional views, pass undefined to fetch globally
    if (viewMode !== 'local' || !selectedCity) return undefined;

    const kmToDegrees = radiusKm / 111;

    return {
      latMin: selectedCity.lat - kmToDegrees,
      latMax: selectedCity.lat + kmToDegrees,
      lonMin: selectedCity.lon - kmToDegrees * Math.cos((selectedCity.lat * Math.PI) / 180),
      lonMax: selectedCity.lon + kmToDegrees * Math.cos((selectedCity.lat * Math.PI) / 180),
    };
  };

  const fetchAircraft = async () => {
    try {
      const bounds = calculateBounds();
      if (bounds) {
        console.log(`[Data Hook] Fetching aircraft - viewMode: ${viewMode}, center: (${((bounds.latMin + bounds.latMax) / 2).toFixed(4)}, ${((bounds.lonMin + bounds.lonMax) / 2).toFixed(4)})`);
      } else {
        console.log(`[Data Hook] Fetching aircraft - viewMode: ${viewMode}, bounds: global`);
      }
      const states = await openskyAPI.fetchAircraft(bounds);
      console.log(`[Data Hook] Received ${states.length} aircraft`);

      const converted = states
        .map(convertToAircraft)
        .filter((a): a is Aircraft => a !== null);

      const newDataMap = new Map(converted.map(a => [a.icao24, a]));

      setAircraft(converted);
      previousDataRef.current = newDataMap;
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching aircraft:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAircraft();

    const interval = setInterval(() => {
      fetchAircraft();
    }, actualRefreshInterval);

    return () => {
      clearInterval(interval);
      if (interpolationIntervalRef.current) {
        clearInterval(interpolationIntervalRef.current);
      }
    };
  }, [viewMode, selectedCity, radiusKm, actualRefreshInterval]);

  return { aircraft, isLoading };
}
