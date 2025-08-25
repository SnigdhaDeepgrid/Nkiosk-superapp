import React from 'react';
import { Package, Clock, MapPin, AlertTriangle, User, Play } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const OrderCard = ({ order, onStartPicking, disabled = false }) => {
  const {
    id,
    customerName,
    industry,
    priority,
    estimatedTime,
    totalItems,
    orderTime,
    deliveryAddress,
    items
  } = order;

  const priorityColors = {
    urgent: 'bg-red-100 text-red-800 border-red-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    normal: 'bg-blue-100 text-blue-800 border-blue-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200'
  };

  const industryIcons = {
    grocery: '🛒',
    pharmacy: '💊',
    electronics: '📱'
  };

  const timeAgo = (date) => {
    const minutes = Math.floor((new Date() - date) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m ago`;
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{industryIcons[industry] || '📦'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-lg">Order #{id.slice(-6)}</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-3 h-3" />
                <span>{customerName}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <Badge className={priorityColors[priority]}>
              {priority === 'urgent' && <AlertTriangle className="w-3 h-3 mr-1" />}
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </Badge>
            <span className="text-xs text-gray-500">{timeAgo(orderTime)}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm">
              <strong>{totalItems}</strong> {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm">Est. {estimatedTime} min</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Delivery Address</p>
              <p className="text-sm text-gray-600">{deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Items Preview */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Items to Pick:</p>
          <div className="space-y-1">
            {items.slice(0, 3).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-gray-500 text-xs">{item.location}</span>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-xs text-gray-500">
                +{items.length - 3} more items...
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Button 
          onClick={() => onStartPicking(order)}
          disabled={disabled}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          size="lg"
        >
          {disabled ? (
            <>
              <Package className="w-4 h-4 mr-2" />
              Another Order in Progress
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Picking
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OrderCard;