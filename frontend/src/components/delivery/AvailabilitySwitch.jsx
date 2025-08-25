import React from 'react';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { CircleDot, Circle } from 'lucide-react';

const AvailabilitySwitch = ({ availability, onToggle, disabled = false }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {availability ? (
            <CircleDot className="w-6 h-6 text-green-500" />
          ) : (
            <Circle className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900">
            Availability Status
          </h3>
          <p className="text-sm text-gray-600">
            {availability 
              ? 'You are currently available for new delivery assignments'
              : 'You are offline and will not receive new assignments'
            }
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <Badge 
          variant={availability ? "default" : "secondary"}
          className={availability 
            ? "bg-green-100 text-green-800 border-green-200" 
            : "bg-gray-100 text-gray-600 border-gray-200"
          }
        >
          {availability ? 'Online' : 'Offline'}
        </Badge>
        
        <Switch
          checked={availability}
          onCheckedChange={onToggle}
          disabled={disabled}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
    </div>
  );
};

export default AvailabilitySwitch;