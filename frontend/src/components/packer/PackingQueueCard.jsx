import React from 'react';
import { Package2, Clock, MapPin, AlertTriangle, User, Play, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const PackingQueueCard = ({ order, onStartPacking, disabled = false }) => {
  const {
    id,
    customerName,
    industry,
    priority,
    completedPickingAt,
    pickingProgress,
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

  const waitTime = Math.floor((new Date() - completedPickingAt) / (1000 * 60));
  const pickedItems = items.filter(item => item.status === 'picked');
  const outOfStockItems = items.filter(item => item.status === 'out_of_stock');

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
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
            <span className="text-xs text-gray-500">
              Waiting {waitTime}m
            </span>
          </div>
        </div>

        {/* Picking Summary */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-600">{pickedItems.length}</p>
            <p className="text-xs text-green-700">Picked</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <XCircle className="w-4 h-4 text-red-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-red-600">{outOfStockItems.length}</p>
            <p className="text-xs text-red-700">Out of Stock</p>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Package2 className="w-4 h-4 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-600">{items.length}</p>
            <p className="text-xs text-blue-700">Total Items</p>
          </div>
        </div>

        {/* Items Preview */}
        <div className="border-t pt-4">
          <p className="text-sm font-medium text-gray-900 mb-2">Items to Pack:</p>
          <div className="space-y-1">
            {pickedItems.slice(0, 3).map((item, index) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-700">
                  <CheckCircle className="w-3 h-3 text-green-500 inline mr-1" />
                  {item.quantity}x {item.name}
                </span>
                <span className="text-gray-500 text-xs">Ready</span>
              </div>
            ))}
            {outOfStockItems.length > 0 && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
                ⚠️ {outOfStockItems.length} item(s) out of stock - handle exceptions
              </div>
            )}
            {pickedItems.length > 3 && (
              <p className="text-xs text-gray-500">
                +{pickedItems.length - 3} more items ready for packing...
              </p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="bg-gray-50 rounded-lg p-3 mt-4">
          <div className="flex items-start space-x-2">
            <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Delivery Address</p>
              <p className="text-sm text-gray-600">{deliveryAddress}</p>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-6 pb-6 pt-0">
        <Button 
          onClick={() => onStartPacking(order)}
          disabled={disabled}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          size="lg"
        >
          {disabled ? (
            <>
              <Package2 className="w-4 h-4 mr-2" />
              Another Order in Progress
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Packing
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PackingQueueCard;