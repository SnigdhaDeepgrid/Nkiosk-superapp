import React from 'react';
import { MapPin, Clock, DollarSign, Package, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const AssignmentCard = ({ assignment, onAccept, disabled = false }) => {
  const {
    id,
    storeType,
    storeName,
    customerName,
    items,
    distance,
    estimatedTime,
    payout,
    pickupAddress,
    deliveryAddress,
    urgency = 'normal',
    timestamp
  } = assignment;

  const urgencyColors = {
    high: 'bg-red-100 text-red-800',
    normal: 'bg-blue-100 text-blue-800',
    low: 'bg-gray-100 text-gray-800'
  };

  const storeTypeIcons = {
    'Grocery Store': '🛒',
    'Restaurant': '🍔',
    'Pharmacy': '💊',
    'Electronics': '📱',
    'Default': '🏪'
  };

  return (
    <Card className="w-full mb-4 hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {/* Header with store info and urgency */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">
              {storeTypeIcons[storeType] || storeTypeIcons['Default']}
            </span>
            <div>
              <h3 className="font-semibold text-lg">{storeName}</h3>
              <p className="text-sm text-gray-600">{storeType}</p>
            </div>
          </div>
          <Badge className={urgencyColors[urgency]}>
            {urgency === 'high' && <AlertCircle className="w-3 h-3 mr-1" />}
            {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
          </Badge>
        </div>

        {/* Order details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>{items}</strong> {items === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">{distance}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm">~{estimatedTime}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-sm font-bold text-green-600">₹{payout}</span>
          </div>
        </div>

        {/* Customer info */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm font-medium mb-1">Customer: {customerName}</p>
          <div className="space-y-1">
            <p className="text-xs text-gray-600">
              <MapPin className="w-3 h-3 inline mr-1" />
              Pickup: {pickupAddress}
            </p>
            <p className="text-xs text-gray-600">
              <MapPin className="w-3 h-3 inline mr-1" />
              Drop: {deliveryAddress}
            </p>
          </div>
        </div>

        {/* Timestamp */}
        <p className="text-xs text-gray-500">
          Posted {timestamp ? new Date(timestamp).toLocaleTimeString() : 'just now'}
        </p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0">
        <Button 
          onClick={() => onAccept(id)}
          disabled={disabled}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {disabled ? 'Processing...' : 'Accept Job'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssignmentCard;