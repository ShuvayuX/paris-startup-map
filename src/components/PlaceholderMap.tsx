
import React, { useState, useEffect } from 'react';
import { Startup, MapViewState } from '@/types';
import { useTheme } from 'next-themes';
import { Cube, Building2, Mountain } from 'lucide-react';

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
  const [rotation, setRotation] = useState({ x: 35, y: 0 });
  
  // Calculate map dimensions
  const mapWidth = 1000;
  const mapHeight = 1000;
  
  // Paris coordinates from the DEFAULT_VIEW_STATE
  const centerLng = 2.3522;
  const centerLat = 48.8566;
  
  // Scale factor based on zoom
  const scale = Math.pow(2, viewState.zoom - 9.5);
  
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
      x: 35 + viewState.pitch / 3,
      y: viewState.bearing
    });
  }, [viewState]);
  
  // Apply 3D transformation
  const mapStyle = {
    transform: `
      perspective(1500px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      scale3d(${scale}, ${scale}, ${scale})
      translate3d(${(viewState.longitude - centerLng) * -100}px, ${(viewState.latitude - centerLat) * 100}px, 0)
    `,
    transformOrigin: 'center center',
    transition: 'transform 0.5s ease-out'
  };

  return (
    <div className="absolute inset-0 bg-[#050505] overflow-hidden">
      <div 
        className="relative w-full h-full flex items-center justify-center"
        style={{ perspective: '2000px' }}
      >
        {/* Ambient light and atmospheric effects */}
        <div className="absolute inset-0 bg-gradient-radial from-[#1a1a2e]/30 to-transparent opacity-40"></div>
        
        {/* 3D Map container with increased perspective */}
        <div className="relative transform-gpu" style={{ perspective: '2000px' }}>
          {/* Map base with deeper shadow for depth */}
          <div 
            className="absolute bg-[#101015] w-[1200px] h-[1200px] rounded-full shadow-2xl opacity-30"
            style={{
              ...mapStyle,
              transform: `${mapStyle.transform} translateZ(-40px) scale(1.2)`,
              filter: 'blur(20px)'
            }}
          ></div>

          {/* Map surface with enhanced depth */}
          <div 
            className="absolute bg-[#101015] w-[1000px] h-[1000px] rounded-full shadow-xl"
            style={mapStyle}
          >
            {/* 3D Grid lines with enhanced depth */}
            <div className="absolute inset-0 grid grid-cols-16 grid-rows-16">
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={`col-${i}`} 
                  className="border-r border-[#3f3f6f]/10 h-full"
                  style={{ 
                    left: `${(i + 1) * (100/16)}%`,
                    boxShadow: '0 0 20px rgba(51, 51, 81, 0.05)',
                    transform: `translateZ(${Math.sin(i * 0.4) * 3}px)`
                  }}
                />
              ))}
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={`row-${i}`} 
                  className="border-b border-[#3f3f6f]/10 w-full"
                  style={{ 
                    top: `${(i + 1) * (100/16)}%`,
                    boxShadow: '0 0 20px rgba(51, 51, 81, 0.05)',
                    transform: `translateZ(${Math.sin(i * 0.4) * 3}px)`
                  }}
                />
              ))}
            </div>

            {/* 3D Terrain features */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * Math.PI * 2;
              const distance = 350 + Math.random() * 50;
              const x = Math.cos(angle) * distance + mapWidth / 2;
              const y = Math.sin(angle) * distance + mapHeight / 2;
              const height = 10 + Math.random() * 15;
              
              return (
                <div 
                  key={`terrain-${i}`}
                  className="absolute"
                  style={{
                    left: x,
                    top: y,
                    transform: `translate(-50%, -50%) translateZ(${height}px)`,
                    opacity: 0.4
                  }}
                >
                  {i % 3 === 0 ? (
                    <Mountain className="w-6 h-6 text-[#4a5568]/30" />
                  ) : i % 3 === 1 ? (
                    <Building2 className="w-5 h-5 text-[#4a5568]/30" />
                  ) : (
                    <Cube className="w-4 h-4 text-[#4a5568]/30" />
                  )}
                </div>
              );
            })}

            {/* Enhanced 3D Elevation effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent to-[#000000]/40 rounded-full"></div>
            
            {/* Center marker for Paris with enhanced 3D effect */}
            <div 
              className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: geoToPixel(centerLng, centerLat).x, 
                top: geoToPixel(centerLng, centerLat).y,
                transform: 'translate(-50%, -50%) translateZ(15px)'
              }}
            >
              <div className="w-6 h-6 bg-white/90 rounded-full shadow-glow animate-pulse-gentle"></div>
              <div className="mt-3 px-2 py-1 bg-black/50 rounded-md text-xs font-medium text-white whitespace-nowrap backdrop-blur-sm">
                Paris
              </div>
            </div>
            
            {/* Enhanced 3D Startup markers */}
            {startups.map(startup => {
              const { x, y } = geoToPixel(startup.location.longitude, startup.location.latitude);
              const isSelected = selectedStartup?.id === startup.id;
              const elevationZ = isSelected ? 25 : 15;
              
              return (
                <div 
                  key={startup.id}
                  className={`absolute cursor-pointer transition-all duration-500 ${
                    isSelected ? 'z-50 scale-110' : 'z-10'
                  }`}
                  style={{ 
                    left: x, 
                    top: y, 
                    transform: `translate(-50%, -50%) translateZ(${elevationZ}px) ${isSelected ? 'rotateX(-5deg)' : ''}`,
                    boxShadow: isSelected 
                      ? '0 10px 25px rgba(0, 0, 0, 0.5), 0 0 25px rgba(255, 255, 255, 0.2)' 
                      : '0 5px 15px rgba(0, 0, 0, 0.4)',
                    border: isSelected ? '2px solid rgba(255, 255, 255, 0.9)' : '2px solid rgba(255, 255, 255, 0.5)'
                  }}
                  onClick={() => onStartupClick(startup)}
                >
                  {/* Shadow for 3D effect */}
                  <div 
                    className="absolute rounded-lg bg-black/40 w-10 h-10 blur-sm"
                    style={{ 
                      transform: 'translateZ(-5px) translateY(5px) scale(0.9)',
                      opacity: isSelected ? 0.6 : 0.3
                    }}
                  ></div>
                  
                  <div className="w-10 h-10 bg-[#222222] rounded-lg flex items-center justify-center overflow-hidden">
                    <img 
                      src={startup.logo} 
                      alt={`${startup.name} logo`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {isSelected && (
                    <div 
                      className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/70 px-3 py-1 rounded text-xs backdrop-blur-sm"
                      style={{ transform: 'translateZ(5px)' }}
                    >
                      {startup.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Map overlay with enhanced glass effect */}
        <div className="absolute bottom-8 left-8 bg-black/50 backdrop-blur-md p-4 rounded-lg text-sm text-gray-300 max-w-xs border border-white/10">
          <p className="font-medium text-white mb-1">3D Paris Startup Map</p>
          <p>Exploring the Paris startup ecosystem in immersive 3D. Navigate with the controls to explore.</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderMap;
