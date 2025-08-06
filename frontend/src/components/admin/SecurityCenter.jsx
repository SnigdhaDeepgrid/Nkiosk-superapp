import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useToast } from '../../hooks/use-toast';
import {
  Shield,
  Key,
  Activity,
  AlertTriangle,
  Lock,
  Eye,
  UserCheck,
  Clock,
  Terminal,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';

const SecurityCenter = () => {
  const { toast } = useToast();
  const [activeSecurityTab, setActiveSecurityTab] = useState('sessions');

  // Mock security data
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    ipWhitelist: '',
    auditLogRetention: 90,
    dataEncryption: true,
    backupEncryption: true
  });

  const [activeSessions, setActiveSessions] = useState([
    {
      id: '1',
      user: 'john@nkiosk.com',
      userName: 'John Smith',
      role: 'saas_admin',
      ipAddress: '192.168.1.100',
      location: 'New York, US',
      device: 'Chrome on Windows',
      loginTime: '2024-01-20 14:30:00',
      lastActivity: '2 minutes ago',
      status: 'active'
    },
    {
      id: '2',
      user: 'sarah@nkiosk.com',
      userName: 'Sarah Wilson',
      role: 'admin',
      ipAddress: '10.0.0.50',
      location: 'London, UK',
      device: 'Safari on macOS',
      loginTime: '2024-01-20 09:15:00',
      lastActivity: '1 hour ago',
      status: 'active'
    },
    {
      id: '3',
      user: 'michael@nkiosk.com',
      userName: 'Michael Chen',
      role: 'support_admin',
      ipAddress: '172.16.0.25',
      location: 'Tokyo, JP',
      device: 'Firefox on Linux',
      loginTime: '2024-01-20 12:45:00',
      lastActivity: '5 minutes ago',
      status: 'idle'
    }
  ]);

  const [auditLogs, setAuditLogs] = useState([
    {
      id: '1',
      timestamp: '2024-01-20 15:30:00',
      user: 'john@nkiosk.com',
      action: 'USER_LOGIN',
      resource: 'Authentication',
      details: 'Successful login from 192.168.1.100',
      severity: 'info',
      ipAddress: '192.168.1.100'
    },
    {
      id: '2',
      timestamp: '2024-01-20 15:25:00',
      user: 'sarah@nkiosk.com',
      action: 'TENANT_CREATED',
      resource: 'Tenant Management',
      details: 'Created new tenant: TechStore Pro',
      severity: 'info',
      ipAddress: '10.0.0.50'
    },
    {
      id: '3',
      timestamp: '2024-01-20 15:20:00',
      user: 'unknown',
      action: 'LOGIN_FAILED',
      resource: 'Authentication',
      details: 'Failed login attempt for admin@test.com',
      severity: 'warning',
      ipAddress: '203.0.113.1'
    },
    {
      id: '4',
      timestamp: '2024-01-20 15:15:00',
      user: 'michael@nkiosk.com',
      action: 'SETTINGS_UPDATED',
      resource: 'Platform Configuration',
      details: 'Updated payment gateway settings',
      severity: 'info',
      ipAddress: '172.16.0.25'
    },
    {
      id: '5',
      timestamp: '2024-01-20 15:10:00',
      user: 'system',
      action: 'BACKUP_COMPLETED',
      resource: 'System',
      details: 'Daily backup completed successfully',
      severity: 'success',
      ipAddress: 'system'
    }
  ]);

  const handleSettingChange = (setting, value) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast({
      title: "Security Setting Updated",
      description: `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated.`,
    });
  };

  const handleForceLogout = (sessionId) => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
    toast({
      title: "Session Terminated",
      description: "User session has been forcefully terminated.",
      variant: "destructive",
    });
  };

  const exportAuditLogs = () => {
    // Mock export functionality
    toast({
      title: "Export Initiated",
      description: "Audit logs are being prepared for download.",
    });
  };

  const getSeverityColor = (severity) => {
    const colors = {
      info: 'bg-blue-100 text-blue-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      error: 'bg-red-100 text-red-700'
    };
    return colors[severity] || colors.info;
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      info: Activity,
      success: CheckCircle,
      warning: AlertTriangle,
      error: XCircle
    };
    const Icon = icons[severity] || Activity;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Security Center</h2>
          <p className="text-slate-600">Monitor security, manage sessions, and audit platform activity</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-700 border-0">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>
          <Button onClick={exportAuditLogs} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Logs
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Sessions', value: activeSessions.length, icon: UserCheck, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Failed Logins (24h)', value: '3', icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-50' },
          { label: 'Security Score', value: '98%', icon: Shield, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: 'Last Backup', value: '2h ago', icon: RefreshCw, color: 'text-purple-600', bgColor: 'bg-purple-50' }
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

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <Tabs value={activeSecurityTab} onValueChange={setActiveSecurityTab} className="w-full">
          <div className="border-b border-slate-200/60 bg-gradient-to-r from-white/90 to-blue-50/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-100/80 p-1 rounded-xl">
              <TabsTrigger 
                value="sessions" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Sessions
              </TabsTrigger>
              <TabsTrigger 
                value="audit" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Audit Logs
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Settings
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Privacy
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Active Sessions */}
          <TabsContent value="sessions" className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Admin Sessions</h3>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>

            {activeSessions.map((session) => (
              <Card key={session.id} className="border border-slate-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        session.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <h4 className="font-medium text-slate-900">{session.userName}</h4>
                        <p className="text-sm text-slate-600">{session.user}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <div>
                        <p className="font-medium">IP Address</p>
                        <p>{session.ipAddress}</p>
                      </div>
                      <div>
                        <p className="font-medium">Location</p>
                        <p>{session.location}</p>
                      </div>
                      <div>
                        <p className="font-medium">Device</p>
                        <p>{session.device}</p>
                      </div>
                      <div>
                        <p className="font-medium">Last Activity</p>
                        <p>{session.lastActivity}</p>
                      </div>
                    </div>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleForceLogout(session.id)}
                    >
                      Force Logout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Audit Logs */}
          <TabsContent value="audit" className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">System Audit Logs</h3>
              <div className="flex items-center gap-2">
                <Input placeholder="Search logs..." className="w-64" />
                <Button variant="outline">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {auditLogs.map((log) => (
                <Card key={log.id} className="border border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge className={`${getSeverityColor(log.severity)} border-0 gap-1`}>
                          {getSeverityIcon(log.severity)}
                          {log.severity}
                        </Badge>
                        <div>
                          <h4 className="font-medium text-slate-900">{log.action}</h4>
                          <p className="text-sm text-slate-600">{log.details}</p>
                        </div>
                      </div>
                      
                      <div className="text-right text-sm text-slate-600">
                        <p className="font-medium">{log.timestamp}</p>
                        <p>{log.user}</p>
                        <p>{log.ipAddress}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="settings" className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Security Configuration</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Key className="w-5 h-5 text-blue-600" />
                    Authentication Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Two-Factor Authentication</Label>
                      <p className="text-sm text-slate-600">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label className="font-medium">Session Timeout (minutes)</Label>
                    <Input
                      type="number"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label className="font-medium">Max Login Attempts</Label>
                    <Input
                      type="number"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lock className="w-5 h-5 text-green-600" />
                    Data Protection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Data Encryption</Label>
                      <p className="text-sm text-slate-600">Encrypt sensitive data at rest</p>
                    </div>
                    <Switch 
                      checked={securitySettings.dataEncryption}
                      onCheckedChange={(checked) => handleSettingChange('dataEncryption', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="font-medium">Backup Encryption</Label>
                      <p className="text-sm text-slate-600">Encrypt database backups</p>
                    </div>
                    <Switch 
                      checked={securitySettings.backupEncryption}
                      onCheckedChange={(checked) => handleSettingChange('backupEncryption', checked)}
                    />
                  </div>
                  
                  <div>
                    <Label className="font-medium">Audit Log Retention (days)</Label>
                    <Input
                      type="number"
                      value={securitySettings.auditLogRetention}
                      onChange={(e) => handleSettingChange('auditLogRetention', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="p-6 space-y-6">
            <h3 className="text-lg font-semibold">Data Privacy & Isolation</h3>
            
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">Tenant Data Isolation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h4 className="font-medium text-green-800">Data Isolation Active</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    All tenant data is properly isolated. Cross-tenant data access is prevented at the database level.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">Database Level</h4>
                    <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
                    <p className="text-sm text-slate-600 mt-2">Tenant data separated by schema</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">API Level</h4>
                    <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
                    <p className="text-sm text-slate-600 mt-2">JWT tokens validate tenant access</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-lg">
                    <h4 className="font-medium text-slate-900 mb-2">File Storage</h4>
                    <Badge className="bg-green-100 text-green-700 border-0">Active</Badge>
                    <p className="text-sm text-slate-600 mt-2">Tenant files in isolated directories</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default SecurityCenter;