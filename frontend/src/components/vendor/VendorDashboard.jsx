import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Star,
  DollarSign,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  LogOut,
  Search,
  Filter,
  Plus,
  Edit,
  Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../../hooks/use-toast';

const VendorDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "Successfully logged out from your account",
    });
    navigate('/login');
  };

  // Mock vendor data
  const vendorStats = {
    totalEarnings: 8950.75,
    monthlyOrders: 87,
    activeProducts: 24,
    avgRating: 4.6,
    pendingOrders: 12,
    lowStockItems: 5
  };

  const recentOrders = [
    {
      id: "VND-001",
      customer: "Downtown Store",
      products: ["Organic Tomatoes", "Fresh Lettuce"],
      quantity: 25,
      total: 125.50,
      status: "pending",
      time: "1 hour ago"
    },
    {
      id: "VND-002", 
      customer: "Mall Branch",
      products: ["Sweet Corn", "Carrots"],
      quantity: 15,
      total: 89.25,
      status: "confirmed",
      time: "3 hours ago"
    },
    {
      id: "VND-003",
      customer: "Suburban Store",
      products: ["Bell Peppers"],
      quantity: 10,
      total: 45.00,
      status: "delivered",
      time: "1 day ago"
    }
  ];

  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      category: "Vegetables",
      stock: 150,
      price: 5.99,
      sold: 45,
      rating: 4.8,
      status: "active",
      image: "🍅"
    },
    {
      id: 2,
      name: "Fresh Lettuce",
      category: "Leafy Greens",
      stock: 8,
      price: 2.99,
      sold: 23,
      rating: 4.5,
      status: "low_stock",
      image: "🥬"
    },
    {
      id: 3,
      name: "Sweet Corn",
      category: "Vegetables",
      stock: 0,
      price: 3.49,
      sold: 67,
      rating: 4.7,
      status: "out_of_stock",
      image: "🌽"
    }
  ];

  const analytics = [
    { month: "Jan", earnings: 1200, orders: 15 },
    { month: "Feb", earnings: 1500, orders: 22 },
    { month: "Mar", earnings: 1800, orders: 28 },
    { month: "Apr", earnings: 2100, orders: 31 },
    { month: "May", earnings: 1950, orders: 29 },
    { month: "Jun", earnings: 2250, orders: 35 }
  ];

  const customerReviews = [
    {
      id: 1,
      customer: "Sarah M.",
      product: "Organic Tomatoes",
      rating: 5,
      comment: "Best quality tomatoes! Always fresh and delicious.",
      date: "2 days ago"
    },
    {
      id: 2,
      customer: "John D.",
      product: "Fresh Lettuce",
      rating: 4,
      comment: "Good quality but could be more crispy.",
      date: "1 week ago"
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      active: "bg-green-100 text-green-800",
      low_stock: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const updateOrderStatus = (orderId, newStatus) => {
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status updated to ${newStatus}`,
    });
  };

  const renderStarRating = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-tr from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Vendor Portal</h1>
                <p className="text-slate-600">Fresh Produce Supplier - {user.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 pl-3 border-l">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-green-100 text-green-600">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{user.name}</p>
                  <p className="text-xs text-slate-500">Vendor</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-600">Earnings</p>
                      <p className="text-2xl font-bold text-green-800">${vendorStats.totalEarnings}</p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-600">Orders</p>
                      <p className="text-2xl font-bold text-blue-800">{vendorStats.monthlyOrders}</p>
                    </div>
                    <ShoppingCart className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-600">Products</p>
                      <p className="text-2xl font-bold text-purple-800">{vendorStats.activeProducts}</p>
                    </div>
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-600">Rating</p>
                      <p className="text-2xl font-bold text-yellow-800">{vendorStats.avgRating}</p>
                    </div>
                    <Star className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-600">Pending</p>
                      <p className="text-2xl font-bold text-orange-800">{vendorStats.pendingOrders}</p>
                    </div>
                    <Clock className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-600">Low Stock</p>
                      <p className="text-2xl font-bold text-red-800">{vendorStats.lowStockItems}</p>
                    </div>
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders & Customer Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('orders')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{order.id}</p>
                            <p className="text-sm text-slate-600">{order.customer}</p>
                            <p className="text-xs text-slate-500">{order.time}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800">${order.total}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customerReviews.map((review) => (
                      <div key={review.id} className="p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-slate-800">{review.customer}</p>
                          <div className="flex items-center gap-1">
                            {renderStarRating(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{review.product}</p>
                        <p className="text-sm text-slate-700 mb-2">"{review.comment}"</p>
                        <p className="text-xs text-slate-500">{review.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Management</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search orders..." className="pl-9 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-slate-800">{order.id}</h3>
                          <p className="text-sm text-slate-600">{order.customer} • {order.time}</p>
                          <p className="text-sm text-slate-600">Qty: {order.quantity} items</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-slate-800 text-lg">${order.total}</p>
                          <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-slate-700 mb-2">Products:</p>
                        <div className="flex flex-wrap gap-2">
                          {order.products.map((product, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                        {order.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          >
                            Confirm Order
                          </Button>
                        )}
                        {order.status === 'confirmed' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600"
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                          >
                            Mark Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Catalog</CardTitle>
                  <Button size="sm" className="bg-green-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{product.image}</div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-lg">{product.name}</h3>
                            <p className="text-sm text-slate-600">{product.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {renderStarRating(product.rating)}
                              </div>
                              <span className="text-sm text-slate-600">({product.rating})</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${product.price}</p>
                          <p className="text-sm text-slate-600">Stock: {product.stock}</p>
                          <p className="text-sm text-slate-600">Sold: {product.sold}</p>
                          <Badge className={`text-xs ${getStatusColor(product.status)} mt-1`}>
                            {product.status === 'active' ? 'Active' : 
                             product.status === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="bg-blue-600">
                          <Upload className="w-4 h-4 mr-1" />
                          Update Stock
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.slice(-6).map((month) => (
                      <div key={month.month} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div>
                          <p className="font-medium text-slate-800">{month.month} 2024</p>
                          <p className="text-sm text-slate-600">{month.orders} orders</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">${month.earnings}</p>
                          <p className="text-sm text-slate-600">Revenue</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.sort((a, b) => b.sold - a.sold).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{product.image}</div>
                          <div>
                            <p className="font-medium text-slate-800">{product.name}</p>
                            <div className="flex items-center gap-1">
                              {renderStarRating(product.rating)}
                              <span className="text-sm text-slate-600 ml-1">({product.rating})</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{product.sold}</p>
                          <p className="text-sm text-slate-600">sold</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;