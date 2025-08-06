import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Users,
  Activity,
  Clock,
  MousePointer,
  Eye,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

const UserBehaviorAnalytics = () => {
  const [behaviorData, setBehaviorData] = useState([]);
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBehaviorData();
  }, [timeRange]);

  const fetchBehaviorData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/analytics/user-behavior?days=${timeRange}`);
      const data = await response.json();
      setBehaviorData(data);
    } catch (error) {
      console.error('Error fetching behavior data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    if (!behaviorData.length) return {};

    const latest = behaviorData[behaviorData.length - 1];
    const previous = behaviorData[behaviorData.length - 2] || latest;
    
    const dauTrend = ((latest.daily_active_users - previous.daily_active_users) / previous.daily_active_users) * 100;
    const sessionTrend = ((latest.session_duration_avg - previous.session_duration_avg) / previous.session_duration_avg) * 100;
    const retentionTrend = ((latest.user_retention_rate - previous.user_retention_rate) / previous.user_retention_rate) * 100;
    
    const avgDAU = behaviorData.reduce((sum, day) => sum + day.daily_active_users, 0) / behaviorData.length;
    const avgSessionDuration = behaviorData.reduce((sum, day) => sum + day.session_duration_avg, 0) / behaviorData.length;
    const avgRetention = behaviorData.reduce((sum, day) => sum + day.user_retention_rate, 0) / behaviorData.length;

    return {
      currentDAU: latest.daily_active_users,
      currentMAU: latest.monthly_active_users,
      currentSessionDuration: latest.session_duration_avg,
      currentRetention: latest.user_retention_rate,
      dauTrend,
      sessionTrend,
      retentionTrend,
      avgDAU,
      avgSessionDuration,
      avgRetention: avgRetention * 100
    };
  };

  const getTopFeatures = () => {
    if (!behaviorData.length) return [];
    
    const latest = behaviorData[behaviorData.length - 1];
    return Object.entries(latest.feature_usage)
      .sort(([,a], [,b]) => b - a)
      .map(([feature, usage]) => ({ feature, usage }));
  };

  const getEngagementScore = () => {
    const metrics = calculateMetrics();
    if (!metrics.currentDAU) return 0;
    
    // Simple engagement score based on multiple factors
    const dauScore = (metrics.currentDAU / 2000) * 30; // Max 30 points
    const sessionScore = (metrics.currentSessionDuration / 30) * 25; // Max 25 points  
    const retentionScore = metrics.currentRetention * 45; // Max 45 points (retention is 0-1)
    
    return Math.min(dauScore + sessionScore + retentionScore, 100);
  };

  const metrics = calculateMetrics();
  const topFeatures = getTopFeatures();
  const engagementScore = getEngagementScore();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">User Behavior Analytics</h2>
          <p className="text-slate-600">Analyze user engagement, activity patterns, and feature adoption</p>
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
          <Button onClick={fetchBehaviorData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center text-emerald-600">
                {metrics.dauTrend >= 0 ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                <span className="text-sm font-medium">{Math.abs(metrics.dauTrend || 0).toFixed(1)}%</span>
              </div>
            </div>
            <div>
              <p className="text-purple-700 text-sm font-medium mb-1">Daily Active Users</p>
              <p className="text-2xl font-bold text-purple-900">
                {metrics.currentDAU?.toLocaleString() || '0'}
              </p>
              <p className="text-purple-600 text-xs mt-1">Avg: {metrics.avgDAU?.toLocaleString(undefined, {maximumFractionDigits: 0}) || '0'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <Badge className={`${metrics.sessionTrend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'} border-0`}>
                {metrics.sessionTrend >= 0 ? '+' : ''}{metrics.sessionTrend?.toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-blue-700 text-sm font-medium mb-1">Avg Session Duration</p>
              <p className="text-2xl font-bold text-blue-900">
                {metrics.currentSessionDuration?.toFixed(1) || '0'}min
              </p>
              <p className="text-blue-600 text-xs mt-1">Avg: {metrics.avgSessionDuration?.toFixed(1) || '0'}min</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-emerald-700 text-sm font-medium mb-1">User Retention Rate</p>
              <p className="text-2xl font-bold text-emerald-900">
                {((metrics.currentRetention || 0) * 100).toFixed(1)}%
              </p>
              <p className="text-emerald-600 text-xs mt-1">Avg: {metrics.avgRetention?.toFixed(1) || '0'}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MousePointer className="w-6 h-6 text-white" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 border-0">
                {engagementScore.toFixed(0)}/100
              </Badge>
            </div>
            <div>
              <p className="text-orange-700 text-sm font-medium mb-1">Engagement Score</p>
              <p className="text-2xl font-bold text-orange-900">
                {engagementScore >= 80 ? 'High' : engagementScore >= 60 ? 'Medium' : 'Low'}
              </p>
              <p className="text-orange-600 text-xs mt-1">Calculated score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Active Users Trend */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              User Activity Trend (Last {timeRange} Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-3">
                {behaviorData.slice(-10).map((day, index) => {
                  const maxDAU = Math.max(...behaviorData.map(d => d.daily_active_users));
                  const dauPercentage = (day.daily_active_users / maxDAU) * 100;
                  const sessionPercentage = (day.session_duration_avg / 30) * 100; // Assuming max 30 min sessions
                  
                  return (
                    <div key={day.date} className="space-y-2">
                      <div className="flex items-center gap-4">
                        <div className="w-16 text-xs text-slate-600">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">DAU</span>
                            <span className="text-xs font-medium text-slate-700">{day.daily_active_users.toLocaleString()}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${dauPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-16"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-600">Avg Session</span>
                            <span className="text-xs font-medium text-slate-700">{day.session_duration_avg.toFixed(1)}min</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${sessionPercentage}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Usage */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Feature Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topFeatures.map((item, index) => {
                const maxUsage = topFeatures[0]?.usage || 1;
                const percentage = (item.usage / maxUsage) * 100;
                const colors = [
                  'from-blue-500 to-purple-500',
                  'from-emerald-500 to-teal-500', 
                  'from-orange-500 to-red-500',
                  'from-purple-500 to-pink-500',
                  'from-green-500 to-blue-500'
                ];
                
                return (
                  <div key={item.feature} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700 capitalize">
                        {item.feature.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-slate-600">{item.usage.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${colors[index % colors.length]} h-2 rounded-full transition-all duration-500`}
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

      {/* User Engagement Patterns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Login Frequency */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              Login Frequency Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {behaviorData.length > 0 && (
                <>
                  {Object.entries(behaviorData[behaviorData.length - 1].login_frequency).map(([frequency, percentage]) => {
                    return (
                      <div key={frequency} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            frequency === 'daily' ? 'bg-green-500' :
                            frequency === 'weekly' ? 'bg-blue-500' : 'bg-orange-500'
                          }`}></div>
                          <span className="text-sm font-medium text-slate-700 capitalize">{frequency} Users</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-slate-900">{percentage}%</p>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Device/Platform Analytics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-600" />
              Platform Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Mock device data */}
              {[
                { platform: 'Desktop', percentage: 65, icon: Monitor, color: 'bg-blue-500' },
                { platform: 'Mobile', percentage: 28, icon: Smartphone, color: 'bg-green-500' },
                { platform: 'Tablet', percentage: 7, icon: Tablet, color: 'bg-purple-500' }
              ].map((device) => (
                <div key={device.platform} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${device.color} rounded-lg flex items-center justify-center`}>
                      <device.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{device.platform}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                      <div 
                        className={`${device.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${device.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-8">{device.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Journey Analytics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-pink-600" />
            User Engagement Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
              <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Page Views</h3>
              <p className="text-2xl font-bold text-pink-600">
                {behaviorData.length > 0 ? behaviorData[behaviorData.length - 1].page_views?.toLocaleString() : '0'}
              </p>
              <p className="text-sm text-slate-600 mt-1">Daily average</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Monthly Active</h3>
              <p className="text-2xl font-bold text-blue-600">
                {metrics.currentMAU?.toLocaleString() || '0'}
              </p>
              <p className="text-sm text-slate-600 mt-1">Unique users</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Growth Rate</h3>
              <p className="text-2xl font-bold text-emerald-600">
                +{Math.abs(metrics.dauTrend || 0).toFixed(1)}%
              </p>
              <p className="text-sm text-slate-600 mt-1">Week over week</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserBehaviorAnalytics;