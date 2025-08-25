import React, { useState } from 'react';
import { 
  Package, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Scan, 
  AlertTriangle,
  Clock,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';

const PickingList = ({ 
  order, 
  onScanItem, 
  onMarkOutOfStock, 
  onComplete, 
  scannedItems 
}) => {
  const [outOfStockDialog, setOutOfStockDialog] = useState({ open: false, item: null });
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const outOfStockReasons = [
    'Temporarily out of stock',
    'Item damaged',
    'Expired product',
    'Item discontinued',
    'Wrong item received',
    'Unable to locate item',
    'Custom reason'
  ];

  const handleScanClick = async (item) => {
    // Mock barcode scan - in real app would use camera
    const mockBarcode = item.barcode;
    const success = await onScanItem(order.id, item.id, mockBarcode);
    
    if (success) {
      // Item marked as picked automatically in parent component
    }
  };

  const handleOutOfStockClick = (item) => {
    setOutOfStockDialog({ open: true, item });
    setSelectedReason('');
    setCustomReason('');
  };

  const handleConfirmOutOfStock = () => {
    const reason = selectedReason === 'Custom reason' ? customReason : selectedReason;
    if (reason && outOfStockDialog.item) {
      onMarkOutOfStock(order.id, outOfStockDialog.item.id, reason);
      setOutOfStockDialog({ open: false, item: null });
    }
  };

  const getItemStatus = (item) => {
    const scanKey = `${order.id}_${item.id}`;
    if (scannedItems[scanKey]?.verified) {
      return 'picked';
    }
    return item.status || 'pending';
  };

  const groupItemsByLocation = (items) => {
    const grouped = {};
    items.forEach(item => {
      const location = item.location || 'Unknown Location';
      if (!grouped[location]) {
        grouped[location] = [];
      }
      grouped[location].push(item);
    });
    return grouped;
  };

  const groupedItems = groupItemsByLocation(order.items);
  const pickedCount = order.items.filter(item => getItemStatus(item) === 'picked').length;
  const outOfStockCount = order.items.filter(item => getItemStatus(item) === 'out_of_stock').length;
  const totalCount = order.items.length;
  const completionPercentage = Math.round(((pickedCount + outOfStockCount) / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Package className="w-5 h-5" />
              <span>Picking Order #{order.id.slice(-6)}</span>
            </CardTitle>
            <Badge variant="outline" className="px-3 py-1">
              {completionPercentage}% Complete
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">Customer</p>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="font-medium">{totalCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Picked</p>
              <p className="font-medium text-green-600">{pickedCount}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="font-medium text-red-600">{outOfStockCount}</p>
            </div>
          </div>
          
          {completionPercentage === 100 && (
            <div className="mt-4 pt-4 border-t">
              <Button 
                onClick={onComplete}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Picking & Send to Packer
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Picking List by Location */}
      {Object.entries(groupedItems).map(([location, items]) => (
        <Card key={location}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{location}</span>
              <Badge variant="secondary">
                {items.filter(item => getItemStatus(item) === 'picked').length}/{items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.map((item) => {
                const status = getItemStatus(item);
                const scanKey = `${order.id}_${item.id}`;
                const scannedData = scannedItems[scanKey];
                
                return (
                  <div key={item.id} className={`
                    flex items-center justify-between p-4 rounded-lg border-2 transition-colors
                    ${status === 'picked' 
                      ? 'border-green-200 bg-green-50' 
                      : status === 'out_of_stock'
                        ? 'border-red-200 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-blue-200'
                    }
                  `}>
                    <div className="flex items-center space-x-4">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${status === 'picked' 
                          ? 'bg-green-100 text-green-600' 
                          : status === 'out_of_stock'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-gray-100 text-gray-600'
                        }
                      `}>
                        {status === 'picked' ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : status === 'out_of_stock' ? (
                          <XCircle className="w-5 h-5" />
                        ) : (
                          <Package className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {item.quantity}x {item.name}
                        </h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>SKU: {item.barcode}</span>
                          <span>Unit: {item.unit}</span>
                        </div>
                        {scannedData && (
                          <div className="flex items-center space-x-2 mt-1">
                            <BarChart3 className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-green-600">
                              Scanned at {scannedData.scannedAt.toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleScanClick(item)}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Scan className="w-4 h-4 mr-1" />
                            Scan
                          </Button>
                          <Button
                            onClick={() => handleOutOfStockClick(item)}
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Out of Stock
                          </Button>
                        </>
                      )}
                      
                      {status === 'picked' && (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Picked
                        </Badge>
                      )}
                      
                      {status === 'out_of_stock' && (
                        <Badge variant="destructive">
                          <XCircle className="w-3 h-3 mr-1" />
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Out of Stock Dialog */}
      <Dialog open={outOfStockDialog.open} onOpenChange={(open) => 
        setOutOfStockDialog({ open, item: outOfStockDialog.item })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Item as Out of Stock</DialogTitle>
          </DialogHeader>
          
          {outOfStockDialog.item && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{outOfStockDialog.item.name}</h4>
                <p className="text-sm text-gray-600">
                  Quantity: {outOfStockDialog.item.quantity} {outOfStockDialog.item.unit}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-900">Reason</label>
                <Select value={selectedReason} onValueChange={setSelectedReason}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {outOfStockReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedReason === 'Custom reason' && (
                <div>
                  <label className="text-sm font-medium text-gray-900">Custom Reason</label>
                  <Textarea 
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Enter custom reason..."
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOutOfStockDialog({ open: false, item: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmOutOfStock}
              disabled={!selectedReason || (selectedReason === 'Custom reason' && !customReason)}
              variant="destructive"
            >
              Mark as Out of Stock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PickingList;