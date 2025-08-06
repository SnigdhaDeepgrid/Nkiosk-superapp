import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  CreditCard,
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const RevenueAnalytics = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [tenantData, setTenantData] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      // Fetch revenue data
      const revenueResponse = await fetch(`${backendUrl}/api/analytics/revenue?days=${timeRange}`);
      const revenue = await revenueResponse.json();
      setRevenueData(revenue);

      // Fetch geographic data
      const geoResponse = await fetch(`${backendUrl}/api/analytics/geographic`);
      const geo = await geoResponse.json();
      setGeoData(geo);

      // Fetch tenant performance data
      const tenantResponse = await fetch(`${backendUrl}/api/analytics/tenant-performance`);
      const tenant = await tenantResponse.json();
      setTenantData(tenant);

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummaryStats = () => {
    if (!revenueData.length) return {};

    const totalRevenue = revenueData.reduce((sum, day) => sum + day.total_revenue, 0);
    const avgDailyRevenue = totalRevenue / revenueData.length;
    const lastWeekRevenue = revenueData.slice(-7).reduce((sum, day) => sum + day.total_revenue, 0);
    const prevWeekRevenue = revenueData.slice(-14, -7).reduce((sum, day) => sum + day.total_revenue, 0);
    const growthRate = prevWeekRevenue > 0 ? ((lastWeekRevenue - prevWeekRevenue) / prevWeekRevenue) * 100 : 0;

    return {
      totalRevenue,
      avgDailyRevenue,
      growthRate,
      totalTenants: revenueData[revenueData.length - 1]?.tenant_count || 0
    };
  };

  const stats = calculateSummaryStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Revenue Analytics</h2>
          <p className="text-slate-600">Track revenue performance, growth trends, and geographic distribution</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 days</SelectItem>
              <SelectItem value="30">30 days</SelectItem>
              <SelectItem value="90">90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchAnalyticsData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-emerald-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{stats.growthRate?.toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-blue-700 text-sm font-medium mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">
                ${stats.totalRevenue?.toLocaleString() || '0'}
              </p>
              <p className="text-blue-600 text-xs mt-1">Last {timeRange} days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 border-0">
                Active
              </Badge>
            </div>
            <div>
              <p className="text-emerald-700 text-sm font-medium mb-1">Avg Daily Revenue</p>
              <p className="text-2xl font-bold text-emerald-900">
                ${stats.avgDailyRevenue?.toLocaleString(undefined, {maximumFractionDigits: 0}) || '0'}
              </p>
              <p className="text-emerald-600 text-xs mt-1">Per day average</p>
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
              <p className="text-purple-700 text-sm font-medium mb-1">Active Tenants</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats.totalTenants || '0'}
              </p>
              <p className="text-purple-600 text-xs mt-1">Contributing revenue</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-0">
                Growth
              </Badge>
            </div>
            <div>
              <p className="text-orange-700 text-sm font-medium mb-1">Revenue per Tenant</p>
              <p className="text-2xl font-bold text-orange-900">
                ${((stats.totalRevenue || 0) / (stats.totalTenants || 1)).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </p>
              <p className="text-orange-600 text-xs mt-1">Average contribution</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Revenue Trend (Last {timeRange} Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Simple visualization using progress bars */}
              <div className="space-y-3">
                {revenueData.slice(-10).map((day, index) => {
                  const maxRevenue = Math.max(...revenueData.map(d => d.total_revenue));
                  const percentage = (day.total_revenue / maxRevenue) * 100;
                  
                  return (
                    <div key={day.date} className="flex items-center gap-4">
                      <div className="w-16 text-xs text-slate-600">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                      <div className="flex-1">
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-20 text-right text-sm font-medium text-slate-700">
                        ${day.total_revenue.toLocaleString(undefined, {maximumFractionDigits: 0})}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-600" />
              Revenue Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {revenueData.length > 0 && (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-700">Subscriptions</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          ${(revenueData[revenueData.length - 1]?.subscription_revenue || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </p>
                        <p className="text-xs text-slate-500">70%</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-medium text-slate-700">Transactions</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-900">
                          ${(revenueData[revenueData.length - 1]?.transaction_revenue || 0).toLocaleString(undefined, {maximumFractionDigits: 0})}
                        </p>
                        <p className="text-xs text-slate-500">30%</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Revenue Distribution */}
      {geoData && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Geographic Revenue Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">By Region</h4>
                <div className="space-y-3">
                  {geoData.revenue_by_region.map((region, index) => (
                    <div key={region.region} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-blue-500' : 
                          index === 1 ? 'bg-emerald-500' :
                          index === 2 ? 'bg-purple-500' :
                          index === 3 ? 'bg-orange-500' : 'bg-slate-500'
                        }`}></div>
                        <span className="font-medium text-slate-700">{region.region}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${region.revenue.toLocaleString()}</p>
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-slate-500">{region.percentage}%</span>
                          {region.growth > 0 ? (
                            <span className="text-emerald-600 flex items-center">
                              <ArrowUpRight className="w-3 h-3" />
                              {region.growth.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-red-600 flex items-center">
                              <ArrowDownRight className="w-3 h-3" />
                              {Math.abs(region.growth).toFixed(1)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Top Cities</h4>
                <div className="space-y-3">
                  {geoData.top_cities.map((city, index) => (
                    <div key={city.city} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{city.city}</p>
                          <p className="text-xs text-slate-500">{city.tenants} tenants</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${city.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performing Tenants */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Top Performing Tenants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tenantData.slice(0, 8).map((tenant, index) => (
              <div key={tenant.tenant_name} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{tenant.tenant_name}</h4>
                    <p className="text-sm text-slate-600">{tenant.customer_count} customers</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Monthly Revenue</p>
                    <p className="font-bold text-slate-900">${tenant.monthly_revenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Orders</p>
                    <p className="font-bold text-slate-900">{tenant.monthly_orders.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Growth</p>
                    <div className="flex items-center justify-center">
                      {tenant.growth_rate > 0 ? (
                        <span className="text-emerald-600 font-medium text-sm flex items-center">
                          <ArrowUpRight className="w-3 h-3 mr-1" />
                          {tenant.growth_rate.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="text-red-600 font-medium text-sm flex items-center">
                          <ArrowDownRight className="w-3 h-3 mr-1" />
                          {Math.abs(tenant.growth_rate).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueAnalytics;