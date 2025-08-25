import React, { useState } from 'react';
import { 
  AlertTriangle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Phone, 
  RefreshCw,
  CheckCircle,
  Package
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';

const ExceptionHandler = ({ packingQueue, currentOrder }) => {
  const [exceptionDialog, setExceptionDialog] = useState({ open: false, order: null, item: null });
  const [exceptionType, setExceptionType] = useState('');
  const [exceptionNotes, setExceptionNotes] = useState('');
  const { toast } = useToast();

  const exceptionTypes = [
    'Item damaged during picking',
    'Item damaged during packing', 
    'Item expired/near expiry',
    'Wrong item picked',
    'Packaging shortage',
    'Customer substitution request',
    'Quantity discrepancy',
    'Quality issues',
    'Other'
  ];

  // Combine all orders and filter for those with exceptions
  const allOrders = [...packingQueue, ...(currentOrder ? [currentOrder] : [])];
  const ordersWithExceptions = allOrders.filter(order => 
    order.items.some(item => item.status === 'out_of_stock' || item.status === 'damaged')
  );

  const handleReportException = (order, item = null) => {
    setExceptionDialog({ open: true, order, item });
    setExceptionType('');
    setExceptionNotes('');
  };

  const handleSubmitException = () => {
    if (!exceptionType) {
      toast({
        title: "Error",
        description: "Please select an exception type",
        variant: "destructive"
      });
      return;
    }

    // Mock exception reporting
    toast({
      title: "Exception Reported",
      description: "Supervisor and customer service have been notified",
    });

    setExceptionDialog({ open: false, order: null, item: null });
  };

  const handleContactCustomer = (order) => {
    // Mock customer contact
    toast({
      title: "Contacting Customer",
      description: `Calling ${order.customerName} about order issues...`,
    });
  };

  const handleRequestSubstitution = (order, item) => {
    // Mock substitution request
    toast({
      title: "Substitution Requested",
      description: `Requesting substitution for ${item.name}`,
    });
  };

  const getExceptionSeverity = (order) => {
    const outOfStockCount = order.items.filter(item => item.status === 'out_of_stock').length;
    const totalItems = order.items.length;
    const percentage = (outOfStockCount / totalItems) * 100;
    
    if (percentage >= 50) return 'critical';
    if (percentage >= 25) return 'high';
    if (percentage > 0) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Exception Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orders with Issues</p>
                <p className="text-2xl font-bold text-red-600">{ordersWithExceptions.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Out of Stock</p>
                <p className="text-2xl font-bold text-orange-600">
                  {allOrders.reduce((sum, order) => 
                    sum + order.items.filter(item => item.status === 'out_of_stock').length, 0
                  )}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-blue-600">5m</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exception Orders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <span>Orders Requiring Attention</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ordersWithExceptions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Exceptions</h3>
              <p className="text-gray-600">
                All orders are processing smoothly without issues.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {ordersWithExceptions.map((order) => {
                const severity = getExceptionSeverity(order);
                const outOfStockItems = order.items.filter(item => item.status === 'out_of_stock');
                
                return (
                  <div key={order.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          Order #{order.id.slice(-6)} - {order.customerName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {outOfStockItems.length} of {order.items.length} items have issues
                        </p>
                      </div>
                      <Badge className={getSeverityColor(severity)}>
                        {severity.charAt(0).toUpperCase() + severity.slice(1)} Priority
                      </Badge>
                    </div>

                    {/* Exception Items */}
                    <div className="space-y-2 mb-4">
                      {outOfStockItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center space-x-3">
                            <XCircle className="w-4 h-4 text-red-500" />
                            <div>
                              <p className="font-medium text-gray-900">
                                {item.quantity}x {item.name}
                              </p>
                              <p className="text-sm text-red-600">
                                {item.reason || 'Out of stock'}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRequestSubstitution(order, item)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Substitute
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleContactCustomer(order)}
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Contact Customer
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReportException(order)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Report Exception
                      </Button>
                    </div>

                    {/* Resolution Options */}
                    <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 mb-2">
                        <strong>Recommended Actions:</strong>
                      </p>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Contact customer to offer substitutions</li>
                        <li>• Check if items are available in other locations</li>
                        <li>• Process partial order if customer approves</li>
                        <li>• Escalate to supervisor if needed</li>
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Exception Reporting Dialog */}
      <Dialog open={exceptionDialog.open} onOpenChange={(open) => 
        setExceptionDialog({ open, order: exceptionDialog.order, item: exceptionDialog.item })
      }>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Report Exception</DialogTitle>
          </DialogHeader>
          
          {exceptionDialog.order && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium">Order #{exceptionDialog.order.id.slice(-6)}</h4>
                <p className="text-sm text-gray-600">
                  Customer: {exceptionDialog.order.customerName}
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-900">Exception Type</label>
                <Select value={exceptionType} onValueChange={setExceptionType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select exception type" />
                  </SelectTrigger>
                  <SelectContent>
                    {exceptionTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-900">Additional Notes</label>
                <Textarea 
                  value={exceptionNotes}
                  onChange={(e) => setExceptionNotes(e.target.value)}
                  placeholder="Describe the issue and any actions taken..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setExceptionDialog({ open: false, order: null, item: null })}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitException}
              disabled={!exceptionType}
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExceptionHandler;