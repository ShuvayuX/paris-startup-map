
import React, { useEffect } from 'react';
import { MapProvider } from '@/lib/MapContext';
import Map from '@/components/Map';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import StartupCard from '@/components/StartupCard';
import AddStartupForm from '@/components/AddStartupForm';
import { useMapContext } from '@/lib/MapContext';

const MapContent = () => {
  const { selectedStartup } = useMapContext();

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Header />
      
      <div className="absolute top-24 left-0 right-0 z-10 px-6">
        <SearchBar />
      </div>
      
      <Map />
      
      <StartupCard 
        startup={selectedStartup}
        isVisible={!!selectedStartup}
      />
      
      <AddStartupForm />
    </div>
  );
};

const Index = () => {
  return (
    <MapProvider>
      <MapContent />
    </MapProvider>
  );
};

export default Index;
