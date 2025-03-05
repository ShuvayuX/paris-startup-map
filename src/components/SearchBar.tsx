
import React, { useState, useEffect } from 'react';
import { Search, X, Filter, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { getAllIndustries, filterStartups } from '@/lib/startups';
import { useMapContext } from '@/lib/MapContext';
import { SearchFilters } from '@/types';

const SearchBar: React.FC = () => {
  const { setFilteredStartups } = useMapContext();
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    industry: [],
    hasOpenRoles: false
  });
  const [industries] = useState<string[]>(getAllIndustries());
  const [showClearButton, setShowClearButton] = useState(false);

  // Apply filters effect
  useEffect(() => {
    const filtered = filterStartups(
      filters.query,
      filters.industry,
      filters.hasOpenRoles
    );
    setFilteredStartups(filtered);
    
    // Show clear button if any filters are active
    setShowClearButton(
      filters.query !== '' || 
      filters.industry.length > 0 || 
      filters.hasOpenRoles
    );
  }, [filters, setFilteredStartups]);

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      query: '',
      industry: [],
      hasOpenRoles: false
    });
  };

  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setFilters(prev => {
      if (prev.industry.includes(industry)) {
        return {
          ...prev,
          industry: prev.industry.filter(i => i !== industry)
        };
      } else {
        return {
          ...prev,
          industry: [...prev.industry, industry]
        };
      }
    });
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto animate-slide-down">
      <div className="glass rounded-full flex items-center px-4 h-12">
        <Search className="h-5 w-5 text-muted-foreground mr-2 flex-shrink-0" />
        <Input
          type="text"
          placeholder="Search startups by name or description..."
          className="flex-1 h-full border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
          value={filters.query}
          onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        />
        
        {showClearButton && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground mr-1"
            onClick={clearFilters}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 rounded-full ${filters.industry.length > 0 || filters.hasOpenRoles ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filter</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h3 className="font-medium text-sm">Filter startups</h3>
              
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground">Industries</h4>
                <div className="flex flex-wrap gap-2">
                  {industries.map(industry => (
                    <Badge
                      key={industry}
                      variant={filters.industry.includes(industry) ? "default" : "outline"}
                      className="cursor-pointer hover-lift"
                      onClick={() => toggleIndustry(industry)}
                    >
                      {filters.industry.includes(industry) && (
                        <Check className="mr-1 h-3 w-3" />
                      )}
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-roles"
                  checked={filters.hasOpenRoles}
                  onCheckedChange={(checked) => 
                    setFilters({ ...filters, hasOpenRoles: checked === true })
                  }
                />
                <Label htmlFor="has-roles">Show only startups with open roles</Label>
              </div>
              
              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Reset filters
                </Button>
                {(filters.industry.length > 0 || filters.hasOpenRoles) && (
                  <span className="text-xs text-muted-foreground">
                    {filters.industry.length} industries selected
                  </span>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Active filter pills */}
      {showClearButton && (
        <div className="flex flex-wrap gap-2 mt-2">
          {filters.industry.map(industry => (
            <Badge 
              key={industry}
              variant="secondary"
              className="hover-lift"
            >
              {industry}
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 rounded-full text-muted-foreground"
                onClick={() => toggleIndustry(industry)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {industry} filter</span>
              </Button>
            </Badge>
          ))}
          
          {filters.hasOpenRoles && (
            <Badge 
              variant="secondary"
              className="hover-lift"
            >
              Has open roles
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1 rounded-full text-muted-foreground"
                onClick={() => setFilters({ ...filters, hasOpenRoles: false })}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove open roles filter</span>
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
