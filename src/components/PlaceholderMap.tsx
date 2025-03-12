
import React from 'react';
import { Startup, MapViewState } from '@/types';

interface PlaceholderMapProps {
  startups: Startup[];
  selectedStartup: Startup | null;
  onStartupClick: (startup: Startup) => void;
  viewState: MapViewState;
}

const PlaceholderMap: React.FC<PlaceholderMapProps> = ({ 
  startups, 
  selectedStartup, 
  onStartupClick,
  viewState 
}) => {
  // Calculate map dimensions
  const mapWidth = 1000;
  const mapHeight = 1000;
  
  // Paris coordinates from the DEFAULT_VIEW_STATE
  const centerLng = 2.3522;
  const centerLat = 48.8566;
  
  // Scale factor based on zoom
  const scale = Math.pow(2, viewState.zoom - 10);
  
  // Convert geographic coordinates to pixel coordinates
  const geoToPixel = (lng: number, lat: number) => {
    // Simple equirectangular projection
    const x = mapWidth / 2 + (lng - centerLng) * mapWidth * scale / 10;
    const y = mapHeight / 2 - (lat - centerLat) * mapHeight * scale / 5; // Flipped Y axis
    return { x, y };
  };
  
  // Apply the current view state transformation to the map container
  const mapStyle = {
    transform: `
      rotate(${viewState.bearing}deg)
      scale(${scale})
      translate(${(viewState.longitude - centerLng) * -100}px, ${(viewState.latitude - centerLat) * 100}px)
    `,
    transformOrigin: 'center center',
  };

  return (
    <div className="absolute inset-0 bg-slate-100 overflow-hidden">
      <div 
        className="relative w-full h-full flex items-center justify-center" 
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute bg-slate-200 w-[1000px] h-[1000px] rounded-full shadow-inner"
          style={mapStyle}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-5 grid-rows-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`col-${i}`} 
                className="border-r border-slate-300 h-full" 
                style={{ left: `${(i + 1) * 20}%` }}
              />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <div 
                key={`row-${i}`} 
                className="border-b border-slate-300 w-full" 
                style={{ top: `${(i + 1) * 20}%` }}
              />
            ))}
          </div>
          
          {/* Center marker for Paris */}
          <div 
            className="absolute w-4 h-4 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: geoToPixel(centerLng, centerLat).x, 
              top: geoToPixel(centerLng, centerLat).y 
            }}
          >
            <div className="text-xs font-bold text-white absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
              Paris
            </div>
          </div>
          
          {/* Startup markers */}
          {startups.map(startup => {
            const { x, y } = geoToPixel(startup.location.longitude, startup.location.latitude);
            const isSelected = selectedStartup?.id === startup.id;
            
            return (
              <div 
                key={startup.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                  isSelected ? 'z-50 scale-110' : 'z-10'
                }`}
                style={{ 
                  left: x, 
                  top: y, 
                  boxShadow: isSelected ? '0 0 0 4px rgba(59, 130, 246, 0.3), 0 2px 10px rgba(0,0,0,0.1)' : '0 2px 10px rgba(0,0,0,0.1)',
                  border: isSelected ? '2px solid rgb(59, 130, 246)' : '2px solid white'
                }}
                onClick={() => onStartupClick(startup)}
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={startup.logo} 
                    alt={`${startup.name} logo`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Map overlay with some text */}
        <div className="absolute bottom-8 left-8 bg-white/90 p-3 rounded-lg text-sm text-slate-600 max-w-xs">
          <p className="font-medium text-slate-900">Placeholder Map</p>
          <p>This is a simple placeholder map. Add a Mapbox token for a full interactive map experience.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderMap;
