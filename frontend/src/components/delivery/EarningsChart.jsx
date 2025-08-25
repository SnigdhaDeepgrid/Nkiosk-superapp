import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  Clock,
  MapPin
} from 'lucide-react';

const EarningsChart = ({ earnings }) => {
  // Mock weekly earnings data
  const weeklyData = [
    { day: 'Mon', earnings: 180.50, deliveries: 8 },
    { day: 'Tue', earnings: 220.25, deliveries: 10 },
    { day: 'Wed', earnings: 195.75, deliveries: 9 },
    { day: 'Thu', earnings: 250.00, deliveries: 12 },
    { day: 'Fri', earnings: 275.80, deliveries: 13 },
    { day: 'Sat', earnings: 320.45, deliveries: 15 },
    { day: 'Sun', earnings: 285.30, deliveries: 14 }
  ];

  // Mock completed deliveries (recent ones)
  const recentDeliveries = [
    {
      id: 'del_001',
      customerName: 'Sarah Johnson',
      storeName: 'FreshMart',
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      earnings: 45.50,
      distance: '2.3 km',
      duration: '22 min'
    },
    {
      id: 'del_002', 
      customerName: 'Mike Chen',
      storeName: 'Pizza Palace',
      completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      earnings: 38.75,
      distance: '1.8 km',
      duration: '18 min'
    },
    {
      id: 'del_003',
      customerName: 'Emma Wilson', 
      storeName: 'HealthPlus Pharmacy',
      completedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      earnings: 52.25,
      distance: '3.1 km',
      duration: '28 min'
    }
  ];

  const totalWeeklyEarnings = weeklyData.reduce((sum, day) => sum + day.earnings, 0);
  const totalWeeklyDeliveries = weeklyData.reduce((sum, day) => sum + day.deliveries, 0);
  const avgEarningsPerDelivery = totalWeeklyEarnings / totalWeeklyDeliveries;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{(earnings.today || 0).toFixed(2)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{totalWeeklyEarnings.toFixed(2)}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Deliveries</p>
                <p className="text-2xl font-bold text-purple-600">
                  {totalWeeklyDeliveries}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg per Delivery</p>
                <p className="text-2xl font-bold text-orange-600">
                  ₹{avgEarningsPerDelivery.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Earnings Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'earnings' ? `₹${value}` : value,
                    name === 'earnings' ? 'Earnings' : 'Deliveries'
                  ]}
                />
                <Bar 
                  dataKey="earnings" 
                  fill="#22c55e" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Daily Deliveries Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Deliveries</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [value, 'Deliveries']}
                />
                <Line 
                  type="monotone" 
                  dataKey="deliveries" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Deliveries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentDeliveries.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600">No completed deliveries yet</p>
                <p className="text-sm text-gray-500">Your earnings will appear here as you complete deliveries</p>
              </div>
            ) : (
              recentDeliveries.map((delivery) => (
                <div key={delivery.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {delivery.storeName} → {delivery.customerName}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {delivery.distance}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {delivery.duration}
                        </span>
                        <span>
                          {delivery.completedAt.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-bold text-green-600">₹{delivery.earnings}</p>
                    <Badge variant="outline" className="text-xs">
                      Completed
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EarningsChart;