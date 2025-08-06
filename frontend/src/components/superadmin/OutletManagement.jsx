import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Store,
  Plus,
  Search,
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Edit,
  Settings,
  Activity,
  Building
} from 'lucide-react';

const OutletManagement = () => {
  const [outlets, setOutlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/super-admin/outlets`);
      const data = await response.json();
      setOutlets(data);
    } catch (error) {
      console.error('Error fetching outlets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOutlets = outlets.filter(outlet =>
    outlet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outlet.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    outlet.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBusinessHours = (hours) => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'lowercase' });
    const todayHours = hours[today];
    if (todayHours) {
      return `${todayHours.open} - ${todayHours.close}`;
    }
    return 'Hours not set';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading outlets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Outlet Management</h2>
          <p className="text-slate-600">Manage your business locations and branch settings</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add New Outlet
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search outlets by name, address, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Outlet Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-700 text-sm font-medium">Total Outlets</p>
                <p className="text-xl font-bold text-emerald-900">{outlets.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-blue-700 text-sm font-medium">Active</p>
                <p className="text-xl font-bold text-blue-900">
                  {outlets.filter(o => o.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-orange-700 text-sm font-medium">Maintenance</p>
                <p className="text-xl font-bold text-orange-900">
                  {outlets.filter(o => o.status === 'maintenance').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-purple-700 text-sm font-medium">Cities</p>
                <p className="text-xl font-bold text-purple-900">
                  {new Set(outlets.map(o => o.city)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredOutlets.map((outlet) => (
          <Card key={outlet.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                    {outlet.name.charAt(0).toUpperCase()}
                  </div>
                  {outlet.name}
                </CardTitle>
                <Badge className={`${getStatusColor(outlet.status)} border-0`}>
                  {outlet.status.charAt(0).toUpperCase() + outlet.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Contact Information */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-900">{outlet.address}</p>
                      <p className="text-sm text-slate-600">{outlet.city}, {outlet.state} {outlet.zip_code}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-900">{outlet.phone}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-900">{outlet.email}</span>
                  </div>

                  {outlet.manager_id && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-900">Manager assigned</span>
                    </div>
                  )}
                </div>

                {/* Business Hours */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-slate-600" />
                    <span className="text-sm font-medium text-slate-900">Today's Hours</span>
                  </div>
                  <p className="text-sm text-slate-700 ml-6">
                    {formatBusinessHours(outlet.business_hours)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="w-4 h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOutlets.length === 0 && (
        <Card className="border-0 shadow-lg">
          <CardContent className="text-center py-12">
            <Store className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 mb-2">
              {outlets.length === 0 ? 'No outlets found' : 'No matching outlets'}
            </h3>
            <p className="text-slate-500 mb-4">
              {outlets.length === 0 
                ? 'Get started by adding your first business location.'
                : 'Try adjusting your search criteria.'}
            </p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Outlet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OutletManagement;