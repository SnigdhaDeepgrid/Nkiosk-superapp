import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import {
  Cpu,
  HardDrive,
  Zap,
  Activity,
  Clock,
  Database,
  Users,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Server,
  Globe
} from 'lucide-react';

const PerformanceAnalytics = () => {
  const [performanceData, setPerformanceData] = useState([]);
  const [timeRange, setTimeRange] = useState('24');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerformanceData();
  }, [timeRange]);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/analytics/performance?hours=${timeRange}`);
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = () => {
    if (!performanceData.length) return {};

    const latest = performanceData[performanceData.length - 1];
    const avgResponseTime = performanceData.reduce((sum, item) => sum + item.api_response_time, 0) / performanceData.length;
    const avgErrorRate = performanceData.reduce((sum, item) => sum + item.error_rate, 0) / performanceData.length;
    const avgUptime = performanceData.reduce((sum, item) => sum + item.uptime_percentage, 0) / performanceData.length;
    const avgCpuUsage = performanceData.reduce((sum, item) => sum + item.cpu_usage, 0) / performanceData.length;
    const avgMemoryUsage = performanceData.reduce((sum, item) => sum + item.memory_usage, 0) / performanceData.length;

    return {
      currentResponseTime: latest.api_response_time,
      currentErrorRate: latest.error_rate,
      currentUptime: latest.uptime_percentage,
      currentCpuUsage: latest.cpu_usage,
      currentMemoryUsage: latest.memory_usage,
      currentDbConnections: latest.database_connections,
      currentActiveSessions: latest.active_sessions,
      avgResponseTime,
      avgErrorRate,
      avgUptime,
      avgCpuUsage,
      avgMemoryUsage
    };
  };

  const getSystemHealth = () => {
    const metrics = calculateMetrics();
    if (!metrics.currentUptime) return { status: 'unknown', score: 0 };

    let score = 0;
    let issues = [];

    // Uptime score (40 points max)
    if (metrics.currentUptime >= 99.9) score += 40;
    else if (metrics.currentUptime >= 99.5) score += 35;
    else if (metrics.currentUptime >= 99.0) score += 25;
    else { score += 15; issues.push('Low uptime'); }

    // Response time score (30 points max)  
    if (metrics.currentResponseTime <= 100) score += 30;
    else if (metrics.currentResponseTime <= 200) score += 25;
    else if (metrics.currentResponseTime <= 300) score += 15;
    else { score += 5; issues.push('Slow response time'); }

    // Error rate score (20 points max)
    if (metrics.currentErrorRate <= 0.5) score += 20;
    else if (metrics.currentErrorRate <= 1.0) score += 15;
    else if (metrics.currentErrorRate <= 2.0) score += 10;
    else { score += 5; issues.push('High error rate'); }

    // Resource usage score (10 points max)
    if (metrics.currentCpuUsage <= 70 && metrics.currentMemoryUsage <= 70) score += 10;
    else if (metrics.currentCpuUsage <= 85 && metrics.currentMemoryUsage <= 85) score += 7;
    else { score += 3; issues.push('High resource usage'); }

    let status = 'excellent';
    if (score < 60) status = 'poor';
    else if (score < 80) status = 'fair';  
    else if (score < 90) status = 'good';

    return { status, score, issues };
  };

  const metrics = calculateMetrics();
  const systemHealth = getSystemHealth();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance Analytics</h2>
          <p className="text-slate-600">Monitor system performance, resource usage, and uptime metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24">24 hours</SelectItem>
              <SelectItem value="48">48 hours</SelectItem>
              <SelectItem value="72">72 hours</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={fetchPerformanceData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* System Health Overview */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                systemHealth.status === 'excellent' ? 'bg-emerald-500' :
                systemHealth.status === 'good' ? 'bg-blue-500' :
                systemHealth.status === 'fair' ? 'bg-orange-500' : 'bg-red-500'
              }`}>
                {systemHealth.status === 'excellent' || systemHealth.status === 'good' ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <AlertTriangle className="w-8 h-8 text-white" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-1">
                  System Health: {systemHealth.status.charAt(0).toUpperCase() + systemHealth.status.slice(1)}
                </h3>
                <p className="text-slate-600">
                  Overall health score: {systemHealth.score}/100
                </p>
                {systemHealth.issues.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    <span className="text-sm text-orange-600">
                      {systemHealth.issues.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <Badge className={`${
                systemHealth.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                systemHealth.status === 'good' ? 'bg-blue-100 text-blue-700' :
                systemHealth.status === 'fair' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              } border-0 px-4 py-2 text-sm font-medium`}>
                {metrics.currentUptime?.toFixed(2)}% Uptime
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <Badge className={`${
                metrics.currentResponseTime <= 150 ? 'bg-emerald-100 text-emerald-700' :
                metrics.currentResponseTime <= 250 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              } border-0`}>
                {metrics.currentResponseTime <= 150 ? 'Fast' :
                 metrics.currentResponseTime <= 250 ? 'Moderate' : 'Slow'}
              </Badge>
            </div>
            <div>
              <p className="text-emerald-700 text-sm font-medium mb-1">API Response Time</p>
              <p className="text-2xl font-bold text-emerald-900">
                {metrics.currentResponseTime?.toFixed(0) || '0'}ms
              </p>
              <p className="text-emerald-600 text-xs mt-1">
                Avg: {metrics.avgResponseTime?.toFixed(0) || '0'}ms
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center">
                {metrics.currentErrorRate <= metrics.avgErrorRate ? (
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                ) : (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                )}
              </div>
            </div>
            <div>
              <p className="text-blue-700 text-sm font-medium mb-1">Error Rate</p>
              <p className="text-2xl font-bold text-blue-900">
                {metrics.currentErrorRate?.toFixed(2) || '0'}%
              </p>
              <p className="text-blue-600 text-xs mt-1">
                Avg: {metrics.avgErrorRate?.toFixed(2) || '0'}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Cpu className="w-6 h-6 text-white" />
              </div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-purple-700 text-sm font-medium mb-1">CPU Usage</p>
              <p className="text-2xl font-bold text-purple-900">
                {metrics.currentCpuUsage?.toFixed(1) || '0'}%
              </p>
              <p className="text-purple-600 text-xs mt-1">
                Avg: {metrics.avgCpuUsage?.toFixed(1) || '0'}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                <HardDrive className="w-6 h-6 text-white" />
              </div>
              <Badge className={`${
                metrics.currentMemoryUsage <= 70 ? 'bg-emerald-100 text-emerald-700' :
                metrics.currentMemoryUsage <= 85 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
              } border-0`}>
                {metrics.currentMemoryUsage <= 70 ? 'Good' :
                 metrics.currentMemoryUsage <= 85 ? 'High' : 'Critical'}
              </Badge>
            </div>
            <div>
              <p className="text-orange-700 text-sm font-medium mb-1">Memory Usage</p>
              <p className="text-2xl font-bold text-orange-900">
                {metrics.currentMemoryUsage?.toFixed(1) || '0'}%
              </p>
              <p className="text-orange-600 text-xs mt-1">
                Avg: {metrics.avgMemoryUsage?.toFixed(1) || '0'}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              Response Time Trend (Last {timeRange} Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.slice(-12).map((item, index) => {
                const maxResponseTime = Math.max(...performanceData.map(d => d.api_response_time));
                const percentage = (item.api_response_time / maxResponseTime) * 100;
                const time = new Date(item.timestamp).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: false
                });
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-xs text-slate-600">
                      {time}
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-slate-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            item.api_response_time <= 150 ? 'bg-gradient-to-r from-emerald-500 to-green-500' :
                            item.api_response_time <= 250 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                            'bg-gradient-to-r from-red-400 to-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-16 text-right text-xs font-medium text-slate-700">
                      {item.api_response_time.toFixed(0)}ms
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Resource Usage */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" />
              System Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">CPU Usage</span>
                  <span className="text-sm text-slate-600">{metrics.currentCpuUsage?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.currentCpuUsage}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">Memory Usage</span>
                  <span className="text-sm text-slate-600">{metrics.currentMemoryUsage?.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${metrics.currentMemoryUsage}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-slate-700">DB Connections</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{metrics.currentDbConnections}</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium text-slate-700">Active Sessions</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{metrics.currentActiveSessions}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Uptime and Error Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Uptime Analysis */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Uptime Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {metrics.currentUptime?.toFixed(3)}%
                </div>
                <p className="text-sm text-slate-600">Current Uptime</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Last 24h Average</span>
                  <span className="font-medium text-slate-900">{metrics.avgUptime?.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Target SLA</span>
                  <span className="font-medium text-emerald-600">99.9%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Status</span>
                  <Badge className={`${
                    metrics.currentUptime >= 99.9 ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                  } border-0`}>
                    {metrics.currentUptime >= 99.9 ? 'Meeting SLA' : 'Below SLA'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Summary */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              Performance Insights & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Dynamic recommendations based on current metrics */}
              {metrics.currentResponseTime > 200 && (
                <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-orange-800 mb-1">Response Time Alert</h4>
                    <p className="text-sm text-orange-700">
                      Current response time ({metrics.currentResponseTime?.toFixed(0)}ms) is above optimal range. 
                      Consider optimizing database queries or scaling infrastructure.
                    </p>
                  </div>
                </div>
              )}

              {metrics.currentCpuUsage > 80 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">High CPU Usage</h4>
                    <p className="text-sm text-red-700">
                      CPU usage is at {metrics.currentCpuUsage?.toFixed(1)}%. Consider scaling up resources 
                      or optimizing resource-intensive processes.
                    </p>
                  </div>
                </div>
              )}

              {metrics.currentErrorRate > 1.5 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-red-800 mb-1">Elevated Error Rate</h4>
                    <p className="text-sm text-red-700">
                      Error rate is {metrics.currentErrorRate?.toFixed(2)}%, above the recommended 1% threshold. 
                      Review recent deployments and system logs.
                    </p>
                  </div>
                </div>
              )}

              {metrics.currentResponseTime <= 150 && metrics.currentCpuUsage <= 70 && metrics.currentErrorRate <= 1 && (
                <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-emerald-800 mb-1">System Running Optimally</h4>
                    <p className="text-sm text-emerald-700">
                      All performance metrics are within optimal ranges. System is performing well 
                      with low response times, stable resource usage, and minimal errors.
                    </p>
                  </div>
                </div>
              )}

              {/* Performance tips */}
              <div className="border-t border-slate-200 pt-4">
                <h4 className="font-medium text-slate-900 mb-3">Performance Tips</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Monitor response times &lt; 200ms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Keep error rates below 1%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>Maintain 99.9%+ uptime</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span>CPU usage under 80%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;