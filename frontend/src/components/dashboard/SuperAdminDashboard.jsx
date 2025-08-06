import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Store,
  Users,
  Package,
  ShoppingCart,
  Truck,
  BarChart3,
  HeadphonesIcon,
  Tag,
  Shield,
  Bell,
  Plus,
  TrendingUp,
  DollarSign,
  Clock,
  UserCheck
} from 'lucide-react';
import DashboardLayout from '../layout/DashboardLayout';
import BusinessUserManagement from '../superadmin/BusinessUserManagement';
import OutletManagement from '../superadmin/OutletManagement';
import ProductManagement from '../superadmin/ProductManagement';
import OrderManagement from '../superadmin/OrderManagement';
import DeliveryManagement from '../superadmin/DeliveryManagement';
import BusinessAnalytics from '../superadmin/BusinessAnalytics';
import CustomerManagement from '../superadmin/CustomerManagement';
import PromotionManagement from '../superadmin/PromotionManagement';
import AuditLogs from '../superadmin/AuditLogs';
import { useToast } from '../../hooks/use-toast';

const SuperAdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Mock dashboard data
  const dashboardStats = {
    totalRevenue: 45678.90,
    revenueGrowth: 12.5,
    totalOrders: 1234,
    pendingOrders: 23,
    activeCustomers: 567,
    outletCount: 8,
    productCount: 245,
    staffCount: 32
  };

  const recentOrders = [
    {
      id: "ord_001",
      orderNumber: "ORD-2024-001",
      customerName: "Alice Johnson",
      total: 27.72,
      status: "delivered",
      outlet: "Downtown Store",
      time: "2 hours ago"
    },
    {
      id: "ord_002", 
      orderNumber: "ORD-2024-002",
      customerName: "Bob Smith",
      total: 18.02,
      status: "out_for_delivery",
      outlet: "Mall Branch",
      time: "45 minutes ago"
    },
    {
      id: "ord_003",
      orderNumber: "ORD-2024-003", 
      customerName: "Carol Wilson",
      total: 35.50,
      status: "preparing",
      outlet: "Downtown Store",
      time: "30 minutes ago"
    }
  ];

  const topProducts = [
    { name: "Organic Apples", sales: 450, revenue: 1795.50 },
    { name: "Premium Coffee", sales: 120, revenue: 1558.80 },
    { name: "Whole Wheat Bread", sales: 230, revenue: 1035.00 }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout user={user} activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-1">Business Dashboard</h1>
            <p className="text-slate-600">Manage your business operations, staff, and customer experience</p>
          </div>
          <Button 
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white gap-2 px-6 h-11 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="w-4 h-4" />
            View Orders
          </Button>
        </div>

        {/* Main Content */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl border-0 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b border-slate-200/60 bg-gradient-to-r from-white/90 to-green-50/30 px-6 pt-6">
              <TabsList className="grid w-full max-w-6xl grid-cols-5 lg:grid-cols-10 bg-slate-100/80 p-1 rounded-xl">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="staff" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Staff
                </TabsTrigger>
                <TabsTrigger 
                  value="outlets" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Outlets
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger 
                  value="orders" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Orders
                </TabsTrigger>
                <TabsTrigger 
                  value="delivery" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Delivery
                </TabsTrigger>
                <TabsTrigger 
                  value="customers" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Customers
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Analytics
                </TabsTrigger>
                <TabsTrigger 
                  value="promotions" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Promotions
                </TabsTrigger>
                <TabsTrigger 
                  value="audit" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 rounded-lg text-xs font-medium"
                >
                  Audit
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview Tab */}
            <TabsContent value="overview" className="p-6 space-y-6 mt-0">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <DollarSign className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center text-emerald-600">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">{dashboardStats.revenueGrowth}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-emerald-700 text-sm font-medium mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-emerald-900">
                        ${dashboardStats.totalRevenue.toLocaleString()}
                      </p>
                      <p className="text-emerald-600 text-xs mt-1">This month</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <ShoppingCart className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-0">
                        {dashboardStats.pendingOrders} pending
                      </Badge>
                    </div>
                    <div>
                      <p className="text-blue-700 text-sm font-medium mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {dashboardStats.totalOrders.toLocaleString()}
                      </p>
                      <p className="text-blue-600 text-xs mt-1">All time</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <UserCheck className="w-6 h-6 text-white" />
                      </div>
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <p className="text-purple-700 text-sm font-medium mb-1">Active Customers</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {dashboardStats.activeCustomers.toLocaleString()}
                      </p>
                      <p className="text-purple-600 text-xs mt-1">This month</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Store className="w-6 h-6 text-white" />
                      </div>
                      <Badge className="bg-orange-100 text-orange-700 border-0">
                        Active
                      </Badge>
                    </div>
                    <div>
                      <p className="text-orange-700 text-sm font-medium mb-1">Business Outlets</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {dashboardStats.outletCount}
                      </p>
                      <p className="text-orange-600 text-xs mt-1">Locations</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <Card className="lg:col-span-2 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                              #{order.orderNumber.slice(-3)}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{order.customerName}</p>
                              <p className="text-sm text-slate-600">{order.outlet} • {order.time}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-slate-900">${order.total}</p>
                            <Badge className={`${getStatusColor(order.status)} border-0 text-xs`}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('orders')}
                    >
                      View All Orders
                    </Button>
                  </CardContent>
                </Card>

                {/* Top Products */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Top Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topProducts.map((product, index) => (
                        <div key={product.name} className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                            index === 0 ? 'bg-yellow-500' :
                            index === 1 ? 'bg-gray-400' :
                            'bg-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-slate-900 text-sm">{product.name}</p>
                            <p className="text-xs text-slate-600">{product.sales} sold</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900 text-sm">${product.revenue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => setActiveTab('products')}
                    >
                      View All Products
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-green-50">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button 
                      variant="outline" 
                      className="gap-2 p-4 h-auto flex-col hover:bg-green-50"
                      onClick={() => setActiveTab('staff')}
                    >
                      <Users className="w-6 h-6 text-green-600" />
                      <div>
                        <p className="font-semibold">Manage Staff</p>
                        <p className="text-xs text-slate-500">Add or edit team members</p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="gap-2 p-4 h-auto flex-col hover:bg-blue-50"
                      onClick={() => setActiveTab('outlets')}
                    >
                      <Store className="w-6 h-6 text-blue-600" />
                      <div>
                        <p className="font-semibold">Add Outlet</p>
                        <p className="text-xs text-slate-500">Create new location</p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="gap-2 p-4 h-auto flex-col hover:bg-purple-50"
                      onClick={() => setActiveTab('products')}
                    >
                      <Package className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-semibold">Add Product</p>
                        <p className="text-xs text-slate-500">Expand your catalog</p>
                      </div>
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="gap-2 p-4 h-auto flex-col hover:bg-orange-50"
                      onClick={() => setActiveTab('analytics')}
                    >
                      <BarChart3 className="w-6 h-6 text-orange-600" />
                      <div>
                        <p className="font-semibold">View Analytics</p>
                        <p className="text-xs text-slate-500">Business insights</p>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other Tab Contents */}
            <TabsContent value="staff" className="p-6 space-y-6 mt-0">
              <BusinessUserManagement />
            </TabsContent>

            <TabsContent value="outlets" className="p-6 space-y-6 mt-0">
              <OutletManagement />
            </TabsContent>

            <TabsContent value="products" className="p-6 space-y-6 mt-0">
              <ProductManagement />
            </TabsContent>

            <TabsContent value="orders" className="p-6 space-y-6 mt-0">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="delivery" className="p-6 space-y-6 mt-0">
              <DeliveryManagement />
            </TabsContent>

            <TabsContent value="customers" className="p-6 space-y-6 mt-0">
              <CustomerManagement />
            </TabsContent>

            <TabsContent value="analytics" className="p-6 space-y-6 mt-0">
              <BusinessAnalytics />
            </TabsContent>

            <TabsContent value="promotions" className="p-6 space-y-6 mt-0">
              <PromotionManagement />
            </TabsContent>

            <TabsContent value="audit" className="p-6 space-y-6 mt-0">
              <AuditLogs />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SuperAdminDashboard;