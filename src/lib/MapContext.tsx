
import React, { createContext, useState, useContext } from 'react';
import { Startup, MapViewState, MapContextType } from '@/types';
import { startups, DEFAULT_VIEW_STATE } from '@/lib/startups';

// Create the context
const MapContext = createContext<MapContextType | undefined>(undefined);

// Provider component
export const MapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [viewState, setViewState] = useState<MapViewState>(DEFAULT_VIEW_STATE);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>(startups);

  const value = {
    selectedStartup,
    setSelectedStartup,
    viewState,
    setViewState,
    showAddForm,
    setShowAddForm,
    filteredStartups,
    setFilteredStartups
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

// Hook for using the context
export const useMapContext = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMapContext must be used within a MapProvider');
  }
  return context;
};
