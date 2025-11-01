import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Aircraft, ViewMode } from '../types';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2Fpd2FkZSIsImEiOiJjbWhnbXZhOG0wampxMmtweWptcHZidDZvIn0.WVrZhW8TIwgPIV83WbX4xw';

interface MapProps {
  aircraft: Aircraft[];
  viewMode: ViewMode;
  selectedCity: { lat: number; lon: number; name: string } | null;
  userLocation: { lat: number; lon: number } | null;
  showTrails: boolean;
  onAircraftClick: (aircraft: Aircraft) => void;
}

interface AircraftWithTimestamp extends Aircraft {
  lastSeen: number;
  timestamp: number;
}

export function AircraftMap({ aircraft, viewMode, selectedCity, userLocation, showTrails, onAircraftClick }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const clickHandlersRef = useRef<Map<string, Aircraft>>(new Map());
  const previousAircraftRef = useRef<Map<string, Aircraft>>(new Map());
  // Keep aircraft visible even if they're not in the latest fetch (for smooth transitions)
  const smoothedAircraftRef = useRef<Map<string, AircraftWithTimestamp>>(new Map());
  const updateIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      if (!mapboxgl.accessToken || mapboxgl.accessToken.includes('example')) {
        console.error('Mapbox access token is missing or invalid. Please set a valid token in src/components/Map.tsx');
        setMapLoaded(false);
        return;
      }

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [0, 20],
        zoom: 2,
        projection: 'mercator' as any,
      });

      map.current.on('load', () => {
        setMapLoaded(true);

        if (map.current) {
          try {
            // Create plane icon by converting SVG to canvas/ImageData
            const createPlaneIcon = (callback: (image: HTMLImageElement | ImageData) => void) => {
              const canvas = document.createElement('canvas');
              canvas.width = 24;
              canvas.height = 24;
              const ctx = canvas.getContext('2d');
              
              if (!ctx) {
                console.error('Could not get canvas context');
                return;
              }

              // Create an image from SVG data URI
              const svgData = `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="0.5"/>
</svg>`;
              
              const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
              const url = URL.createObjectURL(svgBlob);
              
              const img = new Image();
              img.onload = () => {
                ctx.drawImage(img, 0, 0);
                const imageData = ctx.getImageData(0, 0, 24, 24);
                callback(imageData);
                URL.revokeObjectURL(url);
              };
              img.onerror = () => {
                console.error('Error loading SVG image');
                URL.revokeObjectURL(url);
                // Fallback: create a simple plane shape using canvas
                ctx.fillStyle = '#e2e8f0';
                ctx.strokeStyle = '#cbd5e1';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(12, 2);
                ctx.lineTo(20, 10);
                ctx.lineTo(16, 12);
                ctx.lineTo(12, 10);
                ctx.lineTo(4, 14);
                ctx.lineTo(8, 16);
                ctx.lineTo(12, 14);
                ctx.lineTo(16, 16);
                ctx.lineTo(20, 14);
                ctx.lineTo(16, 12);
                ctx.lineTo(12, 22);
                ctx.lineTo(10, 20);
                ctx.lineTo(12, 14);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
                const imageData = ctx.getImageData(0, 0, 24, 24);
                callback(imageData);
              };
              img.src = url;
            };
            
            // Aircraft source
            map.current.addSource('aircraft', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [],
              },
            });

            // Create and load icon
            createPlaneIcon((imageData) => {
              if (map.current && !map.current.hasImage('plane-icon')) {
                map.current.addImage('plane-icon', imageData);
              }
              
              // Only add layer if it doesn't exist
              if (map.current && !map.current.getLayer('aircraft-planes')) {
                map.current.addLayer({
                  id: 'aircraft-planes',
                  type: 'symbol',
                  source: 'aircraft',
                  layout: {
                    'icon-image': 'plane-icon',
                    'icon-size': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      2, 0.6,
                      5, 0.8,
                      8, 1.0,
                    ],
                    'icon-rotate': ['get', 'heading'],
                    'icon-rotation-alignment': 'map',
                    'icon-allow-overlap': false,
                    'icon-ignore-placement': false,
                  },
                  paint: {
                    'icon-opacity': 0.9,
                  },
                });
              }
            });

            // Trails source
            map.current.addSource('aircraft-trails', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [],
              },
            });

            map.current.addLayer({
              id: 'trails',
              type: 'line',
              source: 'aircraft-trails',
              paint: {
                'line-color': '#e2e8f0',
                'line-width': 1,
                'line-opacity': 0.4,
              },
            });

            // Click handler for aircraft
            map.current.on('click', 'aircraft-planes', (e) => {
              if (e.features && e.features[0]) {
                const icao24 = e.features[0].properties?.icao24;
                if (icao24 && clickHandlersRef.current.has(icao24)) {
                  onAircraftClick(clickHandlersRef.current.get(icao24)!);
                }
              }
            });

            // Change cursor on hover
            map.current.on('mouseenter', 'aircraft-planes', () => {
              if (map.current) {
                map.current.getCanvas().style.cursor = 'pointer';
              }
            });

            map.current.on('mouseleave', 'aircraft-planes', () => {
              if (map.current) {
                map.current.getCanvas().style.cursor = '';
              }
            });
          } catch (layerError) {
            console.error('Error adding map layers:', layerError);
          }
        }
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapLoaded(false);
      });
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setMapLoaded(false);
    }

    return () => {
      clickHandlersRef.current.clear();
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    switch (viewMode) {
      case 'global':
        map.current.flyTo({ center: [0, 20], zoom: 2, duration: 2000 });
        break;
      case 'local':
        // Use selectedCity if available, otherwise fall back to userLocation
        const locationToUse = selectedCity || (userLocation ? { lat: userLocation.lat, lon: userLocation.lon } : null);
        if (locationToUse) {
          map.current.flyTo({ center: [locationToUse.lon, locationToUse.lat], zoom: 7, duration: 2000 });
        }
        break;
      case 'regional':
        // Use user location for regional view too if available
        const regionalCenter = userLocation || { lat: 40, lon: -95 };
        map.current.flyTo({ center: [regionalCenter.lon, regionalCenter.lat], zoom: 4, duration: 2000 });
        break;
    }
  }, [viewMode, selectedCity, userLocation]);

  // Store latest aircraft data for smoothing (target positions)
  const latestAircraftRef = useRef<Map<string, Aircraft>>(new Map());
  
  // Merge new aircraft data with existing smoothed aircraft
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const now = Date.now();
    const staleTimeout = 30000; // Remove aircraft if not seen for 30 seconds

    // Update latest aircraft reference (target positions)
    latestAircraftRef.current.clear();
    aircraft.forEach(plane => {
      if (plane.longitude && plane.latitude && !plane.on_ground) {
        latestAircraftRef.current.set(plane.icao24, plane);
      }
    });

    // Initialize smoothed aircraft if they don't exist yet
    aircraft.forEach(plane => {
      if (plane.longitude && plane.latitude && !plane.on_ground) {
        if (!smoothedAircraftRef.current.has(plane.icao24)) {
          // New aircraft - start with exact position
          smoothedAircraftRef.current.set(plane.icao24, {
            ...plane,
            lastSeen: now,
            timestamp: now,
          });
        } else {
          // Existing aircraft - just update lastSeen, keep current smoothed position
          const existing = smoothedAircraftRef.current.get(plane.icao24)!;
          smoothedAircraftRef.current.set(plane.icao24, {
            ...existing,
            lastSeen: now,
          });
        }
      }
    });

    // Remove stale aircraft (not seen in latest fetch and haven't been seen for >30s)
    for (const [icao24, planeData] of smoothedAircraftRef.current.entries()) {
      // Check if aircraft is still in latest data
      const stillExists = latestAircraftRef.current.has(icao24);
      if (!stillExists && now - planeData.lastSeen > staleTimeout) {
        smoothedAircraftRef.current.delete(icao24);
      }
    }
  }, [aircraft, mapLoaded]);

  // Smooth position updates using requestAnimationFrame
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear any existing update interval
    if (updateIntervalRef.current) {
      cancelAnimationFrame(updateIntervalRef.current);
    }

    const updatePositions = () => {
      if (!map.current) return;

      const now = Date.now();
      const staleTimeout = 30000;
      const latestAircraftMap = latestAircraftRef.current;

      // Filter and smooth aircraft positions
      let visibleAircraft = Array.from(smoothedAircraftRef.current.values())
        .filter(plane => {
          if (!plane.longitude || !plane.latitude || plane.on_ground) return false;
          if (now - plane.lastSeen > staleTimeout) return false;
          return true;
        })
        .map(plane => {
          // Get latest target data if available
          const latest = latestAircraftMap.get(plane.icao24);
          if (latest && latest.longitude && latest.latitude && !latest.on_ground) {
            // Smooth interpolation: gradually move toward latest position
            const smoothingFactor = 0.15; // Lower = smoother but slower response
            
            // Update smoothed position (interpolate toward target)
            const smoothedPlane = {
              ...latest,
              longitude: plane.longitude + (latest.longitude - plane.longitude) * smoothingFactor,
              latitude: plane.latitude + (latest.latitude - plane.latitude) * smoothingFactor,
              true_track: latest.true_track || plane.true_track || 0, // Use latest heading immediately
              lastSeen: plane.lastSeen,
              timestamp: plane.timestamp,
            } as AircraftWithTimestamp;
            
            // Update the ref for next frame
            smoothedAircraftRef.current.set(plane.icao24, smoothedPlane);
            return smoothedPlane;
          }
          // Keep existing position if not in latest data (will be removed by staleTimeout)
          return plane;
        });

    // Calculate distance from user location or map center to prioritize nearby aircraft
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

    // Prioritize aircraft by distance from user location or map center
    const referencePoint = userLocation || (map.current.getCenter() ? {
      lat: map.current.getCenter().lat,
      lon: map.current.getCenter().lng
    } : null);

    if (referencePoint) {
      visibleAircraft = visibleAircraft
        .map(plane => {
          const distance = calculateDistance(
            referencePoint.lat,
            referencePoint.lon,
            plane.latitude,
            plane.longitude
          );
          return { plane, distance };
        })
        .sort((a, b) => a.distance - b.distance) // Closest first
        .map(item => item.plane); // Extract just the plane
    }

    // For local view, use all fetched aircraft (already filtered by city bounds)
    // For other views, filter by viewport bounds
    let aircraftToDisplay: typeof visibleAircraft;
    
    if (viewMode === 'local') {
      // In local mode, data is already filtered by city bounds, so use all visible aircraft
      aircraftToDisplay = visibleAircraft.slice(0, 300);
    } else if (viewMode === 'regional') {
      // In regional view, filter by viewport bounds
      const bounds = map.current.getBounds();
      const viewportFiltered = bounds 
        ? visibleAircraft.filter(plane => {
            return bounds.contains([plane.longitude, plane.latitude]);
          })
        : visibleAircraft;
      aircraftToDisplay = viewportFiltered.slice(0, 300);
    } else {
      // Global view - prioritize nearby aircraft, show closest 300-500
      // Since we already sorted by distance, just take the closest ones
      // This shows aircraft in your area first, then fills in with others
      if (referencePoint) {
        // Show closest 300 aircraft (already sorted by distance)
        aircraftToDisplay = visibleAircraft.slice(0, 300);
      } else {
        // No user location, show all up to 500
        aircraftToDisplay = visibleAircraft.slice(0, 500);
      }
    }

    // Clear click handlers
    clickHandlersRef.current.clear();

    // Convert to GeoJSON with trails if enabled
    const features = aircraftToDisplay.map(plane => {
      clickHandlersRef.current.set(plane.icao24, plane);
      
      return {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [plane.longitude, plane.latitude],
        },
        properties: {
          icao24: plane.icao24,
          callsign: plane.callsign || '',
          altitude: plane.baro_altitude || 0,
          velocity: plane.velocity || 0,
          heading: plane.true_track || 0,
        },
      };
    });

    // Update trails if enabled
    if (showTrails && map.current) {
      const trailsSource = map.current.getSource('aircraft-trails') as mapboxgl.GeoJSONSource;
      if (trailsSource && previousAircraftRef.current) {
        const trailFeatures = aircraftToDisplay
          .filter(plane => previousAircraftRef.current.has(plane.icao24))
          .map(plane => {
            const prev = previousAircraftRef.current.get(plane.icao24);
            if (!prev) return null;
            
            return {
              type: 'Feature' as const,
              geometry: {
                type: 'LineString' as const,
                coordinates: [
                  [prev.longitude, prev.latitude],
                  [plane.longitude, plane.latitude],
                ],
              },
              properties: {
                icao24: plane.icao24,
              },
            };
          })
          .filter((f): f is NonNullable<typeof f> => f !== null);

        trailsSource.setData({
          type: 'FeatureCollection',
          features: trailFeatures,
        });
      }
    } else {
      const trailsSource = map.current?.getSource('aircraft-trails') as mapboxgl.GeoJSONSource;
      if (trailsSource) {
        trailsSource.setData({
          type: 'FeatureCollection',
          features: [],
        });
      }
    }

      // Update the source
      const source = map.current.getSource('aircraft') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features,
        });
      }

      // Update previous aircraft for trails
      previousAircraftRef.current = new Map(aircraftToDisplay.map(a => [a.icao24, a]));
      
      // Continue animation loop
      updateIntervalRef.current = requestAnimationFrame(updatePositions);
    };

    // Start the animation loop
    updatePositions();

    // Cleanup
    return () => {
      if (updateIntervalRef.current) {
        cancelAnimationFrame(updateIntervalRef.current);
      }
    };
  }, [mapLoaded, viewMode, showTrails, userLocation, selectedCity]);

  return (
    <div className="absolute inset-0">
      <div ref={mapContainer} className="w-full h-full" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-slate-200 font-light">
              Initializing Map
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
