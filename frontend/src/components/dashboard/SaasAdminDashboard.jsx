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
  List,
  Bell,
  Key,
  UserCog,
  BarChart3
} from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { mockData } from '../../data/mockData';
import TenantForm from '../tenants/TenantForm';
import TenantCard from '../tenants/TenantCard';
import TenantDetails from '../tenants/TenantDetails';
import PlatformConfig from '../admin/PlatformConfig';
import UserManagement from '../admin/UserManagement';
import SecurityCenter from '../admin/SecurityCenter';
import NotificationCenter from '../admin/NotificationCenter';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';
import DashboardLayout from '../layout/DashboardLayout';
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
      value: tenants.filter(t => t.status === 'active').length,
      total: tenants.length,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+2 this week',
      changeType: 'positive'
    },
    {
      title: 'Total Users',
      value: tenants.reduce((sum, tenant) => sum + tenant.users, 0).toLocaleString(),
      change: '+12% from last month',
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      changeType: 'positive'
    },
    {
      title: 'Monthly Revenue',
      value: `$${tenants.reduce((sum, tenant) => sum + tenant.monthlyRevenue, 0).toLocaleString()}`,
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

  const filteredTenants = tenants.filter(tenant => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tenant.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || tenant.status === statusFilter;
    const matchesPlan = planFilter === 'all' || tenant.plan === planFilter;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  // CRUD Operations
  const handleCreateTenant = () => {
    setEditingTenant(null);
    setShowTenantForm(true);
  };

  const handleEditTenant = (tenant) => {
    setEditingTenant(tenant);
    setShowTenantForm(true);
    setShowTenantDetails(false);
  };

  const handleViewTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowTenantDetails(true);
  };

  const handleSaveTenant = (tenantData) => {
    if (editingTenant) {
      // Update existing tenant
      setTenants(prev => prev.map(t => t.id === editingTenant.id ? tenantData : t));
      toast({
        title: "Tenant Updated",
        description: `${tenantData.name} has been updated successfully`,
      });
    } else {
      // Create new tenant
      setTenants(prev => [...prev, tenantData]);
      toast({
        title: "Tenant Created",
        description: `${tenantData.name} has been created successfully`,
      });
    }
    setShowTenantForm(false);
    setEditingTenant(null);
  };

  const handleDeleteTenant = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    setTenants(prev => prev.filter(t => t.id !== tenantId));
    toast({
      title: "Tenant Deleted",
      description: `${tenant?.name} has been deleted successfully`,
      variant: "destructive",
    });
  };

  const handleToggleStatus = (tenantId, newStatus) => {
    setTenants(prev => prev.map(t => 
      t.id === tenantId 
        ? { ...t, status: newStatus, updatedAt: new Date().toLocaleDateString() }
        : t
    ));
    const tenant = tenants.find(t => t.id === tenantId);
    toast({
      title: "Status Updated",
      description: `${tenant?.name} is now ${newStatus}`,
    });
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">SaaS Administration</h1>
          <p className="text-slate-600">Manage tenants, users, and platform settings</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white gap-2 px-6 h-11 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          onClick={handleCreateTenant}
        >
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
            <TabsList className="grid w-full max-w-5xl grid-cols-7 bg-slate-100/80 p-1 rounded-xl">
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
                value="users" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Users
              </TabsTrigger>
              <TabsTrigger 
                value="config" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Config
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Alerts
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
            {/* Filters and Search */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search tenants by name, domain, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11 border-slate-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-11 border-slate-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">🟢 Active</SelectItem>
                  <SelectItem value="suspended">🟡 Suspended</SelectItem>
                  <SelectItem value="pending">🔵 Pending</SelectItem>
                  <SelectItem value="inactive">🔴 Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-36 h-11 border-slate-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="Basic">Basic</SelectItem>
                  <SelectItem value="Professional">Professional</SelectItem>
                  <SelectItem value="Enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`h-9 w-9 p-0 ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`h-9 w-9 p-0 ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tenant Cards */}
            {filteredTenants.length === 0 ? (
              <Card className="border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No tenants found</h3>
                  <p className="text-slate-600 mb-6">
                    {searchTerm || statusFilter !== 'all' || planFilter !== 'all'
                      ? 'Try adjusting your search criteria or filters'
                      : 'Get started by creating your first tenant'
                    }
                  </p>
                  {!searchTerm && statusFilter === 'all' && planFilter === 'all' && (
                    <Button 
                      onClick={handleCreateTenant} 
                      className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-xl px-6 h-11"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Tenant
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                  : 'space-y-4'
              }`}>
                {filteredTenants.map((tenant) => (
                  <TenantCard
                    key={tenant.id}
                    tenant={tenant}
                    onEdit={handleEditTenant}
                    onDelete={handleDeleteTenant}
                    onToggleStatus={handleToggleStatus}
                    onView={handleViewTenant}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Advanced Analytics Tab */}
          <TabsContent value="analytics" className="p-6 space-y-6 mt-0">
            <AnalyticsDashboard />
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="p-6 space-y-6 mt-0">
            <UserManagement />
          </TabsContent>

          {/* Platform Configuration Tab */}
          <TabsContent value="config" className="p-6 space-y-6 mt-0">
            <PlatformConfig />
          </TabsContent>

          {/* Security Center Tab */}
          <TabsContent value="security" className="p-6 space-y-6 mt-0">
            <SecurityCenter />
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="p-6 space-y-6 mt-0">
            <NotificationCenter />
          </TabsContent>

          <TabsContent value="settings" className="p-6 space-y-6 mt-0">
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Additional Settings</h3>
              <p className="text-slate-600 mb-4">
                Additional platform settings and configuration options
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Globe className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-slate-900 mb-2">Global Settings</h4>
                    <p className="text-sm text-slate-600">Configure global platform preferences</p>
                  </CardContent>
                </Card>
                
                <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <Shield className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-slate-900 mb-2">Advanced Security</h4>
                    <p className="text-sm text-slate-600">Advanced security configurations</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Tenant Form Modal */}
      <TenantForm
        tenant={editingTenant}
        isOpen={showTenantForm}
        onSave={handleSaveTenant}
        onCancel={() => {
          setShowTenantForm(false);
          setEditingTenant(null);
        }}
      />

      {/* Tenant Details Modal */}
      <TenantDetails
        tenant={selectedTenant}
        isOpen={showTenantDetails}
        onClose={() => {
          setShowTenantDetails(false);
          setSelectedTenant(null);
        }}
        onEdit={handleEditTenant}
      />
    </div>
  );
};

export default SaasAdminDashboard;