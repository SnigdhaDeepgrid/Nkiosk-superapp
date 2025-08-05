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
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Grid3X3,
  List
} from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockData } from '../../data/mockData';
import TenantForm from '../tenants/TenantForm';
import TenantCard from '../tenants/TenantCard';
import TenantDetails from '../tenants/TenantDetails';
import { useToast } from '../../hooks/use-toast';

const SaasAdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [tenants, setTenants] = useState(mockData.tenants);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [showTenantForm, setShowTenantForm] = useState(false);
  const [showTenantDetails, setShowTenantDetails] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const { toast } = useToast();

  const stats = [
    {
      title: 'Active Tenants',
      value: mockData.tenants.filter(t => t.status === 'active').length,
      total: mockData.tenants.length,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 this week',
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: mockData.analytics.totalUsers.toLocaleString(),
      change: '+12% from last month',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      changeType: 'positive'
    },
    {
      title: 'Monthly Revenue',
      value: `$${mockData.analytics.monthlyRevenue.toLocaleString()}`,
      change: '+18% from last month',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      changeType: 'positive'
    },
    {
      title: 'System Health',
      value: '99.9%',
      status: 'Operational',
      icon: Activity,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      changeType: 'stable'
    }
  ];

  const filteredTenants = mockData.tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">SaaS Administration</h1>
          <p className="text-slate-600">Manage tenants, users, and platform settings</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white gap-2 px-6 h-11 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <Plus className="w-4 h-4" />
          Add New Tenant
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {stat.changeType === 'positive' && (
                  <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              
              <div className="space-y-2">
                <p className="text-slate-600 text-sm font-medium">{stat.title}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  {stat.total && (
                    <span className="text-xs text-slate-500">of {stat.total}</span>
                  )}
                </div>
                
                {stat.change && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-emerald-600 font-medium bg-emerald-50 px-2 py-1 rounded-full">
                      {stat.change}
                    </span>
                  </div>
                )}
                
                {stat.status && (
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-xs text-emerald-600 font-medium">{stat.status}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border-0 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200/60 bg-gradient-to-r from-white/90 to-blue-50/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-md grid-cols-4 bg-slate-100/80 p-1 rounded-xl">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="tenants" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Tenants
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6 space-y-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-xl hover:bg-blue-50/50 transition-colors group">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
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
              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    System Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.systemStatus.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full shadow-sm ${
                            service.status === 'operational' ? 'bg-emerald-500' :
                            service.status === 'degraded' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}></div>
                          <span className="font-medium text-slate-900 text-sm">{service.name}</span>
                        </div>
                        <Badge 
                          variant="secondary"
                          className={`text-xs font-medium border-0 ${
                            service.status === 'operational' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : service.status === 'degraded'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
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

          <TabsContent value="tenants" className="p-6 space-y-6 mt-0">
            <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-blue-600" />
                    </div>
                    Tenant Management
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        placeholder="Search tenants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64 h-10 border-slate-200 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-200">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTenants.map((tenant) => (
                    <div key={tenant.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 hover:bg-blue-50/30 transition-all duration-200 group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-green-600 rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm">{tenant.name}</h3>
                          <p className="text-sm text-slate-600">{tenant.domain}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                              {tenant.users} users
                            </span>
                            <span className="text-xs text-slate-500">Created {tenant.createdAt}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="secondary"
                          className={`text-xs font-medium border-0 ${
                            tenant.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {tenant.status}
                        </Badge>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-lg">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="p-6 space-y-6 mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Platform Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: 'Total Orders', value: '45,672', change: '+8.2%' },
                      { label: 'Avg Order Value', value: '$34.50', change: '+12.1%' },
                      { label: 'Success Rate', value: '98.2%', change: '+1.4%' }
                    ].map((metric, index) => (
                      <div key={index} className="flex justify-between items-center p-3 rounded-lg hover:bg-blue-50/30 transition-colors">
                        <span className="text-slate-600 text-sm">{metric.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900">{metric.value}</span>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            {metric.change}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockData.revenueByCategory.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-600 text-sm">{category.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">${category.revenue.toLocaleString()}</span>
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 text-xs">
                              {category.percentage}%
                            </Badge>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                            style={{width: `${category.percentage}%`}}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-6 space-y-6 mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Globe className="w-4 h-4 text-blue-600" />
                    </div>
                    Global Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['API Rate Limits', 'Payment Gateway', 'Email Templates', 'Backup Settings'].map((item, index) => (
                      <Button key={index} variant="outline" className="w-full justify-start h-11 rounded-xl border-slate-200 hover:bg-blue-50">
                        {item}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-emerald-600" />
                    </div>
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Access Control', 'Audit Logs', 'Data Retention', 'Security Policies'].map((item, index) => (
                      <Button key={index} variant="outline" className="w-full justify-start h-11 rounded-xl border-slate-200 hover:bg-emerald-50">
                        {item}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SaasAdminDashboard;