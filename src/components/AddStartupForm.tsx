
import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Startup } from '@/types';
import { useMapContext } from '@/lib/MapContext';
import { useToast } from "@/components/ui/use-toast";
import mapboxgl from 'mapbox-gl';
import { addStartup } from '@/lib/startups';

// Temporary solution - in a real app, this would be an environment variable
mapboxgl.accessToken = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xybXBrbGp5MDUxbzJqbzJwamx1MnJmaSJ9.Ax0ESw7qy-RcnNE0LQUI5g';

interface IndustryOption {
  name: string;
  selected: boolean;
}

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
  
  const [location, setLocation] = useState({
    address: '',
    latitude: 48.8566,
    longitude: 2.3522
  });
  const [locationMapRef, setLocationMapRef] = useState<HTMLDivElement | null>(null);
  const [locationMap, setLocationMap] = useState<mapboxgl.Map | null>(null);
  const [locationMarker, setLocationMarker] = useState<mapboxgl.Marker | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    size: '',
    founded: new Date().getFullYear().toString(),
    isHiring: false,
    providesVisa: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const toggleIndustry = (index: number) => {
    setIndustries(prev => 
      prev.map((ind, i) => 
        i === index ? { ...ind, selected: !ind.selected } : ind
      )
    );
  };

  const addIndustry = () => {
    if (!newIndustry.trim()) return;
    
    setIndustries(prev => [
      ...prev,
      { name: newIndustry.trim(), selected: true }
    ]);
    setNewIndustry('');
  };

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

      reverseGeocode(lngLat.lng, lngLat.lat);
    });

    setLocationMap(map);
    setLocationMarker(marker);

    return () => {
      map.remove();
    };
  }, [locationMapRef, showAddForm]);

  const reverseGeocode = async (lng: number, lat: number) => {
    setTimeout(() => {
      setLocation(prev => ({
        ...prev,
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`
      }));
    }, 500);
  };

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
      isHiring: formData.isHiring,
      providesVisa: formData.providesVisa,
      roles: [], // Empty array for backward compatibility
      logo: logoPreview || `https://via.placeholder.com/150?text=${formData.name.substring(0, 2).toUpperCase()}`
    };
    
    addStartup(newStartup);
    
    // Update the filtered startups
    setFilteredStartups([...filteredStartups, newStartup]);
    
    toast({
      title: "Startup Added",
      description: "Your startup has been successfully added to the map.",
    });
    
    resetForm();
    setShowAddForm(false);
  };

  const resetForm = () => {
    setLogoPreview(null);
    setFormData({
      name: '',
      description: '',
      website: '',
      size: '',
      founded: new Date().getFullYear().toString(),
      isHiring: false,
      providesVisa: false
    });
    setLocation({
      address: '',
      latitude: 48.8566,
      longitude: 2.3522
    });
    setIndustries(industries.map(ind => ({ ...ind, selected: false })));
  };

  return (
    <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Add Your Startup to the Map</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div className="space-y-4">
                <Label>Hiring Information</Label>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="isHiring" 
                      checked={formData.isHiring}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, isHiring: checked === true }))
                      }
                    />
                    <Label 
                      htmlFor="isHiring" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Currently hiring
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="providesVisa" 
                      checked={formData.providesVisa}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, providesVisa: checked === true }))
                      }
                    />
                    <Label 
                      htmlFor="providesVisa" 
                      className="text-sm font-normal cursor-pointer"
                    >
                      Provides visa sponsorship
                    </Label>
                  </div>
                </div>
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
  );
};

export default AddStartupForm;
