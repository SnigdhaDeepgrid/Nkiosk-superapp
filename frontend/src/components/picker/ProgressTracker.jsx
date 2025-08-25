import React from 'react';
import { Clock, Package, CheckCircle, XCircle, Target, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

const ProgressTracker = ({ order, progress }) => {
  if (!order || !progress) return null;

  const { totalItems, pickedItems = 0, outOfStockItems = 0, startedAt } = progress;
  const completedItems = pickedItems + outOfStockItems;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);
  const remainingItems = totalItems - completedItems;

  // Calculate time elapsed
  const timeElapsed = startedAt ? Math.floor((new Date() - startedAt) / (1000 * 60)) : 0;
  const avgTimePerItem = completedItems > 0 ? Math.round(timeElapsed / completedItems) : 0;
  const estimatedTimeRemaining = avgTimePerItem > 0 ? avgTimePerItem * remainingItems : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span>Picking Progress</span>
          </CardTitle>
          <Badge 
            variant={completionPercentage === 100 ? "default" : "secondary"}
            className={completionPercentage === 100 ? "bg-green-600" : ""}
          >
            {completionPercentage}% Complete
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 pb-4 border-b">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-sm text-gray-600">Time Elapsed</p>
              <p className="font-medium">{timeElapsed} minutes</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              Overall Progress
            </span>
            <span className="text-sm text-gray-600">
              {completedItems} of {totalItems} items
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{totalItems}</p>
            <p className="text-sm text-blue-700">Total Items</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{pickedItems}</p>
            <p className="text-sm text-green-700">Picked</p>
          </div>
          
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-red-600">{outOfStockItems}</p>
            <p className="text-sm text-red-700">Out of Stock</p>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-600">{remainingItems}</p>
            <p className="text-sm text-orange-700">Remaining</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Time per Item</p>
            <p className="text-lg font-semibold text-gray-900">
              {avgTimePerItem > 0 ? `${avgTimePerItem}m` : '--'}
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">Est. Time Remaining</p>
            <p className="text-lg font-semibold text-gray-900">
              {estimatedTimeRemaining ? `${estimatedTimeRemaining}m` : '--'}
            </p>
          </div>
        </div>

        {/* Status Messages */}
        <div className="space-y-2">
          {completionPercentage === 100 && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                🎉 All items processed! Ready to send to packer.
              </p>
            </div>
          )}
          
          {completionPercentage >= 50 && completionPercentage < 100 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                Great progress! You're more than halfway done.
              </p>
            </div>
          )}
          
          {outOfStockItems > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                {outOfStockItems} item{outOfStockItems > 1 ? 's' : ''} marked as out of stock. 
                Packer will be notified of substitutions needed.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressTracker;