import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useCart } from '../../contexts/CartContext';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const orders = [
    {
      id: '#6a3d3d82',
      date: 'Aug 6, 2025, 12:18 PM',
      items: [
        { name: '2x Organic Bananas', price: 2.99 },
        { name: '1x Whole Milk', price: 4.49 }
      ],
      total: 15.30,
      status: 'delivered',
      type: 'products'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-800",
      processing: "bg-blue-100 text-blue-800", 
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'products') return order.type === 'products';
    if (activeTab === 'food') return order.type === 'food';
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-blue-600">NKiosk</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/customer-app')}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">🏠</span>
                </div>
                Dashboard
              </Button>
              
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/customer-app/orders')}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700 bg-blue-50"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                My Orders
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/customer-app/cart')}
                className="relative text-blue-600 hover:text-blue-700"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg">👤</span>
                <span className="text-sm font-medium">John Smith</span>
                <span className="text-xs text-gray-500">customer</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="ml-2"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section with Gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-lg text-white p-8 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">📦</span>
            <h1 className="text-3xl font-bold">Order History</h1>
          </div>
          <p className="text-blue-100">Track all your orders in one place</p>
        </div>

        {/* Order Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="all" 
              className={`${activeTab === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              All Orders (1)
            </TabsTrigger>
            <TabsTrigger 
              value="products"
              className={`${activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              Products (1)
            </TabsTrigger>
            <TabsTrigger 
              value="food"
              className={`${activeTab === 'food' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
            >
              Food (0)
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            <div className="space-y-4">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📦</span>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Product Order</h3>
                          <p className="text-gray-600">Order {order.id}</p>
                          <p className="text-gray-500 text-sm">{order.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getStatusColor(order.status)} mb-2`}>
                          ✓ delivered
                        </Badge>
                        <p className="text-2xl font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <p className="font-medium text-gray-700 mb-2">Items ({order.items.length}):</p>
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-gray-600">
                            <span>{item.name}</span>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Orders Found</h3>
                    <p className="text-gray-600 mb-4">
                      {activeTab === 'all' ? 'You haven\'t placed any orders yet.' : 
                       activeTab === 'products' ? 'No product orders found.' :
                       'No food orders found.'}
                    </p>
                    <Button
                      onClick={() => navigate('/customer-app')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Start Shopping
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default OrderHistoryPage;