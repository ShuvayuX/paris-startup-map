
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Startup } from '@/types';
import { useMapContext } from '@/lib/MapContext';
import MapControls from './MapControls';
import MapboxTokenInput from './MapboxTokenInput';
import { DEFAULT_VIEW_STATE } from '@/lib/startups';
import { useToast } from "@/components/ui/use-toast";
import PlaceholderMap from './PlaceholderMap';

const Map: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [usingPlaceholder, setUsingPlaceholder] = useState(false);
  
  const { 
    filteredStartups, 
    selectedStartup, 
    setSelectedStartup,
    viewState,
    setViewState
  } = useMapContext();
  
  const { toast } = useToast();

  const handleTokenSaved = (token: string) => {
    const skipToken = localStorage.getItem('mapbox-skip-token') === 'true';
    if (skipToken) {
      setUsingPlaceholder(true);
      setMapLoaded(true);
    } else {
      setMapboxToken(token);
      setUsingPlaceholder(false);
    }
  };

  // Initialize map
  useEffect(() => {
    if (usingPlaceholder) return;
    if (!mapboxToken || !mapContainer.current || map.current) return;

    // Set the token
    mapboxgl.accessToken = mapboxToken;

    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        pitch: viewState.pitch,
        bearing: viewState.bearing,
        attributionControl: false
      });

      newMap.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-left');

      newMap.on('load', () => {
        setMapLoaded(true);
        toast({
          title: "Map Loaded",
          description: "Explore Paris startups by clicking on the markers.",
        });
      });

      newMap.on('move', () => {
        const { lng, lat } = newMap.getCenter();
        setViewState({
          longitude: lng,
          latitude: lat,
          zoom: newMap.getZoom(),
          pitch: newMap.getPitch(),
          bearing: newMap.getBearing()
        });
      });

      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          title: "Map Error",
          description: "There was an error loading the map. Please check your token.",
          variant: "destructive"
        });
      });

      map.current = newMap;
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Map Error",
        description: "There was an error initializing the map.",
        variant: "destructive"
      });
    }

    return () => {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      markersRef.current = {};
      map.current?.remove();
      map.current = null;
    };
  }, [mapboxToken, usingPlaceholder]); // Only re-initialize when token changes

  // Update map when view state changes from outside
  useEffect(() => {
    if (usingPlaceholder || !map.current) return;
    
    const currentCenter = map.current.getCenter();
    const currentZoom = map.current.getZoom();
    const currentBearing = map.current.getBearing();
    
    // Only animate if the changes are significant to avoid loops
    const positionChanged = 
      Math.abs(currentCenter.lng - viewState.longitude) > 0.00001 || 
      Math.abs(currentCenter.lat - viewState.latitude) > 0.00001;
    
    const zoomChanged = Math.abs(currentZoom - viewState.zoom) > 0.01;
    const bearingChanged = Math.abs(currentBearing - viewState.bearing) > 0.1;
    
    if (positionChanged || zoomChanged || bearingChanged) {
      map.current.easeTo({
        center: [viewState.longitude, viewState.latitude],
        zoom: viewState.zoom,
        bearing: viewState.bearing,
        pitch: viewState.pitch,
        duration: 800
      });
    }
  }, [viewState, usingPlaceholder]);

  // Update markers when filtered startups change
  useEffect(() => {
    if (usingPlaceholder) return;
    if (!map.current || !mapLoaded) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    filteredStartups.forEach((startup) => {
      const { longitude, latitude } = startup.location;
      
      // Create marker element
      const el = document.createElement('div');
      el.className = 'map-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.borderRadius = '8px';
      el.style.backgroundColor = 'white';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid #fff';
      el.style.overflow = 'hidden';
      
      // Add startup logo
      const img = document.createElement('img');
      img.src = startup.logo;
      img.alt = `${startup.name} logo`;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      el.appendChild(img);
      
      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(map.current!);
      
      // Add click event
      marker.getElement().addEventListener('click', () => {
        setSelectedStartup(startup);
        
        map.current?.flyTo({
          center: [longitude, latitude],
          zoom: Math.max(map.current.getZoom(), 14),
          offset: [200, 0],
          duration: 1000
        });
      });
      
      markersRef.current[startup.id] = marker;
    });
    
    // Highlight selected startup
    if (selectedStartup && markersRef.current[selectedStartup.id]) {
      const el = markersRef.current[selectedStartup.id].getElement();
      el.style.transform = 'scale(1.1)';
      el.style.zIndex = '100';
      el.style.borderColor = 'rgb(59, 130, 246)';
      el.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 10px rgba(0,0,0,0.1)';
    }
    
  }, [filteredStartups, selectedStartup, mapLoaded, usingPlaceholder]);

  // Map control functions
  const handleZoomIn = () => {
    if (usingPlaceholder) {
      setViewState({
        ...viewState,
        zoom: viewState.zoom + 1
      });
      return;
    }
    
    if (!map.current) return;
    map.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (usingPlaceholder) {
      setViewState({
        ...viewState,
        zoom: Math.max(viewState.zoom - 1, 1)
      });
      return;
    }
    
    if (!map.current) return;
    map.current.zoomOut();
  };

  const handleResetBearing = () => {
    if (usingPlaceholder) {
      setViewState({
        ...viewState,
        bearing: 0
      });
      return;
    }
    
    if (!map.current) return;
    map.current.setBearing(0);
  };

  const handleResetView = () => {
    if (usingPlaceholder) {
      setViewState({
        ...DEFAULT_VIEW_STATE
      });
      return;
    }
    
    if (!map.current) return;
    map.current.flyTo({
      center: [DEFAULT_VIEW_STATE.longitude, DEFAULT_VIEW_STATE.latitude],
      zoom: DEFAULT_VIEW_STATE.zoom,
      pitch: DEFAULT_VIEW_STATE.pitch,
      bearing: DEFAULT_VIEW_STATE.bearing,
      duration: 1000
    });
  };

  return (
    <div className="relative w-full h-full">
      {!usingPlaceholder && (
        <div 
          ref={mapContainer} 
          className="absolute inset-0 bg-muted"
        />
      )}
      
      {usingPlaceholder && <PlaceholderMap 
        startups={filteredStartups}
        selectedStartup={selectedStartup}
        onStartupClick={setSelectedStartup}
        viewState={viewState}
      />}
      
      <MapboxTokenInput onTokenSaved={handleTokenSaved} />
      
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetBearing={handleResetBearing}
        onResetView={handleResetView}
      />
      
      {(!mapLoaded && !usingPlaceholder) && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center">
            <div className="loader w-10 h-10 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
            <p className="mt-4 font-medium">
              {!mapboxToken ? "Waiting for Mapbox token..." : "Loading map..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
