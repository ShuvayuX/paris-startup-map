
export interface Startup {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: {
    longitude: number;
    latitude: number;
    address: string;
  };
  website: string;
  industry: string[];
  size: string;
  founded: number;
  isHiring: boolean;
  providesVisa: boolean;
  roles: Role[]; // Keep for backward compatibility
}

export interface Role {
  id: string;
  title: string;
  department: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  remote: boolean;
  description: string;
  applyUrl: string;
  postedAt: string;
}

export interface MapViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface MapContextType {
  selectedStartup: Startup | null;
  setSelectedStartup: (startup: Startup | null) => void;
  viewState: MapViewState;
  setViewState: (viewState: MapViewState) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
  filteredStartups: Startup[];
  setFilteredStartups: (startups: Startup[]) => void;
}

export interface SearchFilters {
  query: string;
  industry: string[];
  hasOpenRoles: boolean;
}
