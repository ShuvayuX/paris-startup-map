
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface MapboxTokenInputProps {
  onTokenSaved: (token: string) => void;
}

const MapboxTokenInput: React.FC<MapboxTokenInputProps> = ({ onTokenSaved }) => {
  const [token, setToken] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if token exists in localStorage
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      onTokenSaved(savedToken);
    } else {
      setOpen(true);
    }
  }, [onTokenSaved]);

  const handleSaveToken = () => {
    if (token.trim().length < 20) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid Mapbox token",
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('mapbox-token', token);
    onTokenSaved(token);
    setOpen(false);
    toast({
      title: "Token Saved",
      description: "Your Mapbox token has been saved"
    });
  };

  const handleClearToken = () => {
    localStorage.removeItem('mapbox-token');
    setToken('');
    setOpen(true);
    toast({
      title: "Token Removed",
      description: "Your Mapbox token has been removed"
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enter your Mapbox token</DialogTitle>
            <DialogDescription>
              You need a Mapbox token to display the map. You can get one for free at{" "}
              <a 
                href="https://mapbox.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                mapbox.com
              </a>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Enter your Mapbox token here"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">
              Your token will be stored in your browser's local storage.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveToken}>Save Token</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!open && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setOpen(true)}
          className="absolute bottom-4 left-4 z-10 text-xs"
        >
          Change Mapbox Token
        </Button>
      )}

      {!open && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleClearToken}
          className="absolute bottom-4 left-40 z-10 text-xs"
        >
          Clear Token
        </Button>
      )}
    </>
  );
};

export default MapboxTokenInput;
