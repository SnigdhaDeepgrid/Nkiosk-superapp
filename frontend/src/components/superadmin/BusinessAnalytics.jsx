import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Store,
  RefreshCw,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  Calendar
} from 'lucide-react';

const BusinessAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/super-admin/analytics/dashboard`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-slate-600 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-600 mb-2">No analytics data available</h3>
        <p className="text-slate-500">Unable to load business analytics at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Business Analytics</h2>
          <p className="text-slate-600">Track your business performance and growth metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 days</SelectItem>
              <SelectItem value="30days">30 days</SelectItem>
              <SelectItem value="90days">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalytics} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-emerald-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{analyticsData.revenue_growth}%</span>
              </div>
            </div>
            <div>
              <p className="text-emerald-700 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-emerald-900">
                ${analyticsData.total_revenue.toLocaleString()}
              </p>
              <p className="text-emerald-600 text-xs mt-1">This period</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 border-0">
                {analyticsData.pending_orders} pending
              </Badge>
            </div>
            <div>
              <p className="text-blue-700 text-sm font-medium mb-1">Total Orders</p>
              <p className="text-2xl font-bold text-blue-900">
                {analyticsData.total_orders.toLocaleString()}
              </p>
              <p className="text-blue-600 text-xs mt-1">All time</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-purple-700 text-sm font-medium mb-1">Active Customers</p>
              <p className="text-2xl font-bold text-purple-900">
                {analyticsData.active_customers.toLocaleString()}
              </p>
              <p className="text-purple-600 text-xs mt-1">This month</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-0">
                Growth
              </Badge>
            </div>
            <div>
              <p className="text-orange-700 text-sm font-medium mb-1">Avg Order Value</p>
              <p className="text-2xl font-bold text-orange-900">
                ${(analyticsData.total_revenue / analyticsData.total_orders).toFixed(2)}
              </p>
              <p className="text-orange-600 text-xs mt-1">Per order</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.top_products.map((product, index) => {
                const maxRevenue = Math.max(...analyticsData.top_products.map(p => p.revenue));
                const percentage = (product.revenue / maxRevenue) * 100;
                
                return (
                  <div key={product.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          'bg-orange-500'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-600">{product.sales} sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${product.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Sales by Outlet */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-600" />
              Sales by Outlet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.sales_by_outlet.map((outlet, index) => {
                const maxSales = Math.max(...analyticsData.sales_by_outlet.map(o => o.sales));
                const percentage = (outlet.sales / maxSales) * 100;
                
                return (
                  <div key={outlet.outlet_name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                          {outlet.outlet_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{outlet.outlet_name}</p>
                          <p className="text-xs text-slate-600">{outlet.orders} orders</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${outlet.sales.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.recent_orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    #{order.order_number.slice(-3)}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{order.customer_name}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${order.total}</p>
                  <Badge className={`text-xs border-0 ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Insights */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-green-50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Business Insights & Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Revenue Growth Insight */}
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Strong Growth</h3>
              <p className="text-sm text-slate-600">
                Your revenue is growing at {analyticsData.revenue_growth}% this period. 
                Keep focusing on your top-performing products.
              </p>
            </div>

            {/* Customer Engagement */}
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Active Customer Base</h3>
              <p className="text-sm text-slate-600">
                You have {analyticsData.active_customers} active customers. 
                Consider implementing a loyalty program to increase retention.
              </p>
            </div>

            {/* Order Efficiency */}
            <div className="text-center p-4 bg-white rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Order Management</h3>
              <p className="text-sm text-slate-600">
                You have {analyticsData.pending_orders} pending orders. 
                Focus on quick processing to improve customer satisfaction.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessAnalytics;