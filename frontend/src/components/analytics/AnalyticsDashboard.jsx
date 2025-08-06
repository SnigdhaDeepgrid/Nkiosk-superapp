import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Zap,
  RefreshCw,
  Download,
  Eye,
  Clock,
  Globe,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import RevenueAnalytics from './RevenueAnalytics';
import UserBehaviorAnalytics from './UserBehaviorAnalytics';
import PerformanceAnalytics from './PerformanceAnalytics';

const AnalyticsDashboard = () => {
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchSummaryData();
  }, []);

  const fetchSummaryData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/analytics/summary`);
      const data = await response.json();
      setSummaryData(data);
    } catch (error) {
      console.error('Error fetching summary data:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Advanced Analytics</h1>
          <p className="text-slate-600">Comprehensive analytics dashboard with revenue, user behavior, and performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={fetchSummaryData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh Data
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Executive Summary Cards */}
      {summaryData && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center text-blue-100">
                  {summaryData.revenue_growth >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{Math.abs(summaryData.revenue_growth).toFixed(1)}%</span>
                </div>
              </div>
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-white mb-1">
                  ${summaryData.total_revenue.toLocaleString()}
                </p>
                <p className="text-blue-200 text-xs">Weekly performance</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  Active
                </Badge>
              </div>
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Active Users</p>
                <p className="text-2xl font-bold text-white mb-1">
                  {summaryData.active_users.toLocaleString()}
                </p>
                <p className="text-emerald-200 text-xs">
                  of {summaryData.total_users.toLocaleString()} total
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="w-3 h-3 bg-white/40 rounded-full animate-pulse"></div>
              </div>
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Conversion Rate</p>
                <p className="text-2xl font-bold text-white mb-1">
                  {summaryData.conversion_rate.toFixed(1)}%
                </p>
                <p className="text-purple-200 text-xs">Monthly average</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  {summaryData.system_uptime.toFixed(1)}%
                </Badge>
              </div>
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">System Uptime</p>
                <p className="text-2xl font-bold text-white mb-1">
                  {summaryData.system_uptime >= 99.9 ? 'Excellent' : 
                   summaryData.system_uptime >= 99.5 ? 'Good' : 
                   summaryData.system_uptime >= 99.0 ? 'Fair' : 'Poor'}
                </p>
                <p className="text-orange-200 text-xs">Last 24 hours</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Key Performance Indicators */}
      {summaryData && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-50 to-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Key Performance Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {summaryData.avg_session_duration.toFixed(1)}min
                </p>
                <p className="text-sm text-slate-600">Avg Session Duration</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {summaryData.revenue_growth.toFixed(1)}%
                </p>
                <p className="text-sm text-slate-600">Revenue Growth</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {summaryData.conversion_rate.toFixed(1)}%
                </p>
                <p className="text-sm text-slate-600">Conversion Rate</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <TrendingDown className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {summaryData.churn_rate.toFixed(1)}%
                </p>
                <p className="text-sm text-slate-600">Churn Rate</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  {summaryData.system_uptime.toFixed(2)}%
                </p>
                <p className="text-sm text-slate-600">System Uptime</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 mb-1">
                  ${(summaryData.total_revenue / 7).toLocaleString(undefined, {maximumFractionDigits: 0})}
                </p>
                <p className="text-sm text-slate-600">Daily Revenue Avg</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tabs */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b border-slate-200/60 bg-gradient-to-r from-white/90 to-blue-50/30 px-6 pt-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-100/80 p-1 rounded-xl">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="revenue" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                <DollarSign className="w-4 h-4 mr-2" />
                Revenue
              </TabsTrigger>
              <TabsTrigger 
                value="behavior" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                <Users className="w-4 h-4 mr-2" />
                User Behavior
              </TabsTrigger>
              <TabsTrigger 
                value="performance" 
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-lg text-sm font-medium"
              >
                <Zap className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="p-6 mt-0">
            <div className="space-y-6">
              <div className="text-center py-8">
                <BarChart3 className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Analytics Overview</h3>
                <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
                  Get a comprehensive view of your platform's performance with our advanced analytics suite. 
                  Dive into specific areas using the tabs above.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <Button 
                    variant="outline" 
                    className="gap-2 p-6 h-auto flex-col"
                    onClick={() => setActiveTab('revenue')}
                  >
                    <DollarSign className="w-8 h-8 text-emerald-600" />
                    <div>
                      <p className="font-semibold">Revenue Analytics</p>
                      <p className="text-sm text-slate-500">Track financial performance</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="gap-2 p-6 h-auto flex-col"
                    onClick={() => setActiveTab('behavior')}
                  >
                    <Users className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="font-semibold">User Behavior</p>
                      <p className="text-sm text-slate-500">Analyze user engagement</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="gap-2 p-6 h-auto flex-col"
                    onClick={() => setActiveTab('performance')}
                  >
                    <Zap className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="font-semibold">Performance</p>
                      <p className="text-sm text-slate-500">Monitor system health</p>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Quick insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Revenue Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Weekly Growth</span>
                        <span className="text-sm font-semibold text-emerald-600">
                          +{summaryData?.revenue_growth.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Total Revenue</span>
                        <span className="text-sm font-semibold text-slate-900">
                          ${summaryData?.total_revenue.toLocaleString()}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => setActiveTab('revenue')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Uptime</span>
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">
                          {summaryData?.system_uptime.toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Active Users</span>
                        <span className="text-sm font-semibold text-slate-900">
                          {summaryData?.active_users.toLocaleString()}
                        </span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-3"
                        onClick={() => setActiveTab('performance')}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="p-6 mt-0">
            <RevenueAnalytics />
          </TabsContent>

          <TabsContent value="behavior" className="p-6 mt-0">
            <UserBehaviorAnalytics />
          </TabsContent>

          <TabsContent value="performance" className="p-6 mt-0">
            <PerformanceAnalytics />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;