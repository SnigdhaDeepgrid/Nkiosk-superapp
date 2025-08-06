import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Shield,
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Info,
  User,
  Clock,
  Activity,
  Database,
  Key,
  Settings
} from 'lucide-react';

const AuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, searchTerm, actionFilter, userFilter]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Mock audit log data
      const mockLogs = [
        {
          id: "audit_001",
          user_id: "usr_001",
          user_name: "John Manager",
          action: "CREATE",
          resource_type: "product",
          resource_id: "prd_004",
          details: {
            product_name: "Organic Bananas",
            category: "Fruits",
            price: 2.99
          },
          ip_address: "192.168.1.100",
          timestamp: "2024-01-10T14:30:00Z"
        },
        {
          id: "audit_002",
          user_id: "usr_002",
          user_name: "Sarah Vendor",
          action: "UPDATE",
          resource_type: "inventory",
          resource_id: "prd_001",
          details: {
            old_quantity: 150,
            new_quantity: 120,
            reason: "Stock adjustment after inventory count"
          },
          ip_address: "192.168.1.105",
          timestamp: "2024-01-10T13:45:00Z"
        },
        {
          id: "audit_003",
          user_id: "usr_001",
          user_name: "John Manager",
          action: "DELETE",
          resource_type: "user",
          resource_id: "usr_005",
          details: {
            deleted_user: "Tom Wilson",
            reason: "Employee termination"
          },
          ip_address: "192.168.1.100",
          timestamp: "2024-01-10T12:15:00Z"
        },
        {
          id: "audit_004",
          user_id: "usr_003",
          user_name: "Mike Delivery",
          action: "LOGIN",
          resource_type: "system",
          resource_id: "auth_system",
          details: {
            login_method: "password",
            device: "Mobile App",
            success: true
          },
          ip_address: "192.168.1.110",
          timestamp: "2024-01-10T11:30:00Z"
        },
        {
          id: "audit_005",
          user_id: "usr_004",
          user_name: "Lisa Support",
          action: "UPDATE",
          resource_type: "order",
          resource_id: "ord_001",
          details: {
            old_status: "pending",
            new_status: "refunded",
            refund_amount: 27.72,
            reason: "Customer complaint - damaged product"
          },
          ip_address: "192.168.1.115",
          timestamp: "2024-01-10T10:45:00Z"
        },
        {
          id: "audit_006",
          user_id: "usr_001",
          user_name: "John Manager",
          action: "CREATE",
          resource_type: "outlet",
          resource_id: "out_003",
          details: {
            outlet_name: "Uptown Branch",
            address: "789 Uptown Ave, New York, NY 10006",
            manager_assigned: "usr_006"
          },
          ip_address: "192.168.1.100",
          timestamp: "2024-01-10T09:20:00Z"
        },
        {
          id: "audit_007",
          user_id: "system",
          user_name: "System",
          action: "BACKUP",
          resource_type: "database",
          resource_id: "db_main",
          details: {
            backup_type: "automated_daily",
            size_mb: 256.7,
            status: "successful"
          },
          ip_address: "127.0.0.1",
          timestamp: "2024-01-10T06:00:00Z"
        },
        {
          id: "audit_008",
          user_id: "usr_002",
          user_name: "Sarah Vendor",
          action: "FAILED_LOGIN",
          resource_type: "system",
          resource_id: "auth_system",
          details: {
            login_method: "password",
            failure_reason: "incorrect_password",
            attempt_count: 3
          },
          ip_address: "192.168.1.105",
          timestamp: "2024-01-09T18:45:00Z"
        }
      ];

      setAuditLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = auditLogs.filter(log =>
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource_id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (actionFilter !== 'all') {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (userFilter !== 'all') {
      filtered = filtered.filter(log => log.user_id === userFilter);
    }

    // Sort by timestamp (newest first)
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    setFilteredLogs(filtered);
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-100 text-green-800';
      case 'UPDATE':
        return 'bg-blue-100 text-blue-800';
      case 'DELETE':
        return 'bg-red-100 text-red-800';
      case 'LOGIN':
        return 'bg-purple-100 text-purple-800';
      case 'FAILED_LOGIN':
        return 'bg-red-100 text-red-800';
      case 'BACKUP':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'CREATE':
        return <CheckCircle className="w-4 h-4" />;
      case 'UPDATE':
        return <Settings className="w-4 h-4" />;
      case 'DELETE':
        return <AlertTriangle className="w-4 h-4" />;
      case 'LOGIN':
        return <Key className="w-4 h-4" />;
      case 'FAILED_LOGIN':
        return <AlertTriangle className="w-4 h-4" />;
      case 'BACKUP':
        return <Database className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getResourceTypeIcon = (resourceType) => {
    switch (resourceType) {
      case 'user':
        return <User className="w-4 h-4" />;
      case 'product':
      case 'inventory':
        return <Settings className="w-4 h-4" />;
      case 'order':
        return <Activity className="w-4 h-4" />;
      case 'outlet':
        return <Settings className="w-4 h-4" />;
      case 'database':
        return <Database className="w-4 h-4" />;
      case 'system':
        return <Shield className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 24 * 60) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const uniqueUsers = [...new Set(auditLogs.map(log => ({ id: log.user_id, name: log.user_name })))];
  const uniqueActions = [...new Set(auditLogs.map(log => log.action))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading audit logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Audit & Security Logs</h2>
          <p className="text-slate-600">Monitor all system activities and user actions for security compliance</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search logs by action, user, resource type, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {uniqueActions.map(action => (
                  <SelectItem key={action} value={action}>{action}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>{user.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-blue-700 text-sm font-medium">Total Actions</p>
                <p className="text-xl font-bold text-blue-900">{auditLogs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-700 text-sm font-medium">Successful</p>
                <p className="text-xl font-bold text-emerald-900">
                  {auditLogs.filter(log => !log.action.includes('FAILED')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-red-700 text-sm font-medium">Failed Actions</p>
                <p className="text-xl font-bold text-red-900">
                  {auditLogs.filter(log => log.action.includes('FAILED')).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-purple-700 text-sm font-medium">Active Users</p>
                <p className="text-xl font-bold text-purple-900">
                  {new Set(auditLogs.filter(log => 
                    new Date(log.timestamp) > new Date(Date.now() - 24*60*60*1000)
                  ).map(log => log.user_id)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audit Logs List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Audit Trail ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                      {getResourceTypeIcon(log.resource_type)}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-slate-900">{log.user_name}</h4>
                        <Badge className={`${getActionColor(log.action)} border-0 gap-1`}>
                          {getActionIcon(log.action)}
                          {log.action}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {log.action.toLowerCase()} {log.resource_type} ({log.resource_id})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-900">{formatTimestamp(log.timestamp)}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>IP: {log.ip_address}</span>
                    </div>
                  </div>
                </div>

                {/* Action Details */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-slate-700 mb-2">Action Details</p>
                  <div className="space-y-1">
                    {Object.entries(log.details).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-slate-600 capitalize">{key.replace('_', ' ')}:</span>
                        <span className="font-medium text-slate-900">
                          {typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                           typeof value === 'number' ? value.toLocaleString() :
                           String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Severity Indicator */}
                {(log.action.includes('FAILED') || log.action === 'DELETE') && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-600 font-medium">
                      {log.action.includes('FAILED') ? 'Security Alert: Failed Action' : 
                       'Critical Action: Data Deletion'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No audit logs found</h3>
              <p className="text-slate-500">
                {auditLogs.length === 0 
                  ? 'Audit logs will appear here as users perform actions.'
                  : 'Try adjusting your search criteria or filters.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditLogs;