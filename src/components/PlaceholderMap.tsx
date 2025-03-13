
import React, { useState, useEffect } from 'react';
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
  const [rotation, setRotation] = useState({ x: 25, y: 0 });
  
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
  
  // Update rotation based on view state
  useEffect(() => {
    setRotation({
      x: 25 + viewState.pitch / 5,
      y: viewState.bearing
    });
  }, [viewState]);
  
  // Apply 3D transformation
  const mapStyle = {
    transform: `
      perspective(1000px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      scale3d(${scale}, ${scale}, ${scale})
      translate3d(${(viewState.longitude - centerLng) * -100}px, ${(viewState.latitude - centerLat) * 100}px, 0)
    `,
    transformOrigin: 'center center',
    transition: 'transform 0.5s ease-out'
  };

  return (
    <div className="absolute inset-0 bg-[#0c0c0c] overflow-hidden">
      <div 
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* 3D Map container */}
        <div className="relative transform-gpu" style={{ perspective: '1200px' }}>
          {/* Map surface */}
          <div 
            className="absolute bg-[#161616] w-[1000px] h-[1000px] rounded-full shadow-xl"
            style={mapStyle}
          >
            {/* 3D Grid lines with depth */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-12">
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={`col-${i}`} 
                  className="border-r border-[#333333]/20 h-full"
                  style={{ 
                    left: `${(i + 1) * (100/12)}%`,
                    boxShadow: '0 0 15px rgba(51, 51, 51, 0.1)'
                  }}
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <div 
                  key={`row-${i}`} 
                  className="border-b border-[#333333]/20 w-full"
                  style={{ 
                    top: `${(i + 1) * (100/12)}%`,
                    boxShadow: '0 0 15px rgba(51, 51, 51, 0.1)'
                  }}
                />
              ))}
            </div>

            {/* 3D Elevation effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#000000]/30 rounded-full"></div>
            
            {/* Center marker for Paris with 3D effect */}
            <div 
              className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: geoToPixel(centerLng, centerLat).x, 
                top: geoToPixel(centerLng, centerLat).y,
                transform: 'translate(-50%, -50%) translateZ(5px)'
              }}
            >
              <div className="w-4 h-4 bg-white/90 rounded-full shadow-glow"></div>
              <div className="mt-2 text-xs font-medium text-white whitespace-nowrap">
                Paris
              </div>
            </div>
            
            {/* 3D Startup markers */}
            {startups.map(startup => {
              const { x, y } = geoToPixel(startup.location.longitude, startup.location.latitude);
              const isSelected = selectedStartup?.id === startup.id;
              const elevationZ = isSelected ? 15 : 8;
              
              return (
                <div 
                  key={startup.id}
                  className={`absolute cursor-pointer transition-all duration-300 ${
                    isSelected ? 'z-50 scale-110' : 'z-10'
                  }`}
                  style={{ 
                    left: x, 
                    top: y, 
                    transform: `translate(-50%, -50%) translateZ(${elevationZ}px)`,
                    boxShadow: isSelected 
                      ? '0 0 20px rgba(255, 255, 255, 0.3), 0 5px 15px rgba(0,0,0,0.5)' 
                      : '0 3px 10px rgba(0,0,0,0.4)',
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
                  {isSelected && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 px-2 py-0.5 rounded text-xs">
                      {startup.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Map overlay with some text */}
        <div className="absolute bottom-8 left-8 bg-[#161616]/90 p-3 rounded-lg text-sm text-gray-400 max-w-xs backdrop-blur-sm">
          <p className="font-medium text-white">3D Map View</p>
          <p>Exploring Paris startups in 3D. Add a Mapbox token for a full interactive map experience.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderMap;
