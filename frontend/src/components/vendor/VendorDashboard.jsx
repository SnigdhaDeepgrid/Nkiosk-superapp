import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Package,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Eye,
  Edit,
  Plus,
  Star,
  Settings,
  Bell,
  LogOut,
  Calendar,
  BarChart3,
  Users,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../../hooks/use-toast';

const VendorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = async () => {
    try {
      // Call backend logout API
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      
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

  // Mock vendor data
  const vendorStats = {
    totalProducts: 89,
    pendingOrders: 12,
    monthlyEarnings: 8765.43,
    inventoryValue: 23456.78,
    rating: 4.6,
    totalSales: 156
  };

  const recentOrders = [
    { id: '#VE001', product: 'Fresh Tomatoes', quantity: 5, total: 25.99, status: 'Processing', customer: 'QuickMart Downtown' },
    { id: '#VE002', product: 'Organic Lettuce', quantity: 10, total: 45.50, status: 'Shipped', customer: 'Fresh Market' },
    { id: '#VE003', product: 'Bell Peppers', quantity: 8, total: 32.75, status: 'Delivered', customer: 'Green Grocers' },
    { id: '#VE004', product: 'Cucumber Pack', quantity: 15, total: 67.25, status: 'Processing', customer: 'Healthy Foods Co' }
  ];

  const products = [
    { id: 1, name: 'Fresh Tomatoes', price: 5.20, stock: 45, status: 'active', sales: 234 },
    { id: 2, name: 'Organic Lettuce', price: 4.55, stock: 23, status: 'active', sales: 187 },
    { id: 3, name: 'Bell Peppers', price: 4.10, stock: 8, status: 'low_stock', sales: 156 },
    { id: 4, name: 'Cucumber Pack', price: 4.49, stock: 67, status: 'active', sales: 203 },
    { id: 5, name: 'Spinach Bunch', price: 3.25, stock: 2, status: 'critical', sales: 98 }
  ];

  const earnings = [
    { month: 'January', amount: 7245.32, orders: 89 },
    { month: 'February', amount: 8156.78, orders: 103 },
    { month: 'March', amount: 8765.43, orders: 124 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-yellow-100 text-yellow-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
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
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Vendor Portal</h1>
                  <p className="text-xs text-slate-500">Foodie Express</p>
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
                  <AvatarFallback className="bg-orange-500 text-white text-sm">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">Vendor</p>
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
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-slate-500">Total Products</p>
                      <p className="text-2xl font-bold text-slate-800">{vendorStats.totalProducts}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-500">Pending Orders</p>
                      <p className="text-2xl font-bold text-slate-800">{vendorStats.pendingOrders}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-slate-500">Monthly Earnings</p>
                      <p className="text-2xl font-bold text-slate-800">${vendorStats.monthlyEarnings}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-slate-500">Inventory Value</p>
                      <p className="text-2xl font-bold text-slate-800">${vendorStats.inventoryValue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-slate-500">Rating</p>
                      <p className="text-2xl font-bold text-slate-800">{vendorStats.rating}/5</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-teal-500" />
                    <div>
                      <p className="text-sm text-slate-500">Total Sales</p>
                      <p className="text-2xl font-bold text-slate-800">{vendorStats.totalSales}</p>
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
                    <ShoppingCart className="w-5 h-5" />
                    Recent Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 4).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{order.id} - {order.product}</p>
                          <p className="text-sm text-slate-500">Qty: {order.quantity} • {order.customer}</p>
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
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    Inventory Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.filter(p => p.status !== 'active').map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-slate-500">Stock: {product.stock} units • ${product.price}</p>
                        </div>
                        <Badge className={getStatusColor(product.status)}>
                          {product.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Catalog</CardTitle>
                <CardDescription>Manage your product listings and inventory</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-between items-center">
                  <Input placeholder="Search products..." className="max-w-sm" />
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-slate-500">
                            Price: ${product.price} • Stock: {product.stock} units • Sales: {product.sales}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(product.status)}>
                            {product.status.replace('_', ' ')}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order Management</CardTitle>
                <CardDescription>Track and manage your product orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{order.id} - {order.product}</h4>
                          <p className="text-sm text-slate-500">
                            Customer: {order.customer} • Quantity: {order.quantity}
                          </p>
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

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Overview</CardTitle>
                <CardDescription>Track your monthly earnings and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {earnings.map((earning, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium">{earning.month}</h4>
                        <p className="text-2xl font-bold text-green-600">${earning.amount}</p>
                        <p className="text-sm text-slate-500">{earning.orders} orders</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Payment History</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">March 2024 Payout</span>
                        <span className="text-sm font-medium text-green-600">+$8,765.43</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">February 2024 Payout</span>
                        <span className="text-sm font-medium text-green-600">+$8,156.78</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">January 2024 Payout</span>
                        <span className="text-sm font-medium text-green-600">+$7,245.32</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>Performance insights and trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Sales Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Best Selling Product</span>
                        <span className="text-sm font-medium">Fresh Tomatoes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Average Order Value</span>
                        <span className="text-sm font-medium">$42.87</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Customer Retention</span>
                        <span className="text-sm font-medium text-green-600">73%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Customer Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Vendor Rating</span>
                        <span className="text-sm font-medium">{vendorStats.rating}/5.0</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Customers</span>
                        <span className="text-sm font-medium">45</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Growth</span>
                        <span className="text-sm font-medium text-green-600">+15.2%</span>
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

export default VendorDashboard;