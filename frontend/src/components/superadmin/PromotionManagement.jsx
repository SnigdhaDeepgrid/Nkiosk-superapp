import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Tag,
  Plus,
  Search,
  Edit,
  Trash2,
  Copy,
  TrendingUp,
  Calendar,
  Target,
  DollarSign,
  Percent,
  Gift,
  Users
} from 'lucide-react';

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    filterPromotions();
  }, [promotions, searchTerm, statusFilter]);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      // Mock promotion data
      const mockPromotions = [
        {
          id: "promo_001",
          name: "New Year Special",
          description: "Get 20% off on all orders above $50",
          type: "percentage",
          value: 20,
          min_order_amount: 50,
          max_discount: 100,
          code: "NEWYEAR20",
          start_date: "2024-01-01T00:00:00Z",
          end_date: "2024-01-31T23:59:59Z",
          usage_limit: 1000,
          used_count: 247,
          applicable_outlets: ["out_001", "out_002"],
          applicable_products: [],
          status: "active",
          created_at: "2023-12-15T10:00:00Z"
        },
        {
          id: "promo_002",
          name: "Free Delivery Weekend",
          description: "Free delivery on all orders this weekend",
          type: "free_delivery",
          value: 0,
          min_order_amount: 25,
          max_discount: null,
          code: "FREEDEL",
          start_date: "2024-01-13T00:00:00Z",
          end_date: "2024-01-14T23:59:59Z",
          usage_limit: null,
          used_count: 89,
          applicable_outlets: ["out_001"],
          applicable_products: [],
          status: "active",
          created_at: "2024-01-10T09:30:00Z"
        },
        {
          id: "promo_003",
          name: "Buy One Get One Coffee",
          description: "Buy one premium coffee, get one free",
          type: "buy_one_get_one",
          value: 1,
          min_order_amount: 0,
          max_discount: null,
          code: "BOGO_COFFEE",
          start_date: "2024-01-01T00:00:00Z",
          end_date: "2024-01-15T23:59:59Z",
          usage_limit: 500,
          used_count: 156,
          applicable_outlets: [],
          applicable_products: ["prd_003"],
          status: "active",
          created_at: "2023-12-28T14:20:00Z"
        },
        {
          id: "promo_004",
          name: "Christmas Sale",
          description: "Flat $10 off on orders above $75",
          type: "fixed_amount",
          value: 10,
          min_order_amount: 75,
          max_discount: null,
          code: "XMAS10",
          start_date: "2023-12-20T00:00:00Z",
          end_date: "2023-12-31T23:59:59Z",
          usage_limit: 2000,
          used_count: 1876,
          applicable_outlets: ["out_001", "out_002"],
          applicable_products: [],
          status: "expired",
          created_at: "2023-12-01T11:45:00Z"
        }
      ];

      setPromotions(mockPromotions);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPromotions = () => {
    let filtered = promotions.filter(promo =>
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (statusFilter !== 'all') {
      filtered = filtered.filter(promo => promo.status === statusFilter);
    }

    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    setFilteredPromotions(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPromotionTypeIcon = (type) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed_amount':
        return <DollarSign className="w-4 h-4" />;
      case 'buy_one_get_one':
        return <Gift className="w-4 h-4" />;
      case 'free_delivery':
        return <Target className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getPromotionTypeColor = (type) => {
    switch (type) {
      case 'percentage':
        return 'bg-blue-100 text-blue-800';
      case 'fixed_amount':
        return 'bg-green-100 text-green-800';
      case 'buy_one_get_one':
        return 'bg-purple-100 text-purple-800';
      case 'free_delivery':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isPromotionActive = (promo) => {
    const now = new Date();
    const startDate = new Date(promo.start_date);
    const endDate = new Date(promo.end_date);
    return now >= startDate && now <= endDate && promo.status === 'active';
  };

  const getUsagePercentage = (promo) => {
    if (!promo.usage_limit) return 0;
    return (promo.used_count / promo.usage_limit) * 100;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Promotion Management</h2>
          <p className="text-slate-600">Create and manage discounts, offers, and promotional campaigns</p>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Create Promotion
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
                  placeholder="Search promotions by name, code, or description..."
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
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-emerald-700 text-sm font-medium">Total Promotions</p>
                <p className="text-xl font-bold text-emerald-900">{promotions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-blue-700 text-sm font-medium">Active</p>
                <p className="text-xl font-bold text-blue-900">
                  {promotions.filter(p => p.status === 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-purple-700 text-sm font-medium">Total Usage</p>
                <p className="text-xl font-bold text-purple-900">
                  {promotions.reduce((sum, p) => sum + p.used_count, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-orange-700 text-sm font-medium">Expiring Soon</p>
                <p className="text-xl font-bold text-orange-900">
                  {promotions.filter(p => {
                    const daysUntilExpiry = Math.ceil((new Date(p.end_date) - new Date()) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0 && p.status === 'active';
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotions List */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-green-600" />
            Promotions ({filteredPromotions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPromotions.map((promotion) => {
              const usagePercentage = getUsagePercentage(promotion);
              const daysUntilExpiry = Math.ceil((new Date(promotion.end_date) - new Date()) / (1000 * 60 * 60 * 24));
              
              return (
                <div key={promotion.id} className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white">
                        {getPromotionTypeIcon(promotion.type)}
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900">{promotion.name}</h4>
                          <Badge className={`${getPromotionTypeColor(promotion.type)} border-0 gap-1`}>
                            {getPromotionTypeIcon(promotion.type)}
                            {promotion.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{promotion.description}</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span>Code: <strong className="text-slate-700">{promotion.code}</strong></span>
                          <span>Valid: {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}</span>
                          {daysUntilExpiry > 0 && daysUntilExpiry <= 7 && promotion.status === 'active' && (
                            <span className="text-orange-600 font-medium">Expires in {daysUntilExpiry} days</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={`${getStatusColor(promotion.status)} border-0`}>
                        {promotion.status.charAt(0).toUpperCase() + promotion.status.slice(1)}
                      </Badge>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Promotion Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    {/* Usage Stats */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Usage Statistics</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Used:</span>
                          <span className="font-medium text-slate-900">
                            {promotion.used_count}{promotion.usage_limit ? ` / ${promotion.usage_limit}` : ''}
                          </span>
                        </div>
                        {promotion.usage_limit && (
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Discount Details */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Discount Details</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Value:</span>
                          <span className="font-medium text-slate-900">
                            {promotion.type === 'percentage' ? `${promotion.value}%` :
                             promotion.type === 'fixed_amount' ? `$${promotion.value}` :
                             promotion.type === 'buy_one_get_one' ? 'BOGO' :
                             'Free Delivery'}
                          </span>
                        </div>
                        {promotion.min_order_amount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Min Order:</span>
                            <span className="font-medium text-slate-900">${promotion.min_order_amount}</span>
                          </div>
                        )}
                        {promotion.max_discount && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Max Discount:</span>
                            <span className="font-medium text-slate-900">${promotion.max_discount}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Applicability */}
                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Applicability</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Outlets:</span>
                          <span className="font-medium text-slate-900">
                            {promotion.applicable_outlets.length > 0 ? 
                              `${promotion.applicable_outlets.length} outlets` : 'All outlets'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Products:</span>
                          <span className="font-medium text-slate-900">
                            {promotion.applicable_products.length > 0 ? 
                              `${promotion.applicable_products.length} products` : 'All products'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <Tag className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No promotions found</h3>
              <p className="text-slate-500 mb-4">
                {promotions.length === 0 
                  ? 'Create your first promotion to boost sales and attract customers.'
                  : 'Try adjusting your search criteria.'}
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Promotion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PromotionManagement;