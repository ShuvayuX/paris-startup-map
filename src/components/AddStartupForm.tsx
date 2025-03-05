
import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Startup, Role } from '@/types';
import { useMapContext } from '@/lib/MapContext';
import { useToast } from "@/components/ui/use-toast";
import mapboxgl from 'mapbox-gl';

// Temporary solution - in a real app, this would be an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xybXBrbGp5MDUxbzJqbzJwamx1MnJmaSJ9.Ax0ESw7qy-RcnNE0LQUI5g';

interface IndustryOption {
  name: string;
  selected: boolean;
}

const INITIAL_ROLE: Role = {
  id: '',
  title: '',
  department: '',
  type: 'Full-time',
  remote: false,
  description: '',
  applyUrl: '',
  postedAt: ''
};

const AddStartupForm: React.FC = () => {
  const { showAddForm, setShowAddForm, filteredStartups, setFilteredStartups } = useMapContext();
  const { toast } = useToast();

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newIndustry, setNewIndustry] = useState('');
  const [industries, setIndustries] = useState<IndustryOption[]>([
    { name: 'AI', selected: false },
    { name: 'Fintech', selected: false },
    { name: 'Biotech', selected: false },
    { name: 'Mobility', selected: false },
    { name: 'SaaS', selected: false },
    { name: 'Hardware', selected: false },
    { name: 'E-commerce', selected: false },
  ]);

  const [roles, setRoles] = useState<Role[]>([]);
  const [currentRole, setCurrentRole] = useState<Role | null>(null);
  const [editingRoleIndex, setEditingRoleIndex] = useState<number | null>(null);
  const [showRoleForm, setShowRoleForm] = useState(false);
  
  // Startup location
  const [location, setLocation] = useState({
    address: '',
    latitude: 48.8566,
    longitude: 2.3522
  });
  const [locationMapRef, setLocationMapRef] = useState<HTMLDivElement | null>(null);
  const [locationMap, setLocationMap] = useState<mapboxgl.Map | null>(null);
  const [locationMarker, setLocationMarker] = useState<mapboxgl.Marker | null>(null);

  // Basic form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    size: '',
    founded: new Date().getFullYear().toString()
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle role form input changes
  const handleRoleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!currentRole) return;
    
    const { name, value } = e.target;
    setCurrentRole(prev => prev ? { ...prev, [name]: value } : null);
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload the file to a server
    // Here we're just using a local preview
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Toggle industry selection
  const toggleIndustry = (index: number) => {
    setIndustries(prev => 
      prev.map((ind, i) => 
        i === index ? { ...ind, selected: !ind.selected } : ind
      )
    );
  };

  // Add new industry
  const addIndustry = () => {
    if (!newIndustry.trim()) return;
    
    setIndustries(prev => [
      ...prev,
      { name: newIndustry.trim(), selected: true }
    ]);
    setNewIndustry('');
  };

  // Initialize location map
  useEffect(() => {
    if (!locationMapRef || !showAddForm) return;

    const map = new mapboxgl.Map({
      container: locationMapRef,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [location.longitude, location.latitude],
      zoom: 12
    });

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat([location.longitude, location.latitude])
      .addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      setLocation(prev => ({
        ...prev,
        latitude: lngLat.lat,
        longitude: lngLat.lng
      }));

      // In a real app, you would use geocoding to get the address from coordinates
      reverseGeocode(lngLat.lng, lngLat.lat);
    });

    setLocationMap(map);
    setLocationMarker(marker);

    return () => {
      map.remove();
    };
  }, [locationMapRef, showAddForm]);

  // Simulate reverse geocoding - in a real app you would use Mapbox's geocoding API
  const reverseGeocode = async (lng: number, lat: number) => {
    // This is a mock implementation
    setTimeout(() => {
      setLocation(prev => ({
        ...prev,
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      }));
    }, 500);
  };

  // Add or update role
  const addOrUpdateRole = () => {
    if (!currentRole || !currentRole.title || !currentRole.department) return;
    
    const now = new Date().toISOString();
    const updatedRole = { 
      ...currentRole,
      id: currentRole.id || `role-${Date.now()}`,
      postedAt: currentRole.postedAt || now
    };

    if (editingRoleIndex !== null) {
      // Update existing role
      setRoles(prev => 
        prev.map((role, index) => 
          index === editingRoleIndex ? updatedRole : role
        )
      );
    } else {
      // Add new role
      setRoles(prev => [...prev, updatedRole]);
    }
    
    setCurrentRole(null);
    setEditingRoleIndex(null);
    setShowRoleForm(false);
  };

  // Edit role
  const editRole = (index: number) => {
    setCurrentRole(roles[index]);
    setEditingRoleIndex(index);
    setShowRoleForm(true);
  };

  // Remove role
  const removeRole = (index: number) => {
    setRoles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedIndustries = industries
      .filter(ind => ind.selected)
      .map(ind => ind.name);
    
    const newStartup: Startup = {
      id: `startup-${Date.now()}`,
      name: formData.name,
      description: formData.description,
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address
      },
      website: formData.website,
      industry: selectedIndustries,
      size: formData.size,
      founded: parseInt(formData.founded),
      roles: roles,
      logo: logoPreview || `https://via.placeholder.com/150?text=${formData.name.substring(0, 2).toUpperCase()}`
    };
    
    // In a real app, this would be sent to a server
    // Here we're just adding it to the local array
    setFilteredStartups(prev => [...prev, newStartup]);
    
    toast({
      title: "Startup Added",
      description: "Your startup has been successfully added to the map.",
    });
    
    resetForm();
    setShowAddForm(false);
  };

  // Reset form
  const resetForm = () => {
    setLogoPreview(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      size: '',
      founded: new Date().getFullYear().toString()
    });
    setLocation({
      address: '',
      latitude: 48.8566,
      longitude: 2.3522
    });
    setIndustries(industries.map(ind => ({ ...ind, selected: false })));
    setRoles([]);
  };

  return (
    <>
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Your Startup to the Map</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Basic info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="logo" className="block mb-2">Company Logo</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Input
                        id="logo"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logo')?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website *</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    required
                    placeholder="https://"
                    value={formData.website}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    required
                    rows={3}
                    placeholder="Brief description of your startup..."
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="size">Company Size</Label>
                    <Input
                      id="size"
                      name="size"
                      placeholder="e.g., 1-10, 11-50"
                      value={formData.size}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="founded">Founded Year</Label>
                    <Input
                      id="founded"
                      name="founded"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.founded}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Industries *</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {industries.map((industry, index) => (
                      <Badge
                        key={industry.name}
                        variant={industry.selected ? "default" : "outline"}
                        className="cursor-pointer hover:bg-accent transition-colors"
                        onClick={() => toggleIndustry(index)}
                      >
                        {industry.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom industry"
                      value={newIndustry}
                      onChange={(e) => setNewIndustry(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIndustry())}
                    />
                    <Button type="button" onClick={addIndustry} disabled={!newIndustry.trim()}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right column - Location and roles */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address in Paris *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      value={location.address}
                      onChange={(e) => setLocation({ ...location, address: e.target.value })}
                      placeholder="Enter your Paris address"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      className="flex-shrink-0"
                      onClick={() => {
                        if (locationMarker && locationMap) {
                          locationMarker.setLngLat([location.longitude, location.latitude]);
                          locationMap.flyTo({
                            center: [location.longitude, location.latitude],
                            zoom: 14
                          });
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Locate
                    </Button>
                  </div>
                </div>
                
                <div 
                  ref={setLocationMapRef}
                  className="w-full h-[200px] rounded-lg overflow-hidden border"
                />
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label>Open Positions</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentRole({ ...INITIAL_ROLE });
                        setEditingRoleIndex(null);
                        setShowRoleForm(true);
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Role
                    </Button>
                  </div>
                  
                  {roles.length === 0 ? (
                    <div className="text-center py-4 bg-muted/30 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        No open roles added yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                      {roles.map((role, index) => (
                        <div 
                          key={role.id || index}
                          className="bg-background border rounded-lg p-3 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium text-sm">{role.title}</h4>
                            <p className="text-xs text-muted-foreground">{role.department}</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => editRole(index)}
                            >
                              <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" 
                                height="16" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="currentColor" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-pencil"
                              >
                                <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                <path d="m15 5 4 4"/>
                              </svg>
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 rounded-full"
                              onClick={() => removeRole(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <Button type="submit">
                Add Startup to Map
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Role Form Dialog */}
      <Dialog open={showRoleForm} onOpenChange={setShowRoleForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRoleIndex !== null ? 'Edit Role' : 'Add New Role'}
            </DialogTitle>
          </DialogHeader>
          
          {currentRole && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  required
                  value={currentRole.title}
                  onChange={handleRoleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    name="department"
                    required
                    value={currentRole.department}
                    onChange={handleRoleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Employment Type *</Label>
                  <select
                    id="type"
                    name="type"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={currentRole.type}
                    onChange={(e) => setCurrentRole({ ...currentRole, type: e.target.value as any })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remote"
                  checked={currentRole.remote}
                  onChange={(e) => setCurrentRole({ ...currentRole, remote: e.target.checked })}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="remote" className="text-sm font-normal">Remote position</Label>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  rows={3}
                  value={currentRole.description}
                  onChange={handleRoleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="applyUrl">Application URL *</Label>
                <Input
                  id="applyUrl"
                  name="applyUrl"
                  type="url"
                  required
                  placeholder="https://"
                  value={currentRole.applyUrl}
                  onChange={handleRoleInputChange}
                />
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setCurrentRole(null);
                    setEditingRoleIndex(null);
                    setShowRoleForm(false);
                  }}
                >
                  Cancel
                </Button>
                <Button type="button" onClick={addOrUpdateRole}>
                  {editingRoleIndex !== null ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddStartupForm;
