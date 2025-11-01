export type ViewMode = 'local' | 'regional' | 'global' | 'airport';

export type AlertType = 'emergency_squawk' | 'rapid_descent' | 'diversion' | 'weather_conflict';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  alert_type: AlertType;
  icao24: string;
  callsign: string | null;
  severity: Severity;
  message: string;
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  created_at: string;
  resolved_at: string | null;
}

export interface PinnedAircraft {
  id: string;
  icao24: string;
  callsign: string | null;
  registration: string | null;
  aircraft_type: string | null;
  notify_on_takeoff: boolean;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  view_mode: ViewMode;
  selected_city: string | null;
  selected_city_lat: number | null;
  selected_city_lon: number | null;
  radius_km: number;
  show_trails: boolean;
  show_air_routes: boolean;
  show_restricted_airspace: boolean;
  show_weather: boolean;
  updated_at: string;
}

export interface Aircraft {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  longitude: number;
  latitude: number;
  baro_altitude: number;
  velocity: number;
  true_track: number;
  vertical_rate: number;
  on_ground: boolean;
  squawk: string | null;
  last_contact: number;
  // Additional juicy info
  registration?: string | null;
  aircraft_type?: string | null;
  aircraft_description?: string | null;
  destination?: string | null;
  direction?: number | null;
}

export interface AircraftWithHistory extends Aircraft {
  history: Array<{ lon: number; lat: number; timestamp: number }>;
  interpolated?: { lon: number; lat: number };
}
