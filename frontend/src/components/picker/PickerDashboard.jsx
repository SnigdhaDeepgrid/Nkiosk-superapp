import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Search, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  User,
  LogOut,
  Bell,
  ShoppingCart,
  Scan
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { useToast } from '../../hooks/use-toast';
import { usePickerPacker } from '../../contexts/PickerPackerContext';
import { createPickerSocket } from '../../services/mockPickerPackerSocket';

// Import picker components
import OrderCard from './OrderCard';
import PickingList from './PickingList';
import BarcodeScanner from './BarcodeScanner';
import ProgressTracker from './ProgressTracker';

const PickerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [showScanner, setShowScanner] = useState(false);

  // Picker context
  const {
    assignedOrders = [], // Default to empty array
    currentPickingOrder,
    pickingProgress,
    scannedItems,
    currentIndustry,
    websocket,
    setAssignedOrders,
    startPickingOrder,
    scanItem,
    updateItemStatus,
    markOutOfStock,
    completePicking,
    setWorker,
    setWebSocket,
    setIndustry
  } = usePickerPacker();

  // Ensure assignedOrders is always an array
  const safeAssignedOrders = Array.isArray(assignedOrders) ? assignedOrders : [];

  // Initialize picker data and WebSocket
  useEffect(() => {
    // Set worker info
    setWorker(user?.id || 'picker_001', 'picker');
    
    // Set industry based on user role or default
    const industry = user?.industry || 'grocery';
    setIndustry(industry);

    // Initialize mock assigned orders
    const mockOrders = [
      {
        id: 'ORD_001',
        customerName: 'Emma Johnson',
        industry: industry,
        priority: 'high',
        estimatedTime: 12,
        totalItems: 6,
        orderTime: new Date(Date.now() - 10 * 60 * 1000),
        items: [
          { id: 'item_001', name: 'Organic Bananas', quantity: 2, unit: 'bunch', barcode: '1234567890123', location: 'Aisle 1-A', status: 'pending' },
          { id: 'item_002', name: 'Whole Milk', quantity: 1, unit: 'gallon', barcode: '2345678901234', location: 'Dairy Section', status: 'pending' },
          { id: 'item_003', name: 'Bread - Whole Wheat', quantity: 1, unit: 'loaf', barcode: '3456789012345', location: 'Bakery', status: 'pending' },
          { id: 'item_004', name: 'Greek Yogurt', quantity: 3, unit: 'container', barcode: '4567890123456', location: 'Dairy Section', status: 'pending' },
          { id: 'item_005', name: 'Apples - Gala', quantity: 1, unit: 'bag', barcode: '5555666677778', location: 'Produce', status: 'pending' },
          { id: 'item_006', name: 'Orange Juice', quantity: 1, unit: 'bottle', barcode: '6666777788889', location: 'Refrigerated', status: 'pending' }
        ],
        deliveryAddress: '123 Main St, Downtown'
      },
      {
        id: 'ORD_002',
        customerName: 'Michael Chen',
        industry: industry,
        priority: 'normal',
        estimatedTime: 8,
        totalItems: 4,
        orderTime: new Date(Date.now() - 5 * 60 * 1000),
        items: [
          { id: 'med_001', name: 'Vitamin D3 Supplements', quantity: 1, unit: 'bottle', barcode: '7777888899990', location: 'Health-A1', status: 'pending' },
          { id: 'med_002', name: 'Pain Relief Gel', quantity: 1, unit: 'tube', barcode: '8888999900001', location: 'Health-B2', status: 'pending' },
          { id: 'med_003', name: 'Hand Sanitizer', quantity: 2, unit: 'bottle', barcode: '9999000011112', location: 'Health & Beauty', status: 'pending' },
          { id: 'med_004', name: 'First Aid Kit', quantity: 1, unit: 'kit', barcode: '0000111122223', location: 'Health-C3', status: 'pending' }
        ],
        deliveryAddress: '456 Oak Avenue, Midtown'
      }
    ];
    setAssignedOrders(mockOrders);

    // Initialize WebSocket
    const ws = createPickerSocket(user?.id || 'picker_001');
    setWebSocket(ws);

    // Listen for WebSocket events
    ws.on('new_order_assigned', (order) => {
      setAssignedOrders(prev => [...prev, order]);
      toast({
        title: "New Order Assigned",
        description: `Order for ${order.customerName} - ${order.totalItems} items`,
      });
    });

    ws.on('priority_update', (update) => {
      toast({
        title: "Priority Update",
        description: `Order ${update.orderId} priority changed to ${update.newPriority}`,
        variant: update.newPriority === 'urgent' ? 'destructive' : 'default'
      });
    });

    // Cleanup on unmount
    return () => {
      if (ws) {
        ws.cleanup();
      }
    };
  }, []);

  const handleStartPicking = (order) => {
    startPickingOrder(order);
    setActiveTab('picking');
    toast({
      title: "Started Picking",
      description: `Picking order for ${order.customerName}`,
    });
  };

  const handleScanItem = async (orderId, itemId, code) => {
    const verified = scanItem(orderId, itemId, code);
    
    if (verified) {
      toast({
        title: "Item Scanned ✓",
        description: "Item verified and marked as picked",
      });
    } else {
      toast({
        title: "Scan Failed",
        description: "Barcode doesn't match expected item",
        variant: "destructive"
      });
    }
    
    return verified;
  };

  const handleMarkOutOfStock = (orderId, itemId, reason) => {
    markOutOfStock(orderId, itemId, reason);
    toast({
      title: "Item Marked Out of Stock",
      description: `Reason: ${reason}`,
      variant: "destructive"
    });
  };

  const handleCompletePicking = () => {
    if (currentPickingOrder) {
      completePicking(currentPickingOrder.id);
      toast({
        title: "Order Completed!",
        description: "Order sent to packing queue",
      });
      setActiveTab('orders');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Industry-specific configurations
  const industryConfig = {
    grocery: { 
      icon: ShoppingCart, 
      color: 'bg-green-600',
      name: 'Grocery Store'
    },
    pharmacy: { 
      icon: Package, 
      color: 'bg-blue-600',
      name: 'Pharmacy'
    },
    electronics: { 
      icon: BarChart3, 
      color: 'bg-purple-600',
      name: 'Electronics'
    }
  };

  const config = industryConfig[currentIndustry] || industryConfig.grocery;
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-lg ${config.color}`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Picker Dashboard</h1>
                <p className="text-sm text-gray-600">{config.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'P'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name || 'Picker'}</span>
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
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Assigned Orders</p>
                  <p className="text-2xl font-bold">{assignedOrders.length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Picking</p>
                  <p className="text-2xl font-bold">{currentPickingOrder ? 1 : 0}</p>
                </div>
                <Search className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Items Today</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Time</p>
                  <p className="text-2xl font-bold">8m</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Assigned Orders</span>
            </TabsTrigger>
            <TabsTrigger value="picking" className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Active Picking</span>
            </TabsTrigger>
            <TabsTrigger value="scanner" className="flex items-center space-x-2">
              <Scan className="w-4 h-4" />
              <span>Barcode Scanner</span>
            </TabsTrigger>
          </TabsList>

          {/* Assigned Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Assigned Orders</h2>
              <Badge variant="outline" className="px-3 py-1">
                {assignedOrders.length} orders pending
              </Badge>
            </div>

            {assignedOrders.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Assigned</h3>
                  <p className="text-gray-600">
                    New orders will appear here when assigned to you.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {assignedOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onStartPicking={handleStartPicking}
                    disabled={!!currentPickingOrder}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Picking Tab */}
          <TabsContent value="picking" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Picking</h2>
            
            {currentPickingOrder ? (
              <div className="space-y-6">
                <ProgressTracker 
                  order={currentPickingOrder}
                  progress={pickingProgress[currentPickingOrder.id]}
                />
                
                <PickingList 
                  order={currentPickingOrder}
                  onScanItem={handleScanItem}
                  onMarkOutOfStock={handleMarkOutOfStock}
                  onComplete={handleCompletePicking}
                  scannedItems={scannedItems}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Picking</h3>
                  <p className="text-gray-600">
                    Start picking an order from the Assigned Orders tab.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('orders')} 
                    className="mt-4"
                  >
                    View Orders
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Barcode Scanner Tab */}
          <TabsContent value="scanner" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Barcode Scanner</h2>
            
            <BarcodeScanner 
              currentOrder={currentPickingOrder}
              onScanSuccess={handleScanItem}
              onScanError={(error) => {
                toast({
                  title: "Scan Error",
                  description: error,
                  variant: "destructive"
                });
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PickerDashboard;