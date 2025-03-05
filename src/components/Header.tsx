
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useMapContext } from '@/lib/MapContext';

const Header: React.FC = () => {
  const { setShowAddForm } = useMapContext();

  return (
    <header className="fixed top-0 left-0 right-0 z-10 px-6 py-4 glass">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 rounded-full p-2">
            <svg 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-primary"
            >
              <path 
                d="M12 2C8.13 2 5 5.13 5 9C5 13.17 9.42 18.92 11.24 21.11C11.64 21.59 12.37 21.59 12.77 21.11C14.58 18.92 19 13.17 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                fill="currentColor"
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Paris Startup Map</h1>
        </div>

        <Button 
          onClick={() => setShowAddForm(true)}
          className="hover-lift focus-ring flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add Startup</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
