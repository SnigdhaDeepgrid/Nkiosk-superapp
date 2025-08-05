import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  Settings, 
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Globe,
  Activity
} from 'lucide-react';
import { Input } from '../ui/input';
import { mockData } from '../../data/mockData';

const SaasAdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    {
      title: 'Active Tenants',
      value: mockData.tenants.filter(t => t.status === 'active').length,
      total: mockData.tenants.length,
      icon: Building2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Users',
      value: mockData.analytics.totalUsers.toLocaleString(),
      change: '+12%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Monthly Revenue',
      value: `$${mockData.analytics.monthlyRevenue.toLocaleString()}`,
      change: '+18%',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'System Health',
      value: '99.9%',
      status: 'Optimal',
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    }
  ];

  const filteredTenants = mockData.tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">SaaS Administration</h1>
          <p className="text-slate-600 mt-1">Manage tenants, users, and platform settings</p>
        </div>
        <Button className="bg-slate-900 hover:bg-slate-800 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add New Tenant
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    {stat.change && (
                      <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-0">
                        {stat.change}
                      </Badge>
                    )}
                    {stat.status && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-0">
                        {stat.status}
                      </Badge>
                    )}
                  </div>
                  {stat.total && (
                    <p className="text-xs text-slate-500">of {stat.total} total</p>
                  )}
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Overview
          </TabsTrigger>
          <TabsTrigger value="tenants" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Tenants
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="w-5 h-5 text-slate-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900 font-medium">{activity.action}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5 text-slate-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.systemStatus.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          service.status === 'operational' ? 'bg-green-500' :
                          service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="font-medium text-slate-900">{service.name}</span>
                      </div>
                      <Badge 
                        variant={service.status === 'operational' ? 'secondary' : 'destructive'}
                        className={`${
                          service.status === 'operational' 
                            ? 'bg-green-100 text-green-700 border-0' 
                            : service.status === 'degraded'
                            ? 'bg-yellow-100 text-yellow-700 border-0'
                            : 'bg-red-100 text-red-700 border-0'
                        }`}
                      >
                        {service.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tenants" className="space-y-6 mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Tenant Management</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                      placeholder="Search tenants..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTenants.map((tenant) => (
                  <div key={tenant.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{tenant.name}</h3>
                        <p className="text-sm text-slate-600">{tenant.domain}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-slate-500">{tenant.users} users</span>
                          <span className="text-xs text-slate-500">Created {tenant.createdAt}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={tenant.status === 'active' ? 'secondary' : 'destructive'}
                        className={`${
                          tenant.status === 'active' 
                            ? 'bg-green-100 text-green-700 border-0' 
                            : 'bg-red-100 text-red-700 border-0'
                        }`}
                      >
                        {tenant.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Platform Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Total Orders</span>
                    <span className="font-semibold">45,672</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Avg Order Value</span>
                    <span className="font-semibold">$34.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Success Rate</span>
                    <span className="font-semibold">98.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.revenueByCategory.map((category, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-slate-600">{category.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">${category.revenue.toLocaleString()}</span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
                          {category.percentage}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Platform Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Global Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          API Rate Limits
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Payment Gateway
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Email Templates
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          Access Control
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Audit Logs
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          Data Retention
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaasAdminDashboard;