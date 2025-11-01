/**
 * Flight information lookup utilities
 * Uses OpenSky Network API to get flight details like origin/destination
 */

export interface FlightInfo {
  origin?: string | null;
  destination?: string | null;
  airline?: string | null;
  icao24?: string | null;
}

// Cache to avoid repeated API calls for the same callsign
const flightInfoCache = new Map<string, { info: FlightInfo | null; timestamp: number }>();
const CACHE_TTL = 300000; // 5 minutes

/**
 * Attempts to look up flight information from callsign using OpenSky Network API
 * OpenSky has a flights endpoint that can provide route information
 */
export async function lookupFlightInfo(callsign: string | null, icao24?: string | null): Promise<FlightInfo | null> {
  if (!callsign || callsign.trim().length === 0) {
    return null;
  }

  const cleanCallsign = callsign.trim().toUpperCase();
  console.log(`[FlightInfo] Looking up flight info for callsign: "${cleanCallsign}"`);
  
  // Check cache first
  const cached = flightInfoCache.get(cleanCallsign);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[FlightInfo] Using cached result for ${cleanCallsign}`);
    return cached.info;
  }

  try {
    // Extract airline code and flight number
    const airlineMatch = cleanCallsign.match(/^([A-Z]{2,3})(\d+)/);
    if (!airlineMatch) {
      // If it doesn't match standard format, still try to look it up
      // Some callsigns might have different formats
    }
    
    const airlineCode = airlineMatch ? airlineMatch[1] : null;

    const now = Math.floor(Date.now() / 1000);
    const oneDayAgo = now - 86400; // 24 hours - OpenSky has historical route data
    
    // FIRST: Try OpenSky's aircraft-specific endpoint (most reliable)
    if (icao24) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        
        const aircraftResponse = await fetch(
          `https://opensky-network.org/api/flights/aircraft?icao24=${icao24.toLowerCase()}&begin=${oneDayAgo}&end=${now}`,
          {
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);
        
        if (aircraftResponse.ok) {
          const aircraftFlights = await aircraftResponse.json();
          
          if (Array.isArray(aircraftFlights) && aircraftFlights.length > 0) {
            // Get the most recent flight with route data
            const flightWithRoute = aircraftFlights.find((f: any) => 
              (f.estDepartureAirport || f.estArrivalAirport)
            ) || aircraftFlights[aircraftFlights.length - 1];
            
            if (flightWithRoute && (flightWithRoute.estDepartureAirport || flightWithRoute.estArrivalAirport)) {
              const info: FlightInfo = {
                origin: flightWithRoute.estDepartureAirport || null,
                destination: flightWithRoute.estArrivalAirport || null,
                airline: airlineCode,
                icao24: icao24,
              };
              
              flightInfoCache.set(cleanCallsign, { info, timestamp: Date.now() });
              console.log(`[FlightInfo] ✓ Found route via aircraft endpoint: ${info.origin || '?'} → ${info.destination || '?'}`);
              return info;
            }
          }
        }
      } catch (error) {
        // Continue to fallback
        console.debug('[FlightInfo] Aircraft endpoint failed, trying flights/all');
      }
    }
    
    // FALLBACK: Try the flights/all endpoint
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(
        `https://opensky-network.org/api/flights/all?begin=${oneDayAgo}&end=${now}`,
        {
          signal: controller.signal,
        }
      );
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const flights = await response.json();
        
        if (!Array.isArray(flights)) {
          console.debug('OpenSky returned non-array response');
          throw new Error('Invalid response format');
        }
        
        console.log(`[FlightInfo] Searching for ${cleanCallsign} in ${flights.length} flights`);
        
        // Normalize callsigns - remove all spaces and trailing whitespace
        const normalizeCallsign = (cs: string) => cs.trim().replace(/\s+/g, '').toUpperCase();
        const normalizedSearch = normalizeCallsign(cleanCallsign);
        
        // Find matching flight by callsign (exact match first, then partial)
        let flight = flights.find((f: any) => {
          if (!f.callsign) return false;
          const flightCallsign = normalizeCallsign(f.callsign);
          return flightCallsign === normalizedSearch;
        });
        
        // If no exact match, try matching just the airline code + flight number (remove suffixes)
        if (!flight) {
          // Try matching without any trailing letters (e.g., "UAL123" matches "UAL123P")
          const baseCallsign = normalizedSearch.match(/^([A-Z]{2,3}\d+)/)?.[1];
          if (baseCallsign) {
            flight = flights.find((f: any) => {
              if (!f.callsign) return false;
              const flightCallsign = normalizeCallsign(f.callsign);
              const flightBase = flightCallsign.match(/^([A-Z]{2,3}\d+)/)?.[1];
              return flightBase === baseCallsign;
            });
          }
        }
        
        // If still no match and we have ICAO24, try matching by ICAO24
        if (!flight && icao24) {
          const searchIcao = icao24.toLowerCase();
          flight = flights.find((f: any) => {
            return f.icao24 && f.icao24.toLowerCase() === searchIcao;
          });
          if (flight) {
            console.log(`[FlightInfo] Found flight by ICAO24 ${icao24}`);
          }
        }
        
        // If still no match, try partial match (contains)
        if (!flight) {
          flight = flights.find((f: any) => {
            if (!f.callsign) return false;
            const flightCallsign = normalizeCallsign(f.callsign);
            return flightCallsign.includes(normalizedSearch) || normalizedSearch.includes(flightCallsign);
          });
        }
        
        if (flight) {
          const info: FlightInfo = {
            origin: flight.estDepartureAirport || null,
            destination: flight.estArrivalAirport || null,
            airline: airlineCode,
          };
          
          // Cache even if no origin/destination, but mark it
          flightInfoCache.set(cleanCallsign, { info, timestamp: Date.now() });
          
          // Return if we got useful info
          if (info.origin || info.destination) {
            console.log(`[FlightInfo] ✓ Found route for ${cleanCallsign}: ${info.origin || '?'} → ${info.destination || '?'}`);
            return info;
          } else {
            console.log(`[FlightInfo] ⚠ Found flight ${cleanCallsign} in OpenSky but no route data (departure: ${flight.estDepartureAirport}, arrival: ${flight.estArrivalAirport})`);
          }
        } else {
          // Log a few sample callsigns to help debug
          const sampleCallsigns = flights
            .filter((f: any) => f.callsign)
            .slice(0, 5)
            .map((f: any) => normalizeCallsign(f.callsign));
          console.log(`[FlightInfo] ✗ No match for "${cleanCallsign}" in ${flights.length} flights. Sample callsigns: ${sampleCallsigns.join(', ')}`);
        }
      } else {
        console.debug(`[FlightInfo] OpenSky API returned ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      // OpenSky might rate limit or timeout
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.debug('[FlightInfo] Request timeout');
        } else {
          console.debug('[FlightInfo] OpenSky lookup error:', error.message);
        }
      }
    }

    // Fallback: return airline code if we found it (even if no route data)
    const info: FlightInfo = {
      airline: airlineCode,
      origin: null,
      destination: null,
    };
    
    // Cache the "no data" result to avoid repeated failed lookups
    flightInfoCache.set(cleanCallsign, { info, timestamp: Date.now() });
    console.debug(`[FlightInfo] No route data found for ${cleanCallsign}, returning null`);
    return info;
    
  } catch (error) {
    console.error('[FlightInfo] Error looking up flight info:', error);
    // Return null on error, but don't cache errors (allow retry)
    return null;
  }
}
