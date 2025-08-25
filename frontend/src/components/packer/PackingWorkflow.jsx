import React, { useState } from 'react';
import { 
  Package2, 
  CheckCircle, 
  XCircle, 
  Tag, 
  QrCode,
  AlertTriangle,
  Box,
  User
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';

const PackingWorkflow = ({ 
  order, 
  progress, 
  packageTypes, 
  onMarkItemPacked, 
  onGenerateLabel, 
  onComplete 
}) => {
  const [selectedPackageType, setSelectedPackageType] = useState('');

  const packageTypeOptions = [
    { value: 'bag', label: 'Plastic Bag', icon: '🛍️' },
    { value: 'box_small', label: 'Small Box', icon: '📦' },
    { value: 'box_medium', label: 'Medium Box', icon: '📦' },
    { value: 'box_large', label: 'Large Box', icon: '📦' },
    { value: 'insulated', label: 'Insulated Bag', icon: '🧊' },
    { value: 'fragile', label: 'Fragile Box', icon: '⚠️' },
    { value: 'envelope', label: 'Envelope', icon: '✉️' }
  ];

  const pickedItems = order.items.filter(item => item.status === 'picked');
  const outOfStockItems = order.items.filter(item => item.status === 'out_of_stock');
  const packedCount = progress?.packedItems || 0;
  const totalToPack = pickedItems.length;
  const completionPercentage = totalToPack > 0 ? Math.round((packedCount / totalToPack) * 100) : 0;

  const handleMarkPacked = (item) => {
    if (!selectedPackageType) return;
    
    onMarkItemPacked(order.id, item.id, selectedPackageType);
    setSelectedPackageType('');
  };

  const getItemPackageType = (itemId) => {
    return packageTypes[`${order.id}_${itemId}`];
  };

  const isItemPacked = (itemId) => {
    return !!getItemPackageType(itemId);
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Package2 className="w-5 h-5" />
              <span>Packing Order #{order.id.slice(-6)}</span>
            </CardTitle>
            <Badge variant="outline" className="px-3 py-1">
              {completionPercentage}% Packed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Items to Pack</p>
              <p className="font-medium">{totalToPack}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Packed</p>
              <p className="font-medium text-green-600">{packedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="font-medium text-red-600">{outOfStockItems.length}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-900">Packing Progress</span>
              <span className="text-sm text-gray-600">{packedCount} of {totalToPack} items</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>

          {/* Generate Label & Complete */}
          {completionPercentage === 100 && (
            <div className="flex space-x-4 pt-4 border-t">
              <Button 
                onClick={() => onGenerateLabel(order.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Generate Label
              </Button>
              <Button 
                onClick={onComplete}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Packing
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Package Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <span>Package Type Selection</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedPackageType} onValueChange={setSelectedPackageType}>
            <SelectTrigger>
              <SelectValue placeholder="Select packaging type for items" />
            </SelectTrigger>
            <SelectContent>
              {packageTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <span className="flex items-center space-x-2">
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Items to Pack */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Box className="w-4 h-4" />
            <span>Items to Pack ({totalToPack})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pickedItems.map((item) => {
              const packed = isItemPacked(item.id);
              const packageType = getItemPackageType(item.id);
              
              return (
                <div key={item.id} className={`
                  flex items-center justify-between p-4 rounded-lg border-2 transition-colors
                  ${packed 
                    ? 'border-green-200 bg-green-50' 
                    : 'border-gray-200 bg-white hover:border-blue-200'
                  }
                `}>
                  <div className="flex items-center space-x-4">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${packed 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                      }
                    `}>
                      {packed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Box className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.quantity}x {item.name}
                      </h4>
                      <p className="text-sm text-gray-600">Unit: {item.unit}</p>
                      {packed && packageType && (
                        <p className="text-sm text-green-600">
                          📦 Packed in: {packageTypeOptions.find(p => p.value === packageType)?.label}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!packed && (
                      <Button
                        onClick={() => handleMarkPacked(item)}
                        disabled={!selectedPackageType}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Mark Packed
                      </Button>
                    )}
                    
                    {packed && (
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Packed
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Out of Stock Items */}
      {outOfStockItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Out of Stock Items ({outOfStockItems.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {outOfStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-red-200 bg-red-50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                      <XCircle className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {item.quantity}x {item.name}
                      </h4>
                      <p className="text-sm text-red-600">
                        Reason: {item.reason || 'Not specified'}
                      </p>
                    </div>
                  </div>

                  <Badge variant="destructive">
                    <XCircle className="w-3 h-3 mr-1" />
                    Out of Stock
                  </Badge>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                💡 Note: Customer will be notified about out-of-stock items. Consider contacting customer for substitutions if needed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PackingWorkflow;