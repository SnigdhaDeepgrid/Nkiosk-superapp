import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Package, 
  Clock, 
  MapPin,
  Bell,
  User,
  LogOut,
  Plus,
  Eye
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import { useOrderWorkflow, CATEGORIES } from '../../contexts/OrderWorkflowContext';
import { createWorkflowWebSocket } from '../../services/workflowWebSocket';

import OrderPlacement from '../workflow/OrderPlacement';
import OrderTracker from '../workflow/OrderTracker';

const EnhancedCustomerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('shop');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.GROCERY);

  const {
    customerOrders,
    notifications,
    setUserContext,
    connectWebSocket
  } = useOrderWorkflow();

  const customerId = user?.id || 'customer_001';
  const userOrders = customerOrders[customerId] || [];

  useEffect(() => {
    // Set user context
    setUserContext(user, 'customer');

    // Connect WebSocket
    const ws = createWorkflowWebSocket(customerId, 'customer');
    connectWebSocket(ws);

    // Listen for order updates
    ws.on('order.status.update', (data) => {
      toast({
        title: "Order Update",
        description: data.message,
      });
    });

    ws.on('order.picker.assigned', (data) => {
      toast({
        title: "Picker Assigned",
        description: `${data.pickerName} is now picking your order`,
      });
    });

    ws.on('order.ready.for.delivery', (data) => {
      toast({
        title: "Out for Delivery",
        description: `${data.riderName} is delivering your order`,
      });
    });

    return () => {
      ws.cleanup();
    };
  }, []);

  const handleOrderPlaced = (orderData) => {
    setActiveTab('orders');
    toast({
      title: "Order Placed!",
      description: `Your ${orderData.category} order has been placed successfully`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const getActiveOrders = () => {
    return userOrders.filter(order => 
      !['delivered', 'cancelled'].includes(order.status)
    );
  };

  const getCompletedOrders = () => {
    return userOrders.filter(order => 
      ['delivered', 'cancelled'].includes(order.status)
    );
  };

  const categoryOptions = [
    {
      id: CATEGORIES.GROCERY,
      title: 'Grocery Store',
      icon: '🛒',
      description: 'Fresh groceries and daily essentials',
      color: 'from-green-500 to-green-700'
    },
    {
      id: CATEGORIES.PHARMACY,
      title: 'Pharmacy',
      icon: '💊',
      description: 'Medicines and health products',
      color: 'from-blue-500 to-blue-700'
    },
    {
      id: CATEGORIES.ELECTRONICS,
      title: 'Electronics',
      icon: '📱',
      description: 'Tech gadgets and accessories',
      color: 'from-purple-500 to-purple-700'
    },
    {
      id: CATEGORIES.FOOD_DELIVERY,
      title: 'Food Delivery',
      icon: '🍔',
      description: 'Restaurant food delivery',
      color: 'from-orange-500 to-orange-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">🛒 nKiosk</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-4 h-4" />
                {notifications.filter(n => n.userId === customerId).length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-red-500">
                    {notifications.filter(n => n.userId === customerId).length}
                  </Badge>
                )}
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'C'}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{user?.name || 'Customer'}</span>
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
                  <p className="text-sm text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold">{getActiveOrders().length}</p>
                </div>
                <Package className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{userOrders.length}</p>
                </div>
                <ShoppingCart className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">₹{
                    userOrders
                      .filter(o => new Date(o.createdAt).getMonth() === new Date().getMonth())
                      .reduce((sum, o) => sum + o.totalAmount, 0)
                  }</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Delivery</p>
                  <p className="text-2xl font-bold">32m</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="shop" className="flex items-center space-x-2">
              <ShoppingCart className="w-4 h-4" />
              <span>Shop</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </TabsTrigger>
            <TabsTrigger value="track" className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>Track Orders</span>
            </TabsTrigger>
          </TabsList>

          {/* Shop Tab */}
          <TabsContent value="shop" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
            
            {/* Category Selection */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {categoryOptions.map((category) => (
                <Card 
                  key={category.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedCategory === category.id 
                      ? 'ring-2 ring-blue-500 shadow-lg' 
                      : ''
                  }`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${category.color} flex items-center justify-center mx-auto mb-4`}>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Placement */}
            <OrderPlacement 
              category={selectedCategory}
              customerId={customerId}
              onOrderPlaced={handleOrderPlaced}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Orders</h2>
            
            {/* Active Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Active Orders ({getActiveOrders().length})</CardTitle>
              </CardHeader>
              <CardContent>
                {getActiveOrders().length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Orders</h3>
                    <p className="text-gray-600 mb-4">Start shopping to place your first order</p>
                    <Button onClick={() => setActiveTab('shop')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {getActiveOrders().map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">Order #{order.id.slice(-6)}</h3>
                          <Badge className="capitalize">{order.status.replace(/_/g, ' ')}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Category</p>
                            <p className="font-medium capitalize">{order.category}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Items</p>
                            <p className="font-medium">{order.items?.length || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Total</p>
                            <p className="font-medium">₹{order.totalAmount}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Placed</p>
                            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <OrderTracker orderId={order.id} minimal={true} />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order History */}
            <Card>
              <CardHeader>
                <CardTitle>Order History ({getCompletedOrders().length})</CardTitle>
              </CardHeader>
              <CardContent>
                {getCompletedOrders().length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-600">No completed orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {getCompletedOrders().slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(-6)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.items?.length} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">₹{order.totalAmount}</p>
                          <Badge variant={order.status === 'delivered' ? 'default' : 'destructive'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Track Orders Tab */}
          <TabsContent value="track" className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Track Your Orders</h2>
            
            {getActiveOrders().length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders to Track</h3>
                  <p className="text-gray-600">Place an order to track its real-time progress</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {getActiveOrders().map((order) => (
                  <OrderTracker key={order.id} orderId={order.id} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default EnhancedCustomerDashboard;