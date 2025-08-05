import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  X,
  Building2,
  Users,
  ShoppingCart,
  Package,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Settings,
  Edit3
} from 'lucide-react';

const TenantDetails = ({ tenant, isOpen, onClose, onEdit }) => {
  if (!isOpen || !tenant) return null;

  const getStatusConfig = (status) => {
    const configs = {
      active: { color: 'bg-emerald-100 text-emerald-700', icon: '🟢', label: 'Active' },
      suspended: { color: 'bg-yellow-100 text-yellow-700', icon: '🟡', label: 'Suspended' },
      pending: { color: 'bg-blue-100 text-blue-700', icon: '🔵', label: 'Pending' },
      inactive: { color: 'bg-red-100 text-red-700', icon: '🔴', label: 'Inactive' }
    };
    return configs[status] || configs.pending;
  };

  const getBusinessTypeIcon = (type) => {
    const icons = {
      restaurant: '🍽️',
      grocery: '🥬',
      pharmacy: '💊',
      electronics: '📱',
      fashion: '👕',
      books: '📚',
      home_garden: '🏡',
      health_beauty: '💄',
      sports: '⚽',
      other: '🏪'
    };
    return icons[type] || '🏪';
  };

  const statusConfig = getStatusConfig(tenant.status);

  // Mock data for demonstration
  const tenantStats = {
    totalOrders: 1247,
    totalRevenue: 45679,
    activeProducts: 156,
    totalCustomers: 892,
    averageOrderValue: 36.65,
    conversionRate: 3.4
  };

  const recentOrders = [
    { id: '#ORD-001', customer: 'John Doe', amount: '$45.99', status: 'delivered', date: '2024-01-20' },
    { id: '#ORD-002', customer: 'Jane Smith', amount: '$32.50', status: 'processing', date: '2024-01-20' },
    { id: '#ORD-003', customer: 'Mike Johnson', amount: '$67.25', status: 'shipped', date: '2024-01-19' }
  ];

  const topProducts = [
    { name: 'Fresh Organic Apples', sales: 234, revenue: '$1,234' },
    { name: 'Whole Grain Bread', sales: 189, revenue: '$945' },
    { name: 'Premium Coffee Beans', sales: 156, revenue: '$2,340' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-blue-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <Avatar className="w-16 h-16 shadow-lg ring-4 ring-white">
                <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-green-600 text-white text-2xl">
                  {getBusinessTypeIcon(tenant.businessType)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-slate-900">{tenant.name}</h2>
                  <Badge className={`${statusConfig.color} border-0 font-medium`}>
                    {statusConfig.icon} {statusConfig.label}
                  </Badge>
                </div>
                
                <div className="space-y-1 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span>{tenant.domain}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span className="capitalize">{tenant.businessType?.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {tenant.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => onEdit(tenant)}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Tenant
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-white/80 rounded-xl"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-slate-100 rounded-xl">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
                Overview
              </TabsTrigger>
              <TabsTrigger value="contact" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
                Contact Info
              </TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
                Performance
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:text-blue-600 rounded-lg">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Total Orders', value: tenantStats.totalOrders, icon: ShoppingCart, color: 'text-blue-600' },
                  { label: 'Revenue', value: `$${tenantStats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600' },
                  { label: 'Products', value: tenantStats.activeProducts, icon: Package, color: 'text-purple-600' },
                  { label: 'Customers', value: tenantStats.totalCustomers, icon: Users, color: 'text-orange-600' },
                  { label: 'Avg Order', value: `$${tenantStats.averageOrderValue}`, icon: TrendingUp, color: 'text-indigo-600' },
                  { label: 'Conversion', value: `${tenantStats.conversionRate}%`, icon: Activity, color: 'text-pink-600' }
                ].map((stat, index) => (
                  <Card key={index} className="border-0 shadow-md bg-white/50">
                    <CardContent className="p-4 text-center">
                      <stat.icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                      <div className="font-bold text-lg text-slate-900">{stat.value}</div>
                      <div className="text-xs text-slate-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                      Recent Orders
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentOrders.map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                          <div>
                            <div className="font-medium text-sm">{order.id}</div>
                            <div className="text-xs text-slate-600">{order.customer}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-sm">{order.amount}</div>
                            <Badge className={`text-xs ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            } border-0`}>
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Top Products
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {topProducts.map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                          <div className="flex-1">
                            <div className="font-medium text-sm truncate">{product.name}</div>
                            <div className="text-xs text-slate-600">{product.sales} sales</div>
                          </div>
                          <div className="font-semibold text-sm text-green-600">{product.revenue}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { icon: Mail, label: 'Email', value: tenant.email },
                      { icon: Phone, label: 'Phone', value: tenant.phone },
                      { icon: Globe, label: 'Website', value: tenant.website },
                      { icon: Users, label: 'Contact Person', value: tenant.contactPerson }
                    ].filter(item => item.value).map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
                        <item.icon className="w-5 h-5 text-slate-400" />
                        <div>
                          <div className="text-sm font-medium text-slate-900">{item.label}</div>
                          <div className="text-sm text-slate-600">{item.value}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Address Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50">
                      <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                      <div>
                        <div className="text-sm font-medium text-slate-900">Business Address</div>
                        <div className="text-sm text-slate-600 space-y-1">
                          {tenant.address && <div>{tenant.address}</div>}
                          <div>
                            {[tenant.city, tenant.state, tenant.zipCode].filter(Boolean).join(', ')}
                          </div>
                          {tenant.country && <div>{tenant.country}</div>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6 mt-6">
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Performance Analytics</h3>
                <p className="text-slate-600 mb-4">
                  Detailed performance metrics and analytics will be displayed here
                </p>
                <Button variant="outline" className="rounded-xl">
                  View Full Analytics
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6 mt-6">
              <div className="text-center py-12">
                <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Tenant Settings</h3>
                <p className="text-slate-600 mb-4">
                  Tenant-specific configuration and settings will be managed here
                </p>
                <Button variant="outline" className="rounded-xl">
                  Manage Settings
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;