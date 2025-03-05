
import { Startup } from '@/types';

// Empty array for startups - users will add their own
export const startups: Startup[] = [];

// Helper function to get all industries from startups
export const getAllIndustries = (): string[] => {
  const industriesSet = new Set<string>();
  
  startups.forEach(startup => {
    startup.industry.forEach(ind => industriesSet.add(ind));
  });
  
  return Array.from(industriesSet).sort();
};

// Function to filter startups based on search query and filters
export const filterStartups = (
  query: string = '', 
  industries: string[] = [], 
  hasOpenRoles: boolean = false
): Startup[] => {
  return startups.filter(startup => {
    // Filter by search query
    const matchesQuery = query === '' || 
      startup.name.toLowerCase().includes(query.toLowerCase()) ||
      startup.description.toLowerCase().includes(query.toLowerCase());
    
    // Filter by industries
    const matchesIndustries = industries.length === 0 || 
      startup.industry.some(ind => industries.includes(ind));
    
    // Filter by hiring status
    const matchesOpenRoles = !hasOpenRoles || startup.isHiring;
    
    return matchesQuery && matchesIndustries && matchesOpenRoles;
  });
};

// Function to add a new startup
export const addStartup = (startup: Startup): void => {
  startups.push(startup);
};

// Default map view state centered on Paris
export const DEFAULT_VIEW_STATE: MapViewState = {
  longitude: 2.3522,
  latitude: 48.8566,
  zoom: 12,
  pitch: 0,
  bearing: 0
};

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}
