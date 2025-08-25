import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package2, 
  Truck, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  QrCode,
  User,
  LogOut,
  Bell,
  Box,
  Tag
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { usePickerPacker } from '../../contexts/PickerPackerContext';
import { createPackerSocket } from '../../services/mockPickerPackerSocket';

// Import packer components
import PackingQueueCard from './PackingQueueCard';
import PackingWorkflow from './PackingWorkflow';
import LabelGenerator from './LabelGenerator';
import ExceptionHandler from './ExceptionHandler';

const PackerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('queue');

  // Packer context
  const {
    packingQueue,
    currentPackingOrder,
    packingProgress,
    packageTypes,
    generatedLabels,
    currentIndustry,
    websocket,
    setPackingQueue,
    startPackingOrder,
    markItemPacked,
    generateLabel,
    completePacking,
    setWorker,
    setWebSocket,
    setIndustry
  } = usePickerPacker();

  // Initialize packer data and WebSocket
  useEffect(() => {
    // Set worker info
    setWorker(user?.id || 'packer_001', 'packer');
    
    // Set industry based on user role or default
    const industry = user?.industry || 'grocery';
    setIndustry(industry);

    // Initialize mock packing queue
    const mockPackingQueue = [
      {
        id: 'ORD_001',
        customerName: 'Sarah Wilson',
        industry: industry,
        priority: 'high',
        completedPickingAt: new Date(Date.now() - 5 * 60 * 1000),
        pickingProgress: {
          totalItems: 6,
          pickedItems: 5,
          outOfStockItems: 1
        },
        items: [
          { id: 'item_001', name: 'Organic Bananas', quantity: 2, unit: 'bunch', status: 'picked', packageType: null },
          { id: 'item_002', name: 'Whole Milk', quantity: 1, unit: 'gallon', status: 'picked', packageType: null },
          { id: 'item_003', name: 'Bread - Whole Wheat', quantity: 1, unit: 'loaf', status: 'picked', packageType: null },
          { id: 'item_004', name: 'Greek Yogurt', quantity: 3, unit: 'container', status: 'picked', packageType: null },
          { id: 'item_005', name: 'Apples - Gala', quantity: 1, unit: 'bag', status: 'out_of_stock', reason: 'Temporarily unavailable' },
          { id: 'item_006', name: 'Orange Juice', quantity: 1, unit: 'bottle', status: 'picked', packageType: null }
        ],
        deliveryAddress: '123 Main St, Downtown'
      },
      {
        id: 'ORD_002',
        customerName: 'David Chen',
        industry: industry,
        priority: 'normal',
        completedPickingAt: new Date(Date.now() - 10 * 60 * 1000),
        pickingProgress: {
          totalItems: 4,
          pickedItems: 4,
          outOfStockItems: 0
        },
        items: [
          { id: 'med_001', name: 'Vitamin D3 Supplements', quantity: 1, unit: 'bottle', status: 'picked', packageType: null },
          { id: 'med_002', name: 'Pain Relief Gel', quantity: 1, unit: 'tube', status: 'picked', packageType: null },
          { id: 'med_003', name: 'Hand Sanitizer', quantity: 2, unit: 'bottle', status: 'picked', packageType: null },
          { id: 'med_004', name: 'First Aid Kit', quantity: 1, unit: 'kit', status: 'picked', packageType: null }
        ],
        deliveryAddress: '456 Oak Avenue, Midtown'
      }
    ];
    setPpackingQueue(mockPackingQueue);

    // Initialize WebSocket
    const ws = createPackerSocket(user?.id || 'packer_001');
    setWebSocket(ws);

    // Listen for WebSocket events
    ws.on('order_ready_for_packing', (order) => {
      setPpackingQueue(prev => [...prev, order]);
      toast({
        title: "New Order Ready",
        description: `Order for ${order.customerName} ready for packing`,
      });
    });

    ws.on('item_status_synced', (sync) => {
      toast({
        title: "Item Status Updated",
        description: `${sync.status === 'picked' ? 'Item picked' : 'Item marked out of stock'}`,
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

  const handleStartPacking = (order) => {
    startPackingOrder(order);
    setActiveTab('packing');
    toast({
      title: "Started Packing",
      description: `Packing order for ${order.customerName}`,
    });
  };

  const handleMarkItemPacked = (orderId, itemId, packageType) => {
    markItemPacked(orderId, itemId, packageType);
    toast({
      title: "Item Packed",
      description: `Item packed in ${packageType}`,
    });
  };

  const handleGenerateLabel = (orderId) => {
    const labelData = generateLabel(orderId);
    toast({
      title: "Label Generated",
      description: `Label ${labelData.labelId} created successfully`,
    });
    return labelData;
  };

  const handleCompletePacking = () => {
    if (currentPackingOrder) {
      completePacking(currentPackingOrder.id);
      toast({
        title: "Packing Complete!",
        description: "Order ready for delivery handover",
      });
      setActiveTab('queue');
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
      icon: Package2, 
      color: 'bg-green-600',
      name: 'Grocery Store'
    },
    pharmacy: { 
      icon: Box, 
      color: 'bg-blue-600',
      name: 'Pharmacy'
    },
    electronics: { 
      icon: Package2, 
      color: 'bg-purple-600',
      name: 'Electronics'
    }
  };

  const config = industryConfig[currentIndustry] || industryConfig.grocery;
  const IconComponent = config.icon;

  // Calculate statistics
  const totalInQueue = packingQueue.length;
  const urgentOrders = packingQueue.filter(order => order.priority === 'urgent' || order.priority === 'high').length;
  const avgWaitTime = packingQueue.length > 0 
    ? Math.round(packingQueue.reduce((sum, order) => 
        sum + (new Date() - order.completedPickingAt) / (1000 * 60), 0
      ) / packingQueue.length)
    : 0;

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
                <h1 className="text-xl font-bold text-gray-900">Packer Dashboard</h1>
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
                <span className="text-sm font-medium">{user?.name || 'Packer'}</span>
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
                  <p className="text-sm text-gray-600">Packing Queue</p>
                  <p className="text-2xl font-bold">{totalInQueue}</p>
                </div>
                <Package2 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">High Priority</p>
                  <p className="text-2xl font-bold">{urgentOrders}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Packing</p>
                  <p className="text-2xl font-bold">{currentPackingOrder ? 1 : 0}</p>
                </div>
                <Box className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Wait Time</p>
                  <p className="text-2xl font-bold">{avgWaitTime}m</p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="queue" className="flex items-center space-x-2">
              <Package2 className="w-4 h-4" />
              <span>Packing Queue</span>
            </TabsTrigger>
            <TabsTrigger value="packing" className="flex items-center space-x-2">
              <Box className="w-4 h-4" />
              <span>Active Packing</span>
            </TabsTrigger>
            <TabsTrigger value="labels" className="flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>Label Generator</span>
            </TabsTrigger>
            <TabsTrigger value="exceptions" className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Exceptions</span>
            </TabsTrigger>
          </TabsList>

          {/* Packing Queue Tab */}
          <TabsContent value="queue" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Packing Queue</h2>
              <Badge variant="outline" className="px-3 py-1">
                {totalInQueue} orders ready
              </Badge>
            </div>

            {packingQueue.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package2 className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders in Queue</h3>
                  <p className="text-gray-600">
                    Orders from the picker will appear here when ready for packing.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {packingQueue.map((order) => (
                  <PackingQueueCard
                    key={order.id}
                    order={order}
                    onStartPacking={handleStartPacking}
                    disabled={!!currentPackingOrder}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Active Packing Tab */}
          <TabsContent value="packing" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Active Packing</h2>
            
            {currentPackingOrder ? (
              <PackingWorkflow 
                order={currentPackingOrder}
                progress={packingProgress[currentPackingOrder.id]}
                packageTypes={packageTypes}
                onMarkItemPacked={handleMarkItemPacked}
                onGenerateLabel={handleGenerateLabel}
                onComplete={handleCompletePacking}
              />
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Box className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Packing</h3>
                  <p className="text-gray-600">
                    Start packing an order from the Packing Queue tab.
                  </p>
                  <Button 
                    onClick={() => setActiveTab('queue')} 
                    className="mt-4"
                  >
                    View Queue
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Label Generator Tab */}
          <TabsContent value="labels" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Label Generator</h2>
            
            <LabelGenerator 
              generatedLabels={generatedLabels}
              onGenerateLabel={handleGenerateLabel}
            />
          </TabsContent>

          {/* Exceptions Tab */}
          <TabsContent value="exceptions" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Exception Handling</h2>
            
            <ExceptionHandler 
              packingQueue={packingQueue}
              currentOrder={currentPackingOrder}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PackerDashboard;