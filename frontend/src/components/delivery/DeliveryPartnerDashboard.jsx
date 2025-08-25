import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  Truck, 
  DollarSign, 
  User, 
  LogOut, 
  Bell,
  MapPin,
  Phone,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { useDelivery } from '../../contexts/DeliveryContext';
import { createMockWebSocket } from '../../services/mockWebSocket';

// Import delivery components
import AssignmentCard from './AssignmentCard';
import StepProgress from './StepProgress';
import OtpDialog from './OtpDialog';
import AvailabilitySwitch from './AvailabilitySwitch';
import EarningsChart from './EarningsChart';

const DeliveryPartnerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [acceptingJob, setAcceptingJob] = useState(null);

  // Delivery context
  const {
    assignments,
    currentOrder,
    availability,
    earnings,
    location,
    websocket,
    acceptAssignment,
    markPickedUp,
    markArrived,
    verifyOtp,
    toggleAvailability,
    setAssignments,
    addAssignment,
    setWebSocket
  } = useDelivery();

  // Initialize mock data and WebSocket
  useEffect(() => {
    // Set initial mock assignments
    const mockAssignments = [
      {
        id: 'job_001',
        storeType: 'Grocery Store',
        storeName: 'FreshMart Central',
        customerName: 'John Doe',
        items: 8,
        distance: '2.1 km',
        estimatedTime: '22 min',
        payout: 42.50,
        pickupAddress: '123 Market Street, City Center',
        deliveryAddress: '456 Residential Ave, Suburb',
        urgency: 'normal',
        timestamp: new Date()
      },
      {
        id: 'job_002',
        storeType: 'Restaurant',
        storeName: 'Pizza Corner',
        customerName: 'Alice Smith',
        items: 2,
        distance: '1.5 km',
        estimatedTime: '15 min',
        payout: 35.75,
        pickupAddress: '789 Food Plaza, Downtown',
        deliveryAddress: '321 Oak Street, Midtown',
        urgency: 'high',
        timestamp: new Date()
      }
    ];
    setAssignments(mockAssignments);

    // Initialize WebSocket
    const ws = createMockWebSocket(user?.id || 'rider_001');
    setWebSocket(ws);

    // Listen for WebSocket events
    ws.on('rider.job.proposed', (job) => {
      addAssignment(job);
      toast({
        title: "New Job Available!",
        description: `${job.storeType}: ${job.storeName} - ₹${job.payout}`,
      });
    });

    ws.on('rider.job.assigned', (assignment) => {
      toast({
        title: "Job Assigned",
        description: "You have been assigned a new delivery",
      });
    });

    ws.on('order.picked_up', () => {
      toast({
        title: "Pickup Confirmed",
        description: "Order has been marked as picked up",
      });
    });

    ws.on('order.otp.issued', (data) => {
      toast({
        title: "Customer OTP Sent",
        description: "OTP sent to customer. Ask them for the 6-digit code to complete delivery.",
      });
    });

    ws.on('customer.arrived', (data) => {
      toast({
        title: "Arrived at Customer",
        description: "You're at the delivery location. Request OTP from customer.",
      });
    });

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.cleanup();
      }
    };
  }, []);

  const handleAcceptJob = async (jobId) => {
    setAcceptingJob(jobId);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      acceptAssignment(jobId);
      setActiveTab('deliveries');
      
      toast({
        title: "Job Accepted!",
        description: "Navigate to the pickup location to start delivery",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept job. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAcceptingJob(null);
    }
  };

  const handleMarkPickedUp = () => {
    markPickedUp();
    toast({
      title: "Picked Up!",
      description: "Order marked as picked up. Navigate to customer location.",
    });
  };

  const handleMarkArrived = () => {
    markArrived();
    toast({
      title: "Arrived at Customer!",
      description: "Ask customer for their 6-digit OTP to complete delivery.",
    });
  };

  const handleVerifyOtp = () => {
    setIsOtpDialogOpen(true);
  };

  const handleOtpSubmit = (otpCode) => {
    const success = verifyOtp(otpCode);
    if (success) {
      toast({
        title: "Delivery Complete!",
        description: `Earned ₹${currentOrder?.payout || 0}. Great job!`,
      });
      setIsOtpDialogOpen(false);
      return true;
    } else {
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleToggleAvailability = () => {
    toggleAvailability();
    toast({
      title: availability ? "Going Offline" : "Going Online",
      description: availability 
        ? "You will stop receiving new assignments" 
        : "You are now available for new assignments",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">🚚 Delivery Partner Dashboard</h1>
              <Badge variant={availability ? "default" : "secondary"} className="ml-2">
                {availability ? "Online" : "Offline"}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'R'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name || 'Rider'}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="home" className="flex items-center space-x-2">
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Available Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="deliveries" className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">My Deliveries</span>
            </TabsTrigger>
            <TabsTrigger value="earnings" className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Earnings</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Available Jobs Tab */}
          <TabsContent value="home" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Available Jobs</h2>
              <Badge variant="outline" className="px-3 py-1">
                {assignments.length} jobs available
              </Badge>
            </div>

            {assignments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Truck className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Jobs Available</h3>
                  <p className="text-gray-600">
                    {availability 
                      ? "You're online and ready. New jobs will appear here automatically."
                      : "Turn on availability to receive job notifications."
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {assignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onAccept={handleAcceptJob}
                    disabled={acceptingJob === assignment.id}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Deliveries Tab */}
          <TabsContent value="deliveries" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Deliveries</h2>
            
            {currentOrder ? (
              <StepProgress 
                currentOrder={currentOrder}
                onMarkPickedUp={handleMarkPickedUp}
                onMarkArrived={handleMarkArrived}
                onVerifyOtp={handleVerifyOtp}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Delivery</h3>
                  <p className="text-gray-600">
                    Accept a job from the Available Jobs tab to start a delivery.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('home')} 
                    className="mt-4"
                  >
                    Browse Jobs
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Earnings Tab */}
          <TabsContent value="earnings" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Earnings</h2>
            <EarningsChart earnings={earnings} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
            
            <div className="grid gap-6 md:grid-cols-2">
              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <AvailabilitySwitch 
                    availability={availability}
                    onToggle={handleToggleAvailability}
                  />
                </CardContent>
              </Card>

              {/* Vehicle Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Vehicle Type</label>
                    <p className="text-gray-900">Motorcycle</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">License Plate</label>
                    <p className="text-gray-900">ABC-1234</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Update Vehicle Info
                  </Button>
                </CardContent>
              </Card>

              {/* Contact & Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact & Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Emergency Contact
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <HelpCircle className="w-4 h-4 mr-2" />
                    Help & Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    App Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Location Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Location</CardTitle>
                </CardHeader>
                <CardContent>
                  {location.lat && location.lng ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Lat: {location.lat.toFixed(6)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Lng: {location.lng.toFixed(6)}
                      </p>
                      <Badge variant="outline" className="text-green-600">
                        Location Active
                      </Badge>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <MapPin className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Location tracking unavailable
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* OTP Dialog */}
      <OtpDialog
        isOpen={isOtpDialogOpen}
        onClose={() => setIsOtpDialogOpen(false)}
        onVerify={handleOtpSubmit}
        customerName={currentOrder?.customerName}
        orderId={currentOrder?.id}
      />
    </div>
  );
};

export default DeliveryPartnerDashboard;