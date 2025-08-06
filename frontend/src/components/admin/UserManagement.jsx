import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { useToast } from '../../hooks/use-toast';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Trash2,
  Shield,
  Ban,
  CheckCircle,
  Clock,
  Mail,
  Phone
} from 'lucide-react';

const UserManagement = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock admin users data
  const [adminUsers, setAdminUsers] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@nkiosk.com',
      role: 'saas_admin',
      status: 'active',
      lastLogin: '2 hours ago',
      permissions: ['all'],
      createdAt: '2024-01-15',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@nkiosk.com',
      role: 'admin',
      status: 'active',
      lastLogin: '1 day ago',
      permissions: ['users', 'tenants', 'analytics'],
      createdAt: '2024-02-01',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Michael Chen',
      email: 'michael@nkiosk.com',
      role: 'support_admin',
      status: 'active',
      lastLogin: '3 hours ago',
      permissions: ['support', 'tickets'],
      createdAt: '2024-02-15',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '4',
      name: 'Lisa Rodriguez',
      email: 'lisa@nkiosk.com',
      role: 'analytics_admin',
      status: 'inactive',
      lastLogin: '5 days ago',
      permissions: ['analytics', 'reports'],
      createdAt: '2024-03-01',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '5',
      name: 'David Kumar',
      email: 'david@nkiosk.com',
      role: 'security_admin',
      status: 'suspended',
      lastLogin: '1 week ago',
      permissions: ['security', 'audit'],
      createdAt: '2024-03-10',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
    }
  ]);

  const roleDisplayNames = {
    'saas_admin': 'SaaS Admin',
    'admin': 'Platform Admin',
    'support_admin': 'Support Admin',
    'analytics_admin': 'Analytics Admin',
    'security_admin': 'Security Admin'
  };

  const roleColors = {
    'saas_admin': 'bg-purple-100 text-purple-700',
    'admin': 'bg-blue-100 text-blue-700',
    'support_admin': 'bg-green-100 text-green-700',
    'analytics_admin': 'bg-orange-100 text-orange-700',
    'security_admin': 'bg-red-100 text-red-700'
  };

  const statusColors = {
    'active': 'bg-emerald-100 text-emerald-700',
    'inactive': 'bg-slate-100 text-slate-700',
    'suspended': 'bg-red-100 text-red-700'
  };

  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleUserAction = (userId, action) => {
    const user = adminUsers.find(u => u.id === userId);
    
    switch (action) {
      case 'activate':
        setAdminUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'active' } : u
        ));
        toast({
          title: "User Activated",
          description: `${user?.name} has been activated successfully.`,
        });
        break;
      case 'suspend':
        setAdminUsers(prev => prev.map(u => 
          u.id === userId ? { ...u, status: 'suspended' } : u
        ));
        toast({
          title: "User Suspended",
          description: `${user?.name} has been suspended.`,
          variant: "destructive",
        });
        break;
      case 'delete':
        setAdminUsers(prev => prev.filter(u => u.id !== userId));
        toast({
          title: "User Deleted",
          description: `${user?.name} has been removed from the system.`,
          variant: "destructive",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
          <p className="text-slate-600">Manage platform administrators and their permissions</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
          <UserPlus className="w-4 h-4" />
          Add Admin User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Admins', value: adminUsers.length, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Active Users', value: adminUsers.filter(u => u.status === 'active').length, icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: 'Inactive Users', value: adminUsers.filter(u => u.status === 'inactive').length, icon: Clock, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          { label: 'Suspended Users', value: adminUsers.filter(u => u.status === 'suspended').length, icon: Ban, color: 'text-red-600', bgColor: 'bg-red-50' }
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 border-slate-200 focus:border-blue-500 rounded-xl"
              />
            </div>

            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40 h-11 border-slate-200 rounded-xl">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="saas_admin">SaaS Admin</SelectItem>
                <SelectItem value="admin">Platform Admin</SelectItem>
                <SelectItem value="support_admin">Support Admin</SelectItem>
                <SelectItem value="analytics_admin">Analytics Admin</SelectItem>
                <SelectItem value="security_admin">Security Admin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 h-11 border-slate-200 rounded-xl">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Admin Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-white shadow-sm">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-tr from-blue-600 to-green-600 text-white font-semibold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900">{user.name}</h3>
                        <Badge className={`${roleColors[user.role]} border-0 text-xs font-medium`}>
                          {roleDisplayNames[user.role]}
                        </Badge>
                        <Badge className={`${statusColors[user.status]} border-0 text-xs font-medium`}>
                          {user.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Last login: {user.lastLogin}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500">Permissions:</span>
                        {user.permissions.map((permission, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem>
                        <Edit3 className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        Manage Permissions
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.status === 'active' ? (
                        <DropdownMenuItem 
                          onClick={() => handleUserAction(user.id, 'suspend')}
                          className="text-orange-600"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Suspend User
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem 
                          onClick={() => handleUserAction(user.id, 'activate')}
                          className="text-green-600"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Activate User
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => handleUserAction(user.id, 'delete')}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Access Control & Permissions */}
      <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-600" />
            Access Control & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Tenant Management', description: 'Create, edit, delete tenants', roles: ['saas_admin', 'admin'] },
              { name: 'User Management', description: 'Manage admin users and permissions', roles: ['saas_admin'] },
              { name: 'Platform Configuration', description: 'Configure global platform settings', roles: ['saas_admin', 'admin'] },
              { name: 'Analytics Access', description: 'View platform analytics and reports', roles: ['saas_admin', 'admin', 'analytics_admin'] },
              { name: 'Support Management', description: 'Handle support tickets and escalations', roles: ['saas_admin', 'support_admin'] },
              { name: 'Security Settings', description: 'Manage security and audit logs', roles: ['saas_admin', 'security_admin'] }
            ].map((permission, index) => (
              <Card key={index} className="border border-slate-200">
                <CardContent className="p-4">
                  <h4 className="font-medium text-slate-900 mb-2">{permission.name}</h4>
                  <p className="text-sm text-slate-600 mb-3">{permission.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {permission.roles.map(role => (
                      <Badge key={role} className={`${roleColors[role]} border-0 text-xs`}>
                        {roleDisplayNames[role]}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;