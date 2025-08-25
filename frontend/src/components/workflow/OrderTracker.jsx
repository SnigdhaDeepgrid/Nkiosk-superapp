import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  User,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { useOrderWorkflow, ORDER_STATUSES } from '../../contexts/OrderWorkflowContext';

const OrderTracker = ({ orderId, minimal = false }) => {
  const { adminOrders, otpData } = useOrderWorkflow();
  const [refreshing, setRefreshing] = useState(false);

  const order = adminOrders.find(o => o.id === orderId);

  if (!order) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">Order not found</p>
        </CardContent>
      </Card>
    );
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusProgress = () => {
    const statuses = [
      ORDER_STATUSES.PLACED,
      ORDER_STATUSES.ACCEPTED,
      ORDER_STATUSES.ASSIGNED_TO_PICKER,
      ORDER_STATUSES.PICKED,
      ORDER_STATUSES.ASSIGNED_TO_PACKER,
      ORDER_STATUSES.PACKED,
      ORDER_STATUSES.ASSIGNED_TO_RIDER,
      ORDER_STATUSES.PICKED_UP,
      ORDER_STATUSES.OUT_FOR_DELIVERY,
      ORDER_STATUSES.DELIVERED
    ];

    const currentIndex = statuses.indexOf(order.status);
    return Math.round(((currentIndex + 1) / statuses.length) * 100);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ORDER_STATUSES.PLACED:
        return 'bg-blue-100 text-blue-800';
      case ORDER_STATUSES.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ORDER_STATUSES.ASSIGNED_TO_PICKER:
      case ORDER_STATUSES.PICKED:
        return 'bg-purple-100 text-purple-800';
      case ORDER_STATUSES.ASSIGNED_TO_PACKER:
      case ORDER_STATUSES.PACKED:
        return 'bg-orange-100 text-orange-800';
      case ORDER_STATUSES.ASSIGNED_TO_RIDER:
      case ORDER_STATUSES.PICKED_UP:
      case ORDER_STATUSES.OUT_FOR_DELIVERY:
        return 'bg-indigo-100 text-indigo-800';
      case ORDER_STATUSES.DELIVERED:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case ORDER_STATUSES.PLACED:
      case ORDER_STATUSES.ACCEPTED:
        return Clock;
      case ORDER_STATUSES.ASSIGNED_TO_PICKER:
      case ORDER_STATUSES.PICKED:
      case ORDER_STATUSES.ASSIGNED_TO_PACKER:
      case ORDER_STATUSES.PACKED:
        return Package;
      case ORDER_STATUSES.ASSIGNED_TO_RIDER:
      case ORDER_STATUSES.PICKED_UP:
      case ORDER_STATUSES.OUT_FOR_DELIVERY:
        return Truck;
      case ORDER_STATUSES.DELIVERED:
        return CheckCircle;
      default:
        return Clock;
    }
  };

  const formatStatus = (status) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const progress = getStatusProgress();
  const StatusIcon = getStatusIcon(order.status);
  const currentOtp = otpData[orderId];

  if (minimal) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <StatusIcon className="w-5 h-5 text-blue-500" />
        <div className="flex-1">
          <p className="font-medium text-sm">{formatStatus(order.status)}</p>
          <Progress value={progress} className="h-2 mt-1" />
        </div>
        <Badge className={getStatusColor(order.status)}>
          {progress}%
        </Badge>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <StatusIcon className="w-5 h-5" />
            <span>Order #{order.id.slice(-6)}</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(order.status)}>
              {formatStatus(order.status)}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Customer</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium capitalize">{order.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Items</p>
            <p className="font-medium">{order.items?.length || 0} items</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total</p>
            <p className="font-medium">₹{order.totalAmount}</p>
          </div>
        </div>

        {/* OTP Display for Customer */}
        {currentOtp && order.status === ORDER_STATUSES.PICKED_UP && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-4 h-4 text-green-600" />
              <span className="font-medium text-green-800">Delivery OTP</span>
            </div>
            <p className="text-2xl font-bold text-green-600 tracking-widest">
              {currentOtp.otp}
            </p>
            <p className="text-sm text-green-700 mt-1">
              Share this OTP with the delivery partner
            </p>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h4 className="font-medium mb-3">Order Timeline</h4>
          <div className="space-y-3">
            {order.timeline?.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{event.message}</p>
                  <p className="text-xs text-gray-500">
                    {event.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        {order.deliveryAddress && (
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-500 mt-1" />
              <div>
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
              </div>
            </div>
          </div>
        )}

        {/* Assigned Personnel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {order.pickerId && (
            <div className="text-center p-2 bg-purple-50 rounded">
              <User className="w-4 h-4 mx-auto mb-1 text-purple-600" />
              <p className="font-medium">Picker</p>
              <p className="text-purple-600">{order.pickerId}</p>
            </div>
          )}
          
          {order.packerId && (
            <div className="text-center p-2 bg-orange-50 rounded">
              <Package className="w-4 h-4 mx-auto mb-1 text-orange-600" />
              <p className="font-medium">Packer</p>
              <p className="text-orange-600">{order.packerId}</p>
            </div>
          )}
          
          {order.riderId && (
            <div className="text-center p-2 bg-indigo-50 rounded">
              <Truck className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
              <p className="font-medium">Rider</p>
              <p className="text-indigo-600">{order.riderId}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderTracker;