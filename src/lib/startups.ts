
import { Startup } from '@/types';

// Sample data for Paris startups
export const startups: Startup[] = [
  {
    id: '1',
    name: 'TechParis',
    logo: 'https://via.placeholder.com/150?text=TP',
    description: 'A leading AI research company focused on natural language processing',
    location: {
      longitude: 2.3522,
      latitude: 48.8566,
      address: '12 Rue de Rivoli, 75001 Paris'
    },
    website: 'https://techparis.example.com',
    industry: ['AI', 'Research', 'Software'],
    size: '50-100',
    founded: 2018,
    roles: [
      {
        id: '101',
        title: 'Senior Machine Learning Engineer',
        department: 'Engineering',
        type: 'Full-time',
        remote: true,
        description: 'We are looking for an experienced ML engineer to join our team working on cutting-edge NLP models.',
        applyUrl: 'https://example.com/apply',
        postedAt: '2023-11-15T12:00:00Z'
      },
      {
        id: '102',
        title: 'Product Manager',
        department: 'Product',
        type: 'Full-time',
        remote: false,
        description: 'Lead our product strategy and roadmap for AI-powered solutions.',
        applyUrl: 'https://example.com/apply',
        postedAt: '2023-12-01T09:30:00Z'
      }
    ]
  },
  {
    id: '2',
    name: 'Finnovate',
    logo: 'https://via.placeholder.com/150?text=FIN',
    description: 'Revolutionizing financial technology with blockchain solutions',
    location: {
      longitude: 2.3388,
      latitude: 48.8698,
      address: '35 Boulevard Haussmann, 75009 Paris'
    },
    website: 'https://finnovate.example.com',
    industry: ['Fintech', 'Blockchain', 'Finance'],
    size: '100-250',
    founded: 2016,
    roles: [
      {
        id: '201',
        title: 'Blockchain Developer',
        department: 'Engineering',
        type: 'Full-time',
        remote: false,
        description: 'Develop and implement robust blockchain solutions for financial services.',
        applyUrl: 'https://example.com/apply',
        postedAt: '2023-11-28T14:15:00Z'
      }
    ]
  },
  {
    id: '3',
    name: 'GreenMobility',
    logo: 'https://via.placeholder.com/150?text=GM',
    description: 'Creating sustainable transportation solutions for urban areas',
    location: {
      longitude: 2.3648,
      latitude: 48.8322,
      address: '88 Avenue Denfert-Rochereau, 75014 Paris'
    },
    website: 'https://greenmobility.example.com',
    industry: ['Mobility', 'Sustainability', 'Hardware'],
    size: '25-50',
    founded: 2020,
    roles: [
      {
        id: '301',
        title: 'Hardware Engineer',
        department: 'Engineering',
        type: 'Full-time',
        remote: false,
        description: 'Design and develop electric mobility components for our next-gen vehicles.',
        applyUrl: 'https://example.com/apply',
        postedAt: '2023-12-05T10:00:00Z'
      },
      {
        id: '302',
        title: 'Operations Manager',
        department: 'Operations',
        type: 'Full-time',
        remote: false,
        description: 'Oversee the operations of our Paris-based mobility service.',
        applyUrl: 'https://example.com/apply',
        postedAt: '2023-11-20T16:45:00Z'
      },
      {
        id: '303',
        title: 'Marketing Specialist',
        department: 'Marketing',
        type: 'Part-time',
        remote: true,
        description: 'Support our marketing team with sustainable mobility campaigns.',
        applyUrl: 'https://example.com/apply',
        postedAt: '2023-12-10T09:15:00Z'
      }
    ]
  },
  {
    id: '4',
    name: 'HealthTech Solutions',
    logo: 'https://via.placeholder.com/150?text=HTS',
    description: 'Developing innovative healthcare technologies to improve patient outcomes',
    location: {
      longitude: 2.3091,
      latitude: 48.8738,
      address: '24 Rue du Faubourg Saint-Honoré, 75008 Paris'
    },
    website: 'https://healthtechsolutions.example.com',
    industry: ['Healthcare', 'Biotech', 'AI'],
    size: '50-100',
    founded: 2017,
    roles: [
      {
        id: '401',
        title: 'Frontend Developer',
        department: 'Engineering',
        type: 'Full-time',
        remote: true,
        description: 'Build beautiful and intuitive user interfaces for our healthcare applications.',
        applyUrl: 'https://example.com/apply',
        postedAt: '2023-12-07T11:30:00Z'
      }
    ]
  },
  {
    id: '5',
    name: 'DataVision',
    logo: 'https://via.placeholder.com/150?text=DV',
    description: 'Transforming data analytics with AI-powered visualization tools',
    location: {
      longitude: 2.3750,
      latitude: 48.8450,
      address: '130 Avenue de France, 75013 Paris'
    },
    website: 'https://datavision.example.com',
    industry: ['Data', 'Analytics', 'SaaS'],
    size: '10-25',
    founded: 2021,
    roles: []
  }
];

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
    
    // Filter by open roles
    const matchesOpenRoles = !hasOpenRoles || startup.roles.length > 0;
    
    return matchesQuery && matchesIndustries && matchesOpenRoles;
  });
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
