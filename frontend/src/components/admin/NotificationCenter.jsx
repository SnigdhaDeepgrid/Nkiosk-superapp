import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '../../hooks/use-toast';
import {
  Bell,
  Mail,
  MessageSquare,
  Smartphone,
  Settings,
  Send,
  Eye,
  Clock,
  Users,
  AlertCircle,
  CheckCircle,
  Plus
} from 'lucide-react';

const NotificationCenter = () => {
  const { toast } = useToast();
  
  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    webhookNotifications: true,
    newTenantRegistration: true,
    highVolumeOrders: true,
    systemAlerts: true,
    failedPayments: true,
    securityAlerts: true,
    maintenanceAlerts: true
  });

  // Notification Templates
  const [templates, setTemplates] = useState([
    {
      id: '1',
      name: 'New Tenant Welcome',
      type: 'email',
      subject: 'Welcome to Nkiosk Platform',
      content: 'Welcome {{tenant_name}} to our platform...',
      status: 'active',
      lastUsed: '2 hours ago'
    },
    {
      id: '2',
      name: 'System Maintenance Alert',
      type: 'push',
      subject: 'Scheduled Maintenance',
      content: 'System maintenance scheduled for {{date}}...',
      status: 'active',
      lastUsed: '1 day ago'
    },
    {
      id: '3',
      name: 'Payment Failed',
      type: 'email',
      subject: 'Payment Processing Failed',
      content: 'Payment failed for order {{order_id}}...',
      status: 'active',
      lastUsed: '3 hours ago'
    }
  ]);

  // Recent Notifications
  const [recentNotifications, setRecentNotifications] = useState([
    {
      id: '1',
      title: 'New tenant registration: TechStore Plus',
      message: 'A new tenant has registered and is pending approval.',
      type: 'info',
      timestamp: '5 minutes ago',
      read: false,
      recipients: 12
    },
    {
      id: '2',
      title: 'High order volume detected',
      message: 'FreshGrocery has received 150+ orders in the last hour.',
      type: 'warning',
      timestamp: '15 minutes ago',
      read: false,
      recipients: 8
    },
    {
      id: '3',
      title: 'System maintenance completed',
      message: 'Database maintenance completed successfully.',
      type: 'success',
      timestamp: '2 hours ago',
      read: true,
      recipients: 25
    },
    {
      id: '4',
      title: 'Payment gateway error',
      message: 'Stripe payment processing experiencing issues.',
      type: 'error',
      timestamp: '3 hours ago',
      read: true,
      recipients: 15
    }
  ]);

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all_admins',
    channels: ['email']
  });

  const handleSettingChange = (setting, value) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: value
    }));
    
    toast({
      title: "Notification Setting Updated",
      description: `${setting.replace(/([A-Z])/g, ' $1').toLowerCase()} has been updated.`,
    });
  };

  const handleSendNotification = () => {
    // Mock send notification
    const notification = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      timestamp: 'Just now',
      read: false,
      recipients: newNotification.recipients === 'all_admins' ? 25 : 12
    };

    setRecentNotifications(prev => [notification, ...prev]);
    setNewNotification({ title: '', message: '', type: 'info', recipients: 'all_admins', channels: ['email'] });
    
    toast({
      title: "Notification Sent",
      description: `Notification sent to ${notification.recipients} recipients.`,
    });
  };

  const getNotificationIcon = (type) => {
    const icons = {
      info: <Bell className="w-4 h-4 text-blue-600" />,
      warning: <AlertCircle className="w-4 h-4 text-orange-600" />,
      error: <AlertCircle className="w-4 h-4 text-red-600" />,
      success: <CheckCircle className="w-4 h-4 text-green-600" />
    };
    return icons[type] || icons.info;
  };

  const getNotificationColor = (type) => {
    const colors = {
      info: 'bg-blue-100 text-blue-700 border-blue-200',
      warning: 'bg-orange-100 text-orange-700 border-orange-200',
      error: 'bg-red-100 text-red-700 border-red-200',
      success: 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notification Center</h2>
          <p className="text-slate-600">Manage platform notifications and alert settings</p>
        </div>
        <Badge className="bg-blue-100 text-blue-700 border-0">
          <Bell className="w-3 h-3 mr-1" />
          {recentNotifications.filter(n => !n.read).length} Unread
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Sent Today', value: '47', icon: Send, color: 'text-blue-600', bgColor: 'bg-blue-50' },
          { label: 'Email Delivered', value: '45', icon: Mail, color: 'text-green-600', bgColor: 'bg-green-50' },
          { label: 'Push Notifications', value: '28', icon: Smartphone, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { label: 'Unread Alerts', value: recentNotifications.filter(n => !n.read).length, icon: Bell, color: 'text-orange-600', bgColor: 'bg-orange-50' }
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Send New Notification */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                Send New Notification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <Input
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Notification title..."
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Message</Label>
                <Textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Notification message..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <Select value={newNotification.type} onValueChange={(value) => setNewNotification(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Recipients</Label>
                  <Select value={newNotification.recipients} onValueChange={(value) => setNewNotification(prev => ({ ...prev, recipients: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_admins">All Admins</SelectItem>
                      <SelectItem value="saas_admins">SaaS Admins</SelectItem>
                      <SelectItem value="support_team">Support Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Delivery Channels</Label>
                <div className="flex gap-4">
                  {[
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'push', label: 'Push', icon: Smartphone },
                    { value: 'sms', label: 'SMS', icon: MessageSquare }
                  ].map(channel => (
                    <label key={channel.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newNotification.channels.includes(channel.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewNotification(prev => ({ ...prev, channels: [...prev.channels, channel.value] }));
                          } else {
                            setNewNotification(prev => ({ ...prev, channels: prev.channels.filter(c => c !== channel.value) }));
                          }
                        }}
                        className="w-4 h-4"
                      />
                      <channel.icon className="w-4 h-4" />
                      <span className="text-sm">{channel.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleSendNotification} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!newNotification.title || !newNotification.message}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Notification
              </Button>
            </CardContent>
          </Card>

          {/* Recent Notifications */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Notifications</CardTitle>
              <Button variant="outline" size="sm">
                Mark All Read
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 rounded-lg border ${getNotificationColor(notification.type)} ${
                      !notification.read ? 'border-l-4' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div>
                          <h4 className="font-medium text-slate-900">{notification.title}</h4>
                          <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.timestamp}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {notification.recipients} recipients
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 text-xs">
                            New
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-600" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-slate-900 mb-3">Delivery Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Email Notifications</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Push Notifications</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-green-600" />
                      <span className="text-sm">SMS Notifications</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => handleSettingChange('smsNotifications', checked)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-slate-900 mb-3">Alert Types</h4>
                <div className="space-y-3">
                  {[
                    { key: 'newTenantRegistration', label: 'New Tenant Registration' },
                    { key: 'highVolumeOrders', label: 'High Volume Orders' },
                    { key: 'systemAlerts', label: 'System Alerts' },
                    { key: 'failedPayments', label: 'Failed Payments' },
                    { key: 'securityAlerts', label: 'Security Alerts' },
                    { key: 'maintenanceAlerts', label: 'Maintenance Alerts' }
                  ].map(setting => (
                    <div key={setting.key} className="flex items-center justify-between">
                      <span className="text-sm">{setting.label}</span>
                      <Switch 
                        checked={notificationSettings[setting.key]}
                        onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Templates */}
          <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Templates</CardTitle>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {templates.map((template) => (
                  <div key={template.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm text-slate-900">{template.name}</h4>
                      <Badge className={`${
                        template.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
                      } border-0 text-xs`}>
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mb-2">{template.subject}</p>
                    <p className="text-xs text-slate-500">Last used: {template.lastUsed}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;