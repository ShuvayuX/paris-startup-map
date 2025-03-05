
import React from 'react';
import { Briefcase, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface RolesListProps {
  isHiring?: boolean;
  providesVisa?: boolean;
}

const RolesList: React.FC<RolesListProps> = ({ isHiring = false, providesVisa = false }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-base">Hiring Information</h3>
      
      <div className="space-y-3">
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
              <span className="font-medium">Currently Hiring</span>
            </div>
            <div>
              {isHiring ? (
                <span className="flex items-center text-green-500">
                  <Check className="h-5 w-5 mr-1" />
                  Yes
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <X className="h-5 w-5 mr-1" />
                  No
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="glass p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
              <span className="font-medium">Visa Sponsorship</span>
            </div>
            <div>
              {providesVisa ? (
                <span className="flex items-center text-green-500">
                  <Check className="h-5 w-5 mr-1" />
                  Yes
                </span>
              ) : (
                <span className="flex items-center text-red-500">
                  <X className="h-5 w-5 mr-1" />
                  No
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RolesList;
