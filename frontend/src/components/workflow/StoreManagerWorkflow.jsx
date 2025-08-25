import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Package, 
  User,
  AlertTriangle,
  Bell,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { useOrderWorkflow, ORDER_STATUSES } from '../../contexts/OrderWorkflowContext';
import { createWorkflowWebSocket } from '../../services/workflowWebSocket';

const StoreManagerWorkflow = ({ user, storeId = 'store_001' }) => {
  const { toast } = useToast();
  
  const {
    storeOrders,
    setUserContext,
    connectWebSocket,
    acceptOrder,
    rejectOrder,
    assignPicker,
    assignPacker,
    assignRider
  } = useOrderWorkflow();

  const orders = storeOrders[storeId] || [];

  useEffect(() => {
    // Set user context
    setUserContext(user, 'store_manager');

    // Connect WebSocket
    const ws = createWorkflowWebSocket(storeId, 'store_manager');
    connectWebSocket(ws);

    // Listen for new orders
    ws.on('order.new', (data) => {
      toast({
        title: "New Order Received!",
        description: `Order from ${data.customerName} - ${data.itemCount} items (₹${data.totalAmount})`,
      });
    });

    // Listen for picker completion
    ws.on('picker.completed', (data) => {
      toast({
        title: "Picking Completed",
        description: `Order ${data.orderId.slice(-6)} ready for packing assignment`,
      });
    });

    // Listen for packer completion
    ws.on('packer.completed', (data) => {
      toast({
        title: "Packing Completed",
        description: `Order ${data.orderId.slice(-6)} ready for rider assignment`,
      });
    });

    return () => {
      ws.cleanup();
    };
  }, []);

  const handleAcceptOrder = (orderId) => {
    acceptOrder(orderId, storeId);
    toast({
      title: "Order Accepted",
      description: `Order ${orderId.slice(-6)} accepted and will be assigned to picker`,
    });
  };

  const handleRejectOrder = (orderId) => {
    rejectOrder(orderId, 'Store capacity exceeded');
    toast({
      title: "Order Rejected",
      description: `Order ${orderId.slice(-6)} has been rejected`,
      variant: "destructive"
    });
  };

  const handleAssignPicker = (orderId) => {
    assignPicker(orderId, 'picker_001');
    toast({
      title: "Picker Assigned",
      description: `Order ${orderId.slice(-6)} assigned to picker`,
    });
  };

  const handleAssignPacker = (orderId) => {
    assignPacker(orderId, 'packer_001');
    toast({
      title: "Packer Assigned",
      description: `Order ${orderId.slice(-6)} assigned to packer`,
    });
  };

  const handleAssignRider = (orderId) => {
    assignRider(orderId, 'rider_001');
    toast({
      title: "Rider Assigned",
      description: `Order ${orderId.slice(-6)} assigned to delivery partner`,
    });
  };

  const getPendingOrders = () => {
    return orders.filter(order => order.status === ORDER_STATUSES.PLACED);
  };

  const getActiveOrders = () => {
    return orders.filter(order => 
      [ORDER_STATUSES.ACCEPTED, ORDER_STATUSES.ASSIGNED_TO_PICKER, 
       ORDER_STATUSES.PICKED, ORDER_STATUSES.ASSIGNED_TO_PACKER, 
       ORDER_STATUSES.PACKED].includes(order.status)
    );
  };

  const getReadyForPickerOrders = () => {
    return orders.filter(order => order.status === ORDER_STATUSES.ACCEPTED);
  };

  const getReadyForPackerOrders = () => {
    return orders.filter(order => order.status === ORDER_STATUSES.PICKED);
  };

  const getReadyForRiderOrders = () => {
    return orders.filter(order => order.status === ORDER_STATUSES.PACKED);
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUSES.PLACED:
        return 'bg-yellow-100 text-yellow-800';
      case ORDER_STATUSES.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ORDER_STATUSES.ASSIGNED_TO_PICKER:
      case ORDER_STATUSES.PICKED:
        return 'bg-purple-100 text-purple-800';
      case ORDER_STATUSES.ASSIGNED_TO_PACKER:
      case ORDER_STATUSES.PACKED:
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getUrgencyLevel = (order) => {
    const hoursOld = (new Date() - new Date(order.createdAt)) / (1000 * 60 * 60);
    if (hoursOld > 1) return 'urgent';
    if (hoursOld > 0.5) return 'high';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{getPendingOrders().length}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-blue-600">{getActiveOrders().length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Need Assignments</p>
                <p className="text-2xl font-bold text-orange-600">
                  {getReadyForPickerOrders().length + getReadyForPackerOrders().length + getReadyForRiderOrders().length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Orders</p>
                <p className="text-2xl font-bold text-green-600">{orders.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Orders - Need Approval */}
      {getPendingOrders().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              <span>Pending Orders ({getPendingOrders().length})</span>
              <Badge className="bg-yellow-100 text-yellow-800">Action Required</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getPendingOrders().map((order) => {
                const urgency = getUrgencyLevel(order);
                return (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                        <p className="text-gray-600">Customer: {order.customerName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {urgency === 'urgent' && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                        <Badge className="capitalize bg-blue-100 text-blue-800">
                          {order.category}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="font-medium">{order.items?.length || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="font-medium">₹{order.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Order Time</p>
                        <p className="font-medium">{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Payment</p>
                        <p className="font-medium capitalize">{order.paymentMethod}</p>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleAcceptOrder(order.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Order
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRejectOrder(order.id)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assignment Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Ready for Picker Assignment */}
        {getReadyForPickerOrders().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-purple-700">Ready for Picker</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getReadyForPickerOrders().map((order) => (
                  <div key={order.id} className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">#{order.id.slice(-6)}</span>
                      <Badge className="bg-purple-100 text-purple-800">
                        {order.items?.length} items
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.customerName}</p>
                    <Button
                      onClick={() => handleAssignPicker(order.id)}
                      size="sm"
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <User className="w-3 h-3 mr-1" />
                      Assign Picker
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ready for Packer Assignment */}
        {getReadyForPackerOrders().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-700">Ready for Packer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getReadyForPackerOrders().map((order) => (
                  <div key={order.id} className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">#{order.id.slice(-6)}</span>
                      <Badge className="bg-orange-100 text-orange-800">
                        Picked
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.customerName}</p>
                    <Button
                      onClick={() => handleAssignPacker(order.id)}
                      size="sm"
                      className="w-full bg-orange-600 hover:bg-orange-700"
                    >
                      <Package className="w-3 h-3 mr-1" />
                      Assign Packer
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Ready for Rider Assignment */}
        {getReadyForRiderOrders().length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-indigo-700">Ready for Rider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getReadyForRiderOrders().map((order) => (
                  <div key={order.id} className="p-3 bg-indigo-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">#{order.id.slice(-6)}</span>
                      <Badge className="bg-indigo-100 text-indigo-800">
                        Packed
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{order.customerName}</p>
                    <Button
                      onClick={() => handleAssignRider(order.id)}
                      size="sm"
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                      <User className="w-3 h-3 mr-1" />
                      Assign Rider
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Active Orders Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Active Orders Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {getActiveOrders().length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders</h3>
              <p className="text-gray-600">All orders are either pending approval or completed</p>
            </div>
          ) : (
            <div className="space-y-3">
              {getActiveOrders().map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{order.customerName} • {order.items?.length} items</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(order.status)}>
                      {formatStatus(order.status)}
                    </Badge>
                    <p className="text-sm text-gray-600 mt-1">₹{order.totalAmount}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreManagerWorkflow;