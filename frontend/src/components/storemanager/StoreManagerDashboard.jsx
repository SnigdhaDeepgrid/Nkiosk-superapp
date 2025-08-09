import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Store, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Search,
  Filter,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../../hooks/use-toast';

const StoreManagerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "Successfully logged out from your account",
    });
    navigate('/login');
  };

  // Mock store data
  const storeStats = {
    totalRevenue: 12750.50,
    todayOrders: 23,
    pendingOrders: 5,
    lowStockItems: 8,
    totalProducts: 156,
    activeStaff: 6
  };

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      items: ["Organic Apples", "Milk", "Bread"],
      total: 18.50,
      status: "pending",
      time: "2 min ago"
    },
    {
      id: "ORD-002", 
      customer: "Sarah Johnson",
      items: ["Coffee", "Yogurt"],
      total: 12.99,
      status: "preparing",
      time: "5 min ago"
    },
    {
      id: "ORD-003",
      customer: "Mike Wilson",
      items: ["Vegetables Mix"],
      total: 8.75,
      status: "ready",
      time: "10 min ago"
    }
  ];

  const inventoryItems = [
    {
      id: 1,
      name: "Organic Apples",
      category: "Fruits",
      stock: 45,
      lowThreshold: 20,
      price: 4.99,
      status: "good"
    },
    {
      id: 2,
      name: "Whole Milk",
      category: "Dairy",
      stock: 8,
      lowThreshold: 15,
      price: 3.99,
      status: "low"
    },
    {
      id: 3,
      name: "Fresh Bread",
      category: "Bakery",
      stock: 0,
      lowThreshold: 10,
      price: 2.50,
      status: "out"
    }
  ];

  const staffMembers = [
    {
      id: 1,
      name: "Alice Cooper",
      role: "Cashier",
      status: "active",
      shift: "Morning",
      avatar: null
    },
    {
      id: 2,
      name: "Bob Turner",
      role: "Stock Clerk", 
      status: "active",
      shift: "Evening",
      avatar: null
    },
    {
      id: 3,
      name: "Carol Davis",
      role: "Assistant Manager",
      status: "break",
      shift: "Full Day",
      avatar: null
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      good: "bg-green-100 text-green-800",
      low: "bg-yellow-100 text-yellow-800", 
      out: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      break: "bg-yellow-100 text-yellow-800",
      offline: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const updateOrderStatus = (orderId, newStatus) => {
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Store Manager</h1>
                <p className="text-slate-600">Downtown Store - {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 pl-3 border-l">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="staff" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Revenue</p>
                      <p className="text-2xl font-bold text-green-800">${storeStats.totalRevenue}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Today Orders</p>
                      <p className="text-2xl font-bold text-blue-800">{storeStats.todayOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Pending</p>
                      <p className="text-2xl font-bold text-yellow-800">{storeStats.pendingOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Low Stock</p>
                      <p className="text-2xl font-bold text-red-800">{storeStats.lowStockItems}</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Products</p>
                      <p className="text-2xl font-bold text-purple-800">{storeStats.totalProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-indigo-600">Staff</p>
                      <p className="text-2xl font-bold text-indigo-800">{storeStats.activeStaff}</p>
                    </div>
                    <Users className="w-8 h-8 text-indigo-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{order.id}</p>
                          <p className="text-sm text-slate-600">{order.customer}</p>
                          <p className="text-xs text-slate-500">{order.items.join(', ')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-800">${order.total}</p>
                        <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                        <p className="text-xs text-slate-500">{order.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search orders..." className="pl-9 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-800">{order.id}</h3>
                          <p className="text-sm text-slate-600">{order.customer} • {order.time}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">${order.total}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-slate-600">Items: {order.items.join(', ')}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {order.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                            >
                              Start Preparing
                            </Button>
                          )}
                          {order.status === 'preparing' && (
                            <Button 
                              size="sm" 
                              className="bg-green-600"
                              onClick={() => updateOrderStatus(order.id, 'ready')}
                            >
                              Mark Ready
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Inventory Management</CardTitle>
                  <Button size="sm" className="bg-purple-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryItems.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-slate-800">{item.name}</h3>
                          <p className="text-sm text-slate-600">{item.category}</p>
                          <p className="text-lg font-bold text-green-600">${item.price}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-slate-800">{item.stock}</p>
                          <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                            {item.status === 'good' ? 'In Stock' : 
                             item.status === 'low' ? 'Low Stock' : 'Out of Stock'}
                          </Badge>
                          <p className="text-xs text-slate-500">Min: {item.lowThreshold}</p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="bg-blue-600">
                          Update Stock
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Staff Management</CardTitle>
                  <Button size="sm" className="bg-indigo-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Staff
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {staffMembers.map((staff) => (
                    <Card key={staff.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={staff.avatar} />
                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                              {staff.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-slate-800">{staff.name}</h3>
                            <p className="text-sm text-slate-600">{staff.role}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Status:</span>
                            <Badge className={`text-xs ${getStatusColor(staff.status)}`}>
                              {staff.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-600">Shift:</span>
                            <span className="text-sm font-medium">{staff.shift}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
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