
import React from 'react';
import { Role } from '@/types';
import { Briefcase, Clock, MapPin, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface RolesListProps {
  roles: Role[];
}

const RolesList: React.FC<RolesListProps> = ({ roles }) => {
  if (roles.length === 0) {
    return (
      <div className="text-center py-6">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50" />
        <p className="mt-2 text-muted-foreground">No open roles at the moment</p>
      </div>
    );
  }

  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base">Open Positions ({roles.length})</h3>
      
      <div className="space-y-3">
        {roles.map((role) => (
          <div 
            key={role.id}
            className="glass p-4 rounded-xl transition-all duration-300 hover:bg-white/90 dark:hover:bg-black/90 hover-lift"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium">{role.title}</h4>
              <Badge variant="outline">{role.department}</Badge>
            </div>
            
            <div className="mt-1 flex items-center text-sm text-muted-foreground">
              <Badge variant="secondary" className="mr-2">
                {role.type}
              </Badge>
              {role.remote ? (
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> Remote
                </span>
              ) : (
                <span className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" /> On-site
                </span>
              )}
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Posted {formatDate(role.postedAt)}
              </span>
            </div>
            
            <p className="mt-2 text-sm line-clamp-2">{role.description}</p>
            
            <div className="mt-3">
              <Button 
                size="sm" 
                className="hover-lift focus-ring"
                onClick={() => window.open(role.applyUrl, "_blank")}
              >
                Apply Now
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RolesList;
