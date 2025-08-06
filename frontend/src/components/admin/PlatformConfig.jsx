import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import {
  Globe,
  CreditCard,
  Truck,
  Palette,
  FileText,
  Mail,
  Shield,
  Settings,
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

const PlatformConfig = () => {
  const { toast } = useToast();
  const [activeConfigTab, setActiveConfigTab] = useState('payment');
  const [showApiKeys, setShowApiKeys] = useState({});

  // Platform Configuration State
  const [config, setConfig] = useState({
    // Payment Gateway Settings
    payment: {
      stripeEnabled: true,
      stripePublicKey: 'pk_test_...',
      stripeSecretKey: 'sk_test_...',
      paypalEnabled: false,
      paypalClientId: '',
      paypalClientSecret: '',
      razorpayEnabled: false,
      razorpayKeyId: '',
      razorpayKeySecret: '',
      defaultCurrency: 'USD',
      allowedCurrencies: ['USD', 'EUR', 'GBP', 'INR'],
      transactionFee: 2.9,
      platformCommission: 5.0
    },
    // Shipping Configuration
    shipping: {
      defaultProvider: 'fedex',
      providers: {
        fedex: {
          enabled: true,
          apiKey: 'fedex_api_key',
          accountNumber: '123456789'
        },
        ups: {
          enabled: false,
          apiKey: '',
          accountNumber: ''
        },
        dhl: {
          enabled: true,
          apiKey: 'dhl_api_key',
          accountNumber: '987654321'
        }
      },
      defaultZones: [
        { name: 'Local', maxDistance: 10, baseCost: 5.99, enabled: true },
        { name: 'Regional', maxDistance: 50, baseCost: 12.99, enabled: true },
        { name: 'National', maxDistance: 500, baseCost: 24.99, enabled: true }
      ],
      freeShippingThreshold: 50.00,
      expressDeliveryEnabled: true
    },
    // Theme and Branding
    branding: {
      platformName: 'Nkiosk',
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      logoUrl: '',
      faviconUrl: '',
      customCss: '',
      whiteLabel: false,
      customDomain: '',
      maintenanceMode: false,
      maintenanceMessage: 'We are currently performing scheduled maintenance.'
    },
    // Content Management
    content: {
      termsOfService: '',
      privacyPolicy: '',
      aboutUs: '',
      contactInfo: {
        email: 'support@nkiosk.com',
        phone: '+1-555-0123',
        address: '123 Business Street, City, State 12345'
      },
      socialLinks: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
      },
      footerText: '© 2024 Nkiosk. All rights reserved.'
    }
  });

  const handleConfigUpdate = (section, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedConfigUpdate = (section, subsection, field, value) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  const handleSaveConfig = async (section) => {
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Configuration Updated",
      description: `${section.charAt(0).toUpperCase() + section.slice(1)} settings have been saved successfully.`,
    });
  };

  const toggleApiKeyVisibility = (key) => {
    setShowApiKeys(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const maskApiKey = (key) => {
    if (!key) return '';
    return key.length > 8 ? key.slice(0, 8) + '...' + key.slice(-4) : key;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Platform Configuration</h2>
          <p className="text-slate-600">Manage global platform settings and integrations</p>
        </div>
        <Badge className="bg-green-100 text-green-700 border-0">
          All Systems Operational
        </Badge>
      </div>

      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <Tabs value={activeConfigTab} onValueChange={setActiveConfigTab} className="w-full">
          <div className="border-b border-slate-200/60 bg-gradient-to-r from-white/90 to-blue-50/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-100/80 p-1 rounded-xl">
              <TabsTrigger 
                value="payment" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Payment
              </TabsTrigger>
              <TabsTrigger 
                value="shipping" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Shipping
              </TabsTrigger>
              <TabsTrigger 
                value="branding" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Branding
              </TabsTrigger>
              <TabsTrigger 
                value="content" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                Content
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Payment Gateway Configuration */}
          <TabsContent value="payment" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Payment Gateway Settings
                </h3>
                <p className="text-sm text-slate-600">Configure payment processors and transaction settings</p>
              </div>
              <Button onClick={() => handleSaveConfig('payment')} className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Stripe Configuration */}
              <Card className="border border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Stripe Integration</CardTitle>
                    <Switch 
                      checked={config.payment.stripeEnabled} 
                      onCheckedChange={(checked) => handleConfigUpdate('payment', 'stripeEnabled', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Public Key</Label>
                    <div className="relative">
                      <Input
                        type={showApiKeys.stripePublic ? 'text' : 'password'}
                        value={showApiKeys.stripePublic ? config.payment.stripePublicKey : maskApiKey(config.payment.stripePublicKey)}
                        onChange={(e) => handleConfigUpdate('payment', 'stripePublicKey', e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => toggleApiKeyVisibility('stripePublic')}
                      >
                        {showApiKeys.stripePublic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Secret Key</Label>
                    <div className="relative">
                      <Input
                        type={showApiKeys.stripeSecret ? 'text' : 'password'}
                        value={showApiKeys.stripeSecret ? config.payment.stripeSecretKey : maskApiKey(config.payment.stripeSecretKey)}
                        onChange={(e) => handleConfigUpdate('payment', 'stripeSecretKey', e.target.value)}
                        className="pr-10"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => toggleApiKeyVisibility('stripeSecret')}
                      >
                        {showApiKeys.stripeSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* PayPal Configuration */}
              <Card className="border border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">PayPal Integration</CardTitle>
                    <Switch 
                      checked={config.payment.paypalEnabled} 
                      onCheckedChange={(checked) => handleConfigUpdate('payment', 'paypalEnabled', checked)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Client ID</Label>
                    <Input
                      value={config.payment.paypalClientId}
                      onChange={(e) => handleConfigUpdate('payment', 'paypalClientId', e.target.value)}
                      placeholder="PayPal Client ID"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Client Secret</Label>
                    <Input
                      type="password"
                      value={config.payment.paypalClientSecret}
                      onChange={(e) => handleConfigUpdate('payment', 'paypalClientSecret', e.target.value)}
                      placeholder="PayPal Client Secret"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Payment Settings */}
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">Global Payment Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Default Currency</Label>
                    <Select value={config.payment.defaultCurrency} onValueChange={(value) => handleConfigUpdate('payment', 'defaultCurrency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Transaction Fee (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={config.payment.transactionFee}
                      onChange={(e) => handleConfigUpdate('payment', 'transactionFee', parseFloat(e.target.value))}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Platform Commission (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={config.payment.platformCommission}
                      onChange={(e) => handleConfigUpdate('payment', 'platformCommission', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Configuration */}
          <TabsContent value="shipping" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="w-5 h-5 text-green-600" />
                  Shipping & Delivery Settings
                </h3>
                <p className="text-sm text-slate-600">Configure shipping providers and delivery zones</p>
              </div>
              <Button onClick={() => handleSaveConfig('shipping')} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Shipping Providers */}
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Shipping Providers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(config.shipping.providers).map(([provider, settings]) => (
                    <div key={provider} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium capitalize">{provider}</h4>
                        <Switch 
                          checked={settings.enabled} 
                          onCheckedChange={(checked) => handleNestedConfigUpdate('shipping', 'providers', provider, { ...settings, enabled: checked })}
                        />
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-sm">API Key</Label>
                          <Input
                            type="password"
                            value={settings.apiKey}
                            onChange={(e) => handleNestedConfigUpdate('shipping', 'providers', provider, { ...settings, apiKey: e.target.value })}
                            placeholder={`${provider.toUpperCase()} API Key`}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Account Number</Label>
                          <Input
                            value={settings.accountNumber}
                            onChange={(e) => handleNestedConfigUpdate('shipping', 'providers', provider, { ...settings, accountNumber: e.target.value })}
                            placeholder="Account Number"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Delivery Zones */}
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Delivery Zones</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {config.shipping.defaultZones.map((zone, index) => (
                    <div key={zone.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{zone.name}</h4>
                        <Switch 
                          checked={zone.enabled} 
                          onCheckedChange={(checked) => {
                            const updatedZones = [...config.shipping.defaultZones];
                            updatedZones[index] = { ...zone, enabled: checked };
                            handleConfigUpdate('shipping', 'defaultZones', updatedZones);
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-sm">Max Distance (miles)</Label>
                          <Input
                            type="number"
                            value={zone.maxDistance}
                            onChange={(e) => {
                              const updatedZones = [...config.shipping.defaultZones];
                              updatedZones[index] = { ...zone, maxDistance: parseInt(e.target.value) };
                              handleConfigUpdate('shipping', 'defaultZones', updatedZones);
                            }}
                          />
                        </div>
                        <div>
                          <Label className="text-sm">Base Cost ($)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={zone.baseCost}
                            onChange={(e) => {
                              const updatedZones = [...config.shipping.defaultZones];
                              updatedZones[index] = { ...zone, baseCost: parseFloat(e.target.value) };
                              handleConfigUpdate('shipping', 'defaultZones', updatedZones);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Additional Shipping Settings */}
            <Card className="border border-slate-200">
              <CardHeader>
                <CardTitle className="text-base">Additional Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Free Shipping Threshold ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={config.shipping.freeShippingThreshold}
                      onChange={(e) => handleConfigUpdate('shipping', 'freeShippingThreshold', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={config.shipping.expressDeliveryEnabled} 
                      onCheckedChange={(checked) => handleConfigUpdate('shipping', 'expressDeliveryEnabled', checked)}
                    />
                    <Label className="text-sm font-medium">Enable Express Delivery</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Branding Configuration */}
          <TabsContent value="branding" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  Branding & Theme Settings
                </h3>
                <p className="text-sm text-slate-600">Customize the platform appearance and branding</p>
              </div>
              <Button onClick={() => handleSaveConfig('branding')} className="bg-purple-600 hover:bg-purple-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="space-y-6">
              {/* Basic Branding */}
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Basic Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Platform Name</Label>
                      <Input
                        value={config.branding.platformName}
                        onChange={(e) => handleConfigUpdate('branding', 'platformName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Custom Domain</Label>
                      <Input
                        value={config.branding.customDomain}
                        onChange={(e) => handleConfigUpdate('branding', 'customDomain', e.target.value)}
                        placeholder="your-domain.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Primary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={config.branding.primaryColor}
                          onChange={(e) => handleConfigUpdate('branding', 'primaryColor', e.target.value)}
                          className="w-20 h-10 rounded-lg"
                        />
                        <Input
                          value={config.branding.primaryColor}
                          onChange={(e) => handleConfigUpdate('branding', 'primaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Secondary Color</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="color"
                          value={config.branding.secondaryColor}
                          onChange={(e) => handleConfigUpdate('branding', 'secondaryColor', e.target.value)}
                          className="w-20 h-10 rounded-lg"
                        />
                        <Input
                          value={config.branding.secondaryColor}
                          onChange={(e) => handleConfigUpdate('branding', 'secondaryColor', e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Settings */}
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Custom CSS</Label>
                    <Textarea
                      value={config.branding.customCss}
                      onChange={(e) => handleConfigUpdate('branding', 'customCss', e.target.value)}
                      placeholder="/* Custom CSS rules */"
                      rows={6}
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={config.branding.whiteLabel} 
                        onCheckedChange={(checked) => handleConfigUpdate('branding', 'whiteLabel', checked)}
                      />
                      <Label className="text-sm font-medium">White Label Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch 
                        checked={config.branding.maintenanceMode} 
                        onCheckedChange={(checked) => handleConfigUpdate('branding', 'maintenanceMode', checked)}
                      />
                      <Label className="text-sm font-medium">Maintenance Mode</Label>
                    </div>
                  </div>
                  {config.branding.maintenanceMode && (
                    <div>
                      <Label className="text-sm font-medium">Maintenance Message</Label>
                      <Textarea
                        value={config.branding.maintenanceMessage}
                        onChange={(e) => handleConfigUpdate('branding', 'maintenanceMessage', e.target.value)}
                        rows={3}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Content Management
                </h3>
                <p className="text-sm text-slate-600">Manage platform content and legal pages</p>
              </div>
              <Button onClick={() => handleSaveConfig('content')} className="bg-orange-600 hover:bg-orange-700">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>

            <div className="space-y-6">
              {/* Legal Pages */}
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Legal Pages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Terms of Service</Label>
                    <Textarea
                      value={config.content.termsOfService}
                      onChange={(e) => handleConfigUpdate('content', 'termsOfService', e.target.value)}
                      placeholder="Enter terms of service content..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Privacy Policy</Label>
                    <Textarea
                      value={config.content.privacyPolicy}
                      onChange={(e) => handleConfigUpdate('content', 'privacyPolicy', e.target.value)}
                      placeholder="Enter privacy policy content..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="border border-slate-200">
                <CardHeader>
                  <CardTitle className="text-base">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Support Email</Label>
                      <Input
                        type="email"
                        value={config.content.contactInfo.email}
                        onChange={(e) => handleNestedConfigUpdate('content', 'contactInfo', 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Support Phone</Label>
                      <Input
                        value={config.content.contactInfo.phone}
                        onChange={(e) => handleNestedConfigUpdate('content', 'contactInfo', 'phone', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Business Address</Label>
                    <Textarea
                      value={config.content.contactInfo.address}
                      onChange={(e) => handleNestedConfigUpdate('content', 'contactInfo', 'address', e.target.value)}
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default PlatformConfig;