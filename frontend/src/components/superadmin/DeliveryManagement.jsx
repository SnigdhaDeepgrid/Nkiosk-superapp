import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Truck,
  Plus,
  Search,
  MapPin,
  Phone,
  Star,
  Navigation,
  Clock,
  Package,
  User,
  Activity,
  AlertCircle
} from 'lucide-react';

const DeliveryManagement = () => {
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDeliveryData();
  }, []);

  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      // Mock data for delivery partners
      const partners = [
        {
          id: "dp_001",
          name: "Mike Johnson",
          email: "mike.delivery@service.com",
          phone: "+1-555-0301",
          vehicle_type: "bike",
          license_number: "DL123456",
          status: "on_delivery",
          current_location: { lat: 40.7128, lng: -74.0060 },
          rating: 4.8,
          total_deliveries: 1247,
          active_orders: ["ord_001", "ord_003"]
        },
        {
          id: "dp_002",
          name: "Sarah Wilson",
          email: "sarah.driver@logistics.com",
          phone: "+1-555-0302",
          vehicle_type: "car",
          license_number: "DL789012",
          status: "active",
          current_location: { lat: 40.7589, lng: -73.9851 },
          rating: 4.9,
          total_deliveries: 892,
          active_orders: []
        },
        {
          id: "dp_003",
          name: "David Chen",
          email: "david@fastdelivery.com",
          phone: "+1-555-0303",
          vehicle_type: "van",
          license_number: "DL345678",
          status: "offline",
          current_location: null,
          rating: 4.6,
          total_deliveries: 654,
          active_orders: []
        }
      ];

      // Mock active deliveries
      const deliveries = [
        {
          id: "del_001",
          order_id: "ord_001",
          order_number: "ORD-2024-001",
          driver_id: "dp_001",
          driver_name: "Mike Johnson",
          customer_name: "Alice Johnson",
          pickup_address: "Downtown Store, 123 Main St",
          delivery_address: "789 Customer St, New York, NY",
          status: "in_transit",
          estimated_time: "15 mins",
          progress: 75
        },
        {
          id: "del_002",
          order_id: "ord_003",
          order_number: "ORD-2024-003",
          driver_id: "dp_001",
          driver_name: "Mike Johnson",
          customer_name: "Carol Wilson",
          pickup_address: "Mall Branch, 456 Shopping Center Blvd",
          delivery_address: "321 Another Ave, New York, NY",
          status: "picked_up",
          estimated_time: "25 mins",
          progress: 40
        }
      ];

      setDeliveryPartners(partners);
      setActiveDeliveries(deliveries);
    } catch (error) {
      console.error('Error fetching delivery data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on_delivery':
        return 'bg-blue-100 text-blue-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDeliveryStatusColor = (status) => {
    switch (status) {
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
      case 'in_transit':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVehicleIcon = (vehicleType) => {
    // You could add specific vehicle icons here
    return <Truck className="w-4 h-4" />;
  };

  const filteredPartners = deliveryPartners.filter(partner =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partner.phone.includes(searchTerm) ||
    partner.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading delivery data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Delivery Management</h2>
          <p className="text-slate-600">Manage delivery partners and track active deliveries</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Delivery Partner
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search delivery partners by name, phone, or vehicle type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-blue-700 text-sm font-medium">Total Partners</p>
                <p className="text-xl font-bold text-blue-900">{deliveryPartners.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-700 text-sm font-medium">Online</p>
                <p className="text-xl font-bold text-emerald-900">
                  {deliveryPartners.filter(p => ['active', 'on_delivery'].includes(p.status)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-purple-700 text-sm font-medium">On Delivery</p>
                <p className="text-xl font-bold text-purple-900">
                  {deliveryPartners.filter(p => p.status === 'on_delivery').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-orange-700 text-sm font-medium">Active Deliveries</p>
                <p className="text-xl font-bold text-orange-900">{activeDeliveries.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Deliveries */}
      {activeDeliveries.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5 text-purple-600" />
              Active Deliveries ({activeDeliveries.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDeliveries.map((delivery) => (
                <div key={delivery.id} className="border border-slate-200 rounded-xl p-4 bg-gradient-to-r from-white to-blue-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        #{delivery.order_number.slice(-3)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900">{delivery.customer_name}</h4>
                        <p className="text-sm text-slate-600">Driver: {delivery.driver_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getDeliveryStatusColor(delivery.status)} border-0`}>
                        {delivery.status.replace('_', ' ')}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">ETA: {delivery.estimated_time}</p>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Progress</span>
                      <span>{delivery.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${delivery.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Addresses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 mb-1">Pickup from:</p>
                      <p className="text-slate-900">{delivery.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 mb-1">Deliver to:</p>
                      <p className="text-slate-900">{delivery.delivery_address}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delivery Partners */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-green-600" />
            Delivery Partners ({filteredPartners.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                      {partner.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{partner.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        {getVehicleIcon(partner.vehicle_type)}
                        <span className="capitalize">{partner.vehicle_type}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span>{partner.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getStatusColor(partner.status)} border-0`}>
                    {partner.status === 'on_delivery' ? 'On Delivery' : partner.status}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-900">{partner.phone}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-900">{partner.total_deliveries} total deliveries</span>
                  </div>

                  {partner.current_location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-900">
                        Location: {partner.current_location.lat.toFixed(4)}, {partner.current_location.lng.toFixed(4)}
                      </span>
                    </div>
                  )}

                  {partner.active_orders.length > 0 && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">
                          Active Orders ({partner.active_orders.length})
                        </span>
                      </div>
                      <div className="text-xs text-blue-700">
                        Currently delivering {partner.active_orders.length} order{partner.active_orders.length !== 1 ? 's' : ''}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="flex-1">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    
                    {partner.status === 'active' && (
                      <Button variant="outline" size="sm" className="flex-1">
                        <Package className="w-4 h-4 mr-2" />
                        Assign Order
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-12">
              <Truck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No delivery partners found</h3>
              <p className="text-slate-500 mb-4">
                {deliveryPartners.length === 0 
                  ? 'Start by adding delivery partners to handle customer orders.'
                  : 'Try adjusting your search criteria.'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Delivery Partner
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryManagement;