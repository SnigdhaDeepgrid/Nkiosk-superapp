import React from 'react';
import { MapPin, Package, Navigation, Key, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

const StepProgress = ({ currentOrder, onMarkPickedUp, onMarkArrived, onVerifyOtp }) => {
  if (!currentOrder) return null;

  const steps = [
    {
      id: 'navigate_to_store',
      label: 'Navigate to Store',
      icon: Navigation,
      description: 'Go to pickup location'
    },
    {
      id: 'picked_up', 
      label: 'Picked Up',
      icon: Package,
      description: 'Mark items as collected'
    },
    {
      id: 'navigate_to_customer',
      label: 'Navigate to Customer', 
      icon: MapPin,
      description: 'Deliver to customer'
    },
    {
      id: 'verify_otp',
      label: 'Verify OTP',
      icon: Key,
      description: 'Complete delivery'
    },
    {
      id: 'delivered',
      label: 'Delivered',
      icon: CheckCircle2,
      description: 'Order completed'
    }
  ];

  const getCurrentStepIndex = () => {
    const status = currentOrder.status;
    switch (status) {
      case 'accepted': return 0;           // Navigate to Store
      case 'picked_up': return 1;          // Picked Up (completed)
      case 'en_route': return 2;           // Navigate to Customer  
      case 'arrived_customer': return 3;   // Verify OTP
      case 'delivered': return 4;          // Delivered
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();
  const canMarkPickedUp = currentOrder.status === 'accepted';
  const canMarkArrived = currentOrder.status === 'en_route';     // Changed from 'picked_up' to 'en_route'
  const canVerifyOtp = currentOrder.status === 'arrived_customer';

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Order Summary */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Current Delivery</h3>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Order #{currentOrder.id?.slice(-6)}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Store</p>
            <p className="font-medium">{currentOrder.storeName}</p>
          </div>
          <div>
            <p className="text-gray-600">Customer</p>
            <p className="font-medium">{currentOrder.customerName}</p>
          </div>
          <div>
            <p className="text-gray-600">Items</p>
            <p className="font-medium">{currentOrder.items} items</p>
          </div>
          <div>
            <p className="text-gray-600">Payout</p>
            <p className="font-medium text-green-600">₹{currentOrder.payout}</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white rounded-lg border p-6">
        <h4 className="font-semibold mb-6">Delivery Progress</h4>
        
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200"></div>
          <div 
            className="absolute left-6 top-12 w-0.5 bg-blue-500 transition-all duration-500"
            style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          ></div>

          {/* Steps */}
          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isUpcoming = index > currentStepIndex;

              return (
                <div key={step.id} className="relative flex items-center">
                  {/* Step Circle */}
                  <div className={`
                    relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 
                    ${isCompleted 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : isCurrent 
                        ? 'bg-blue-500 border-blue-500 text-white animate-pulse' 
                        : 'bg-white border-gray-300 text-gray-400'
                    }
                  `}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Step Content */}
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className={`font-medium ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}`}>
                          {step.label}
                        </h5>
                        <p className="text-sm text-gray-500">{step.description}</p>
                      </div>
                      
                      {/* Action Buttons */}
                      {isCurrent && (
                        <div className="ml-4">
                          {step.id === 'picked_up' && canMarkPickedUp && (
                            <Button 
                              onClick={onMarkPickedUp}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Mark Picked Up
                            </Button>
                          )}
                          {step.id === 'navigate_to_customer' && canMarkArrived && (
                            <Button 
                              onClick={onMarkArrived}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Mark Arrived
                            </Button>
                          )}
                          {step.id === 'verify_otp' && canVerifyOtp && (
                            <Button 
                              onClick={onVerifyOtp}
                              size="sm"
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              Get OTP from Customer
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Completion Checkmark */}
                  {isCompleted && (
                    <CheckCircle2 className="w-6 h-6 text-green-500 ml-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Addresses */}
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h6 className="font-medium text-blue-800 mb-2">📍 Pickup Address</h6>
            <p className="text-sm text-blue-700">{currentOrder.pickupAddress}</p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h6 className="font-medium text-green-800 mb-2">📍 Delivery Address</h6>
            <p className="text-sm text-green-700">{currentOrder.deliveryAddress}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgress;