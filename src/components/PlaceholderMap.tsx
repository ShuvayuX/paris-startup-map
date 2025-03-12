
import React from 'react';
import { Startup, MapViewState } from '@/types';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme();
  const isDarkTheme = theme === 'dark';
  
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
    <div className="absolute inset-0 bg-[#0c0c0c] overflow-hidden">
      <div 
        className="relative w-full h-full flex items-center justify-center" 
        style={{ perspective: '1000px' }}
      >
        <div 
          className="absolute bg-[#161616] w-[1000px] h-[1000px] rounded-full shadow-inner"
          style={mapStyle}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={`col-${i}`} 
                className="border-r border-[#333333]/20 h-full"
                style={{ left: `${(i + 1) * (100/12)}%` }}
              />
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div 
                key={`row-${i}`} 
                className="border-b border-[#333333]/20 w-full"
                style={{ top: `${(i + 1) * (100/12)}%` }}
              />
            ))}
          </div>
          
          {/* Center marker for Paris */}
          <div 
            className="absolute w-4 h-4 bg-white/90 rounded-full -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: geoToPixel(centerLng, centerLat).x, 
              top: geoToPixel(centerLng, centerLat).y 
            }}
          >
            <div className="text-xs font-medium text-white absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
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
                  boxShadow: isSelected ? '0 0 0 4px rgba(255, 255, 255, 0.3), 0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.3)',
                  border: isSelected ? '2px solid rgba(255, 255, 255, 0.9)' : '2px solid rgba(255, 255, 255, 0.5)'
                }}
                onClick={() => onStartupClick(startup)}
              >
                <div className="w-10 h-10 bg-[#222222] rounded-lg flex items-center justify-center overflow-hidden">
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
        <div className="absolute bottom-8 left-8 bg-[#161616]/90 p-3 rounded-lg text-sm text-gray-400 max-w-xs">
          <p className="font-medium text-white">Placeholder Map</p>
          <p>This is a simple placeholder map. Add a Mapbox token for a full interactive map experience.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderMap;
