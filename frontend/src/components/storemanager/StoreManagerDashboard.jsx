import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Store,
  Users,
  Package,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Settings,
  Bell,
  LogOut,
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Plus
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../../hooks/use-toast';

const StoreManagerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      // Call backend logout API
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      if (token) {
        await fetch(`${backendUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.log('Logout API error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    toast({
      title: "Logged Out",
      description: "Successfully logged out from your account",
    });
    
    // Redirect to homepage
    navigate('/');
  };

  // Mock store data
  const storeStats = {
    dailySales: 2450.75,
    totalOrders: 45,
    activeStaff: 12,
    inventoryAlerts: 8,
    customerSatisfaction: 4.7,
    weeklyGrowth: 12.5
  };

  const recentOrders = [
    { id: '#001', customer: 'John Doe', items: 3, total: 45.99, status: 'Processing', time: '10:30 AM' },
    { id: '#002', customer: 'Jane Smith', items: 1, total: 12.50, status: 'Completed', time: '10:15 AM' },
    { id: '#003', customer: 'Mike Johnson', items: 5, total: 78.25, status: 'Preparing', time: '10:00 AM' },
    { id: '#004', customer: 'Sarah Wilson', items: 2, total: 23.75, status: 'Completed', time: '9:45 AM' }
  ];

  const inventoryAlerts = [
    { product: 'Organic Apples', stock: 5, status: 'low', threshold: 10 },
    { product: 'Whole Wheat Bread', stock: 2, status: 'critical', threshold: 5 },
    { product: 'Fresh Milk', stock: 8, status: 'low', threshold: 15 },
    { product: 'Greek Yogurt', stock: 1, status: 'critical', threshold: 5 }
  ];

  const staffMembers = [
    { name: 'Alice Cooper', role: 'Cashier', status: 'active', shift: 'Morning' },
    { name: 'Bob Martin', role: 'Stock Clerk', status: 'active', shift: 'Morning' },
    { name: 'Carol Davis', role: 'Supervisor', status: 'active', shift: 'Afternoon' },
    { name: 'David Lee', role: 'Cashier', status: 'break', shift: 'Afternoon' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Preparing': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Store Manager</h1>
                  <p className="text-xs text-slate-500">Downtown QuickMart</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="bg-green-500 text-white text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">Store Manager</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-slate-500">Daily Sales</p>
                      <p className="text-2xl font-bold text-slate-800">${storeStats.dailySales}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-500">Orders Today</p>
                      <p className="text-2xl font-bold text-slate-800">{storeStats.totalOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-slate-500">Active Staff</p>
                      <p className="text-2xl font-bold text-slate-800">{storeStats.activeStaff}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-slate-500">Inventory Alerts</p>
                      <p className="text-2xl font-bold text-slate-800">{storeStats.inventoryAlerts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-slate-500">Satisfaction</p>
                      <p className="text-2xl font-bold text-slate-800">{storeStats.customerSatisfaction}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                    <div>
                      <p className="text-sm text-slate-500">Weekly Growth</p>
                      <p className="text-2xl font-bold text-slate-800">{storeStats.weeklyGrowth}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.id} - {order.customer}</p>
                          <p className="text-sm text-slate-500">{order.items} items • {order.time}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="text-sm font-medium mt-1">${order.total}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Inventory Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {inventoryAlerts.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.product}</p>
                          <p className="text-sm text-slate-500">Stock: {item.stock} units</p>
                        </div>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Today's Orders</CardTitle>
                <CardDescription>Manage and track all store orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{order.id} - {order.customer}</h4>
                          <p className="text-sm text-slate-500">Items: {order.items} • Time: {order.time}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <p className="font-bold">${order.total}</p>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Monitor stock levels and manage products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryAlerts.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.product}</h4>
                          <p className="text-sm text-slate-500">
                            Current Stock: {item.stock} • Threshold: {item.threshold}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Monitor staff schedules and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffMembers.map((staff, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-green-500 text-white">
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{staff.name}</h4>
                            <p className="text-sm text-slate-500">{staff.role} • {staff.shift} Shift</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(staff.status)}>{staff.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Store Analytics</CardTitle>
                <CardDescription>Performance metrics and insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Sales Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Daily Target</span>
                        <span className="text-sm font-medium">$3,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Current Sales</span>
                        <span className="text-sm font-medium">${storeStats.dailySales}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Achievement</span>
                        <span className="text-sm font-medium text-green-600">82%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Customer Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Satisfaction Rating</span>
                        <span className="text-sm font-medium">{storeStats.customerSatisfaction}/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Weekly Growth</span>
                        <span className="text-sm font-medium text-green-600">+{storeStats.weeklyGrowth}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Return Customers</span>
                        <span className="text-sm font-medium">68%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StoreManagerDashboard;