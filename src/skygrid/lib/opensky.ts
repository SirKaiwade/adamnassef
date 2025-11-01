export interface AircraftState {
  icao24: string;
  callsign: string | null;
  origin_country: string;
  time_position: number | null;
  last_contact: number;
  longitude: number | null;
  latitude: number | null;
  baro_altitude: number | null;
  on_ground: boolean;
  velocity: number | null;
  true_track: number | null;
  vertical_rate: number | null;
  sensors: number[] | null;
  geo_altitude: number | null;
  squawk: string | null;
  spi: boolean;
  position_source: number;
  // Additional fields from airplanes.live
  registration?: string | null;
  aircraft_type?: string | null;
  aircraft_description?: string | null;
  destination?: string | null;
  direction?: number | null;
}

interface AirplanesLiveAircraft {
  hex: string;
  flight?: string;
  r?: string;
  t?: string;
  squawk?: string;
  lat?: number;
  lon?: number;
  nucp?: number;
  seen_pos?: number;
  altitude?: number;
  vert_rate?: number;
  track?: number;
  speed?: number;
  category?: string;
  mlat?: boolean;
  tisb?: boolean;
  messages?: number;
  seen?: number;
  rssi?: number;
  type?: string;
  desc?: string; // Aircraft description
  dst?: string; // Destination airport code
  dir?: number; // Direction/bearing
}

interface AirplanesLiveResponse {
  ac?: AirplanesLiveAircraft[];
  ctime?: number;
  msg?: string;
}

export class OpenSkyAPI {
  private baseUrl = 'https://api.airplanes.live/v2';
  private lastFetch = 0;
  private minInterval = 1000; // 1 request per second (rate limit)

  async fetchAircraft(bounds?: { latMin: number; latMax: number; lonMin: number; lonMax: number }): Promise<AircraftState[]> {
    const now = Date.now();
    if (now - this.lastFetch < this.minInterval) {
      await new Promise(resolve => setTimeout(resolve, this.minInterval - (now - this.lastFetch)));
    }

    try {
      if (bounds) {
        // Local/Regional view - single query for the specified bounds
        const centerLat = (bounds.latMin + bounds.latMax) / 2;
        const centerLon = (bounds.lonMin + bounds.lonMax) / 2;
        
        // Calculate radius in nautical miles (approximate)
        const latKm = (bounds.latMax - bounds.latMin) * 111;
        const lonKm = (bounds.lonMax - bounds.lonMin) * 111 * Math.cos((centerLat * Math.PI) / 180);
        const radiusKm = Math.max(latKm, lonKm);
        const radiusNm = radiusKm * 0.539957; // Convert km to nautical miles
        
        // Clamp to max 250 nm (API limit)
        const radius = Math.min(radiusNm, 250);
        
        const url = `${this.baseUrl}/point/${centerLat.toFixed(6)}/${centerLon.toFixed(6)}/${radius.toFixed(0)}`;
        return await this.fetchFromUrl(url);
      } else {
        // Global view - query multiple strategic points around the world
        // Major flight corridors and populated regions
        const globalPoints = [
          { lat: 40.0, lon: -95.0, radius: 250, name: 'North America' },
          { lat: 50.0, lon: 10.0, radius: 250, name: 'Europe' },
          { lat: 30.0, lon: 120.0, radius: 250, name: 'East Asia' },
          { lat: -35.0, lon: 150.0, radius: 250, name: 'Australia' },
          { lat: 20.0, lon: 80.0, radius: 250, name: 'India/South Asia' },
          { lat: -25.0, lon: -50.0, radius: 250, name: 'South America' },
          { lat: 30.0, lon: 30.0, radius: 250, name: 'Middle East' },
        ];

        console.log('[API] Starting global fetch from', globalPoints.length, 'points');

        // Fetch from all points with delays to respect rate limits
        const allAircraft: AircraftState[] = [];
        const seenIds = new Set<string>();

        for (let i = 0; i < globalPoints.length; i++) {
          const point = globalPoints[i];
          const url = `${this.baseUrl}/point/${point.lat}/${point.lon}/${point.radius}`;
          
          console.log(`[API] Fetching ${point.name} (${point.lat}, ${point.lon})...`);
          
          try {
            const aircraft = await this.fetchFromUrl(url);
            console.log(`[API] Got ${aircraft.length} aircraft from ${point.name}`);
            
            // Deduplicate by icao24
            let added = 0;
            aircraft.forEach(ac => {
              if (!seenIds.has(ac.icao24)) {
                seenIds.add(ac.icao24);
                allAircraft.push(ac);
                added++;
              }
            });
            console.log(`[API] Added ${added} new aircraft (${seenIds.size} total so far)`);
            
            // Wait between requests to respect rate limit (1 req/sec)
            if (i < globalPoints.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2 seconds between requests
            }
          } catch (error) {
            console.error(`[API] Failed to fetch from ${point.name} (${point.lat},${point.lon}):`, error);
            // Continue with other points even if one fails
          }
        }

        console.log(`[API] Global fetch complete: ${allAircraft.length} total aircraft`);
        this.lastFetch = Date.now();
        return allAircraft;
      }

    } catch (error) {
      console.error('Error fetching aircraft data:', error);
      return [];
    }
  }

  private async fetchFromUrl(url: string): Promise<AircraftState[]> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Airplanes.live API error: ${response.status}`);
      }

      const data: AirplanesLiveResponse = await response.json();

      if (!data.ac || data.ac.length === 0) {
        return [];
      }

      // Convert airplanes.live format to our AircraftState format
      return data.ac
        .filter(ac => ac.lat !== undefined && ac.lon !== undefined)
        .map(ac => ({
          icao24: ac.hex.toLowerCase(),
          callsign: ac.flight?.trim() || null,
          origin_country: ac.r || 'Unknown',
          time_position: ac.seen_pos ? ac.seen_pos * 1000 : null, // Convert to milliseconds
          last_contact: ac.seen ? ac.seen * 1000 : Date.now(),
          longitude: ac.lon!,
          latitude: ac.lat!,
          baro_altitude: ac.altitude ? ac.altitude / 3.28084 : null, // Convert feet to meters
          on_ground: ac.altitude === 0 || (ac.altitude !== undefined && ac.altitude < 100),
          velocity: ac.speed ? ac.speed / 1.944 : null, // Convert knots to m/s
          true_track: ac.track || null,
          vertical_rate: ac.vert_rate ? ac.vert_rate / 196.85 : null, // Convert ft/min to m/s
          sensors: null,
          geo_altitude: ac.altitude ? ac.altitude / 3.28084 : null,
          squawk: ac.squawk || null,
          spi: false,
          position_source: 0,
          // Additional juicy info
          registration: ac.r || null,
          aircraft_type: ac.t || null,
          aircraft_description: ac.desc || null,
          // Only use dst if it looks like an airport code (letters), not a number
          destination: ac.dst && typeof ac.dst === 'string' && isNaN(Number(ac.dst)) ? ac.dst : null,
          direction: ac.dir || null,
        }));
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - Airplanes.live API is not responding');
      }
      throw error;
    }
  }

  async fetchAircraftByIcao(icao24: string): Promise<AircraftState | null> {
    const aircraft = await this.fetchAircraft();
    return aircraft.find(a => a.icao24 === icao24) || null;
  }
}

export const openskyAPI = new OpenSkyAPI();
