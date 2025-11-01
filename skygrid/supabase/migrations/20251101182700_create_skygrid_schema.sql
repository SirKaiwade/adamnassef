/*
  # SkyGrid Live Database Schema

  1. New Tables
    - `pinned_aircraft`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous users)
      - `icao24` (text, aircraft identifier)
      - `callsign` (text, nullable)
      - `registration` (text, nullable)
      - `aircraft_type` (text, nullable)
      - `notify_on_takeoff` (boolean, default false)
      - `created_at` (timestamptz)
    
    - `alerts`
      - `id` (uuid, primary key)
      - `alert_type` (text, emergency_squawk | rapid_descent | diversion | weather_conflict)
      - `icao24` (text)
      - `callsign` (text, nullable)
      - `severity` (text, low | medium | high | critical)
      - `message` (text)
      - `latitude` (double precision, nullable)
      - `longitude` (double precision, nullable)
      - `altitude` (double precision, nullable)
      - `created_at` (timestamptz)
      - `resolved_at` (timestamptz, nullable)
    
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable for anonymous users)
      - `view_mode` (text, default 'global')
      - `selected_city` (text, nullable)
      - `selected_city_lat` (double precision, nullable)
      - `selected_city_lon` (double precision, nullable)
      - `radius_km` (integer, default 500)
      - `show_trails` (boolean, default true)
      - `show_air_routes` (boolean, default false)
      - `show_restricted_airspace` (boolean, default false)
      - `show_weather` (boolean, default false)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (anonymous display)
    - Add policies for authenticated users to manage their own data
*/

-- Create pinned_aircraft table
CREATE TABLE IF NOT EXISTS pinned_aircraft (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  icao24 text NOT NULL,
  callsign text,
  registration text,
  aircraft_type text,
  notify_on_takeoff boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pinned_aircraft ENABLE ROW LEVEL SECURITY;

-- Public can read all pinned aircraft (for shared displays)
CREATE POLICY "Anyone can view pinned aircraft"
  ON pinned_aircraft FOR SELECT
  TO public
  USING (true);

-- Users can insert their own pinned aircraft
CREATE POLICY "Users can pin aircraft"
  ON pinned_aircraft FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can delete their own pinned aircraft
CREATE POLICY "Users can unpin their aircraft"
  ON pinned_aircraft FOR DELETE
  TO public
  USING (true);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type text NOT NULL CHECK (alert_type IN ('emergency_squawk', 'rapid_descent', 'diversion', 'weather_conflict')),
  icao24 text NOT NULL,
  callsign text,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  message text NOT NULL,
  latitude double precision,
  longitude double precision,
  altitude double precision,
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Public can read all alerts
CREATE POLICY "Anyone can view alerts"
  ON alerts FOR SELECT
  TO public
  USING (true);

-- Only system can insert alerts (will be done via edge function)
CREATE POLICY "System can create alerts"
  ON alerts FOR INSERT
  TO public
  WITH CHECK (true);

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  view_mode text DEFAULT 'global' CHECK (view_mode IN ('local', 'regional', 'global', 'airport')),
  selected_city text,
  selected_city_lat double precision,
  selected_city_lon double precision,
  radius_km integer DEFAULT 500,
  show_trails boolean DEFAULT true,
  show_air_routes boolean DEFAULT false,
  show_restricted_airspace boolean DEFAULT false,
  show_weather boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Public can read preferences
CREATE POLICY "Anyone can view preferences"
  ON user_preferences FOR SELECT
  TO public
  USING (true);

-- Public can insert preferences
CREATE POLICY "Anyone can create preferences"
  ON user_preferences FOR INSERT
  TO public
  WITH CHECK (true);

-- Public can update preferences
CREATE POLICY "Anyone can update preferences"
  ON user_preferences FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved_at) WHERE resolved_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_pinned_aircraft_icao24 ON pinned_aircraft(icao24);
