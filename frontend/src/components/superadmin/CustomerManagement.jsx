import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Users,
  Search,
  Eye,
  Mail,
  Phone,
  MapPin,
  ShoppingCart,
  Star,
  Calendar,
  TrendingUp,
  Award,
  AlertCircle,
  UserCheck,
  UserX
} from 'lucide-react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    filterCustomers();
  }, [customers, searchTerm, statusFilter]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      // Mock customer data
      const mockCustomers = [
        {
          id: "cust_001",
          name: "Alice Johnson",
          email: "alice@email.com",
          phone: "+1-555-1001",
          addresses: [
            { type: "home", address: "789 Customer St, New York, NY 10003" },
            { type: "work", address: "456 Office Blvd, New York, NY 10001" }
          ],
          total_orders: 42,
          total_spent: 1247.65,
          loyalty_points: 124,
          status: "active",
          preferences: { delivery_time: "evening", payment_method: "card" },
          created_at: "2023-01-15T10:00:00Z",
          last_order_at: "2024-01-10T14:30:00Z"
        },
        {
          id: "cust_002",
          name: "Bob Smith",
          email: "bob@email.com", 
          phone: "+1-555-1002",
          addresses: [
            { type: "home", address: "321 Another St, New York, NY 10004" }
          ],
          total_orders: 18,
          total_spent: 543.20,
          loyalty_points: 54,
          status: "active",
          preferences: { delivery_time: "morning", payment_method: "wallet" },
          created_at: "2023-06-20T16:45:00Z",
          last_order_at: "2024-01-08T09:15:00Z"
        },
        {
          id: "cust_003",
          name: "Carol Wilson",
          email: "carol@email.com",
          phone: "+1-555-1003",
          addresses: [
            { type: "home", address: "654 Main Ave, New York, NY 10005" }
          ],
          total_orders: 67,
          total_spent: 2134.80,
          loyalty_points: 213,
          status: "active",
          preferences: { delivery_time: "afternoon", payment_method: "card" },
          created_at: "2022-11-12T08:20:00Z",
          last_order_at: "2024-01-09T18:45:00Z"
        },
        {
          id: "cust_004",
          name: "David Brown",
          email: "david@email.com",
          phone: "+1-555-1004",
          addresses: [],
          total_orders: 3,
          total_spent: 67.50,
          loyalty_points: 6,
          status: "inactive",
          preferences: {},
          created_at: "2023-12-01T12:00:00Z",
          last_order_at: "2023-12-15T15:30:00Z"
        }
      ];

      setCustomers(mockCustomers);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCustomers = () => {
    let filtered = customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(customer => customer.status === statusFilter);
    }

    // Sort by total spent (highest first)
    filtered.sort((a, b) => b.total_spent - a.total_spent);

    setFilteredCustomers(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'banned':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerTier = (totalSpent) => {
    if (totalSpent >= 2000) return { tier: 'VIP', color: 'text-purple-600', icon: '👑' };
    if (totalSpent >= 1000) return { tier: 'Gold', color: 'text-yellow-600', icon: '⭐' };
    if (totalSpent >= 500) return { tier: 'Silver', color: 'text-gray-600', icon: '🥈' };
    return { tier: 'Bronze', color: 'text-orange-600', icon: '🥉' };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Customer Management</h2>
          <p className="text-slate-600">View customer profiles, order history, and support cases</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  placeholder="Search customers by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customer Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-blue-700 text-sm font-medium">Total Customers</p>
                <p className="text-xl font-bold text-blue-900">{customers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-700 text-sm font-medium">Active</p>
                <p className="text-xl font-bold text-emerald-900">
                  {customers.filter(c => c.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-purple-700 text-sm font-medium">VIP Customers</p>
                <p className="text-xl font-bold text-purple-900">
                  {customers.filter(c => c.total_spent >= 2000).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-orange-700 text-sm font-medium">Avg Order Value</p>
                <p className="text-xl font-bold text-orange-900">
                  ${(customers.reduce((sum, c) => sum + c.total_spent, 0) / 
                     customers.reduce((sum, c) => sum + c.total_orders, 0) || 0).toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Customers ({filteredCustomers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCustomers.map((customer) => {
              const tier = getCustomerTier(customer.total_spent);
              
              return (
                <div key={customer.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white text-lg font-bold">
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{customer.name}</h4>
                          <span className="text-lg">{tier.icon}</span>
                          <Badge className={`${tier.color} bg-transparent border-0 text-xs font-medium`}>
                            {tier.tier}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Joined {formatDate(customer.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-6">
                          <div>
                            <p className="text-sm text-slate-500">Total Spent</p>
                            <p className="font-bold text-green-600">${customer.total_spent.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Orders</p>
                            <p className="font-bold text-slate-900">{customer.total_orders}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500">Points</p>
                            <p className="font-bold text-purple-600">{customer.loyalty_points}</p>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Last order: {customer.last_order_at ? getTimeAgo(customer.last_order_at) : 'Never'}
                        </p>
                      </div>

                      <Badge className={`${getStatusColor(customer.status)} border-0`}>
                        {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                      </Badge>

                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      {/* Addresses */}
                      <div>
                        <p className="text-slate-500 mb-1">Addresses:</p>
                        {customer.addresses.length > 0 ? (
                          <div className="space-y-1">
                            {customer.addresses.slice(0, 2).map((addr, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span className="text-slate-700 text-xs">
                                  <strong>{addr.type}:</strong> {addr.address.split(',')[0]}
                                </span>
                              </div>
                            ))}
                            {customer.addresses.length > 2 && (
                              <p className="text-xs text-slate-500 ml-5">+{customer.addresses.length - 2} more</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-400 text-xs">No addresses saved</p>
                        )}
                      </div>

                      {/* Preferences */}
                      <div>
                        <p className="text-slate-500 mb-1">Preferences:</p>
                        <div className="space-y-1">
                          {customer.preferences.delivery_time && (
                            <p className="text-slate-700 text-xs">
                              <strong>Delivery:</strong> {customer.preferences.delivery_time}
                            </p>
                          )}
                          {customer.preferences.payment_method && (
                            <p className="text-slate-700 text-xs">
                              <strong>Payment:</strong> {customer.preferences.payment_method}
                            </p>
                          )}
                          {Object.keys(customer.preferences).length === 0 && (
                            <p className="text-slate-400 text-xs">No preferences set</p>
                          )}
                        </div>
                      </div>

                      {/* Customer Insights */}
                      <div>
                        <p className="text-slate-500 mb-1">Insights:</p>
                        <div className="space-y-1">
                          <p className="text-slate-700 text-xs">
                            <strong>Avg Order:</strong> ${customer.total_orders > 0 ? (customer.total_spent / customer.total_orders).toFixed(2) : '0.00'}
                          </p>
                          <p className="text-slate-700 text-xs">
                            <strong>Customer since:</strong> {Math.floor((new Date() - new Date(customer.created_at)) / (1000 * 60 * 60 * 24 * 30))} months
                          </p>
                          {customer.status === 'inactive' && (
                            <div className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="w-3 h-3" />
                              <span className="text-xs">Needs attention</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No customers found</h3>
              <p className="text-slate-500">
                {customers.length === 0 
                  ? 'Customers will appear here when they start placing orders.'
                  : 'Try adjusting your search criteria.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerManagement;