
import React from 'react';
import { Startup } from '@/types';
import { CSSTransition } from 'react-transition-group';
import { X, Globe, Users, Calendar, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import RolesList from './RolesList';
import { useMapContext } from '@/lib/MapContext';

interface StartupCardProps {
  startup: Startup | null;
  isVisible: boolean;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup, isVisible }) => {
  const { setSelectedStartup } = useMapContext();
  const nodeRef = React.useRef(null);

  if (!startup) return null;

  return (
    <CSSTransition
      in={isVisible}
      timeout={300}
      classNames={{
        enter: "startup-card-enter",
        enterActive: "startup-card-enter-active",
        exit: "startup-card-exit",
        exitActive: "startup-card-exit-active"
      }}
      unmountOnExit
      nodeRef={nodeRef}
    >
      <div 
        ref={nodeRef}
        className="fixed bottom-6 right-6 w-full max-w-md glass rounded-xl shadow-glass z-20 overflow-hidden"
      >
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-background/50 hover:bg-background/70 z-10"
            onClick={() => setSelectedStartup(null)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>

          <div className="p-6">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden mr-4 flex-shrink-0">
                <img 
                  src={startup.logo} 
                  alt={`${startup.name} logo`} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold">{startup.name}</h2>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>{startup.location.address}</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-sm">{startup.description}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {startup.industry.map((ind) => (
                <span 
                  key={ind}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium"
                >
                  {ind}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <Globe className="h-5 w-5 mx-auto text-muted-foreground" />
                <a 
                  href={startup.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-1 text-sm text-primary block hover:underline"
                >
                  Website
                </a>
              </div>
              <div className="text-center">
                <Users className="h-5 w-5 mx-auto text-muted-foreground" />
                <span className="mt-1 text-sm block">{startup.size}</span>
              </div>
              <div className="text-center">
                <Calendar className="h-5 w-5 mx-auto text-muted-foreground" />
                <span className="mt-1 text-sm block">Since {startup.founded}</span>
              </div>
            </div>

            <Separator className="my-6" />

            <RolesList roles={startup.roles} />
          </div>
        </div>
      </div>
    </CSSTransition>
  );
};

export default StartupCard;
