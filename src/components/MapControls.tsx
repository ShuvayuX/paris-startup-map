
import React from 'react';
import { useMapContext } from '@/lib/MapContext';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Compass, Home } from 'lucide-react';
import { DEFAULT_VIEW_STATE } from '@/lib/startups';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetBearing: () => void;
  onResetView: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onResetView
}) => {
  const { viewState } = useMapContext();
  
  const isBearingChanged = Math.abs(viewState.bearing) > 0.1;
  
  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col space-y-2 glass p-1 rounded-lg">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg"
        onClick={onZoomIn}
      >
        <ZoomIn className="h-4 w-4" />
        <span className="sr-only">Zoom in</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg"
        onClick={onZoomOut}
      >
        <ZoomOut className="h-4 w-4" />
        <span className="sr-only">Zoom out</span>
      </Button>
      
      <div className="h-px bg-border w-full my-1"></div>
      
      <Button
        variant="ghost"
        size="icon"
        className={`h-8 w-8 rounded-lg ${isBearingChanged ? 'bg-primary/10 text-primary' : ''}`}
        onClick={onResetBearing}
      >
        <Compass className="h-4 w-4" />
        <span className="sr-only">Reset bearing</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-lg"
        onClick={onResetView}
      >
        <Home className="h-4 w-4" />
        <span className="sr-only">Reset view</span>
      </Button>
    </div>
  );
};

export default MapControls;
