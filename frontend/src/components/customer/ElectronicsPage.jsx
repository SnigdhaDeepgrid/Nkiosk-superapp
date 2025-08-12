import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';

const ElectronicsPage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: '📱', text: 'Latest Tech' },
    { icon: '🛡️', text: 'Warranty Support' },
    { icon: '🚚', text: 'Secure Delivery' },
    { icon: '🔧', text: 'Installation Service' }
  ];

  const categories = [
    { name: 'Smartphones', icon: '📱' },
    { name: 'Laptops', icon: '💻' },
    { name: 'Audio', icon: '🎧' },
    { name: 'Wearables', icon: '⌚' }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Smartphone',
      icon: '💊'
    },
    {
      id: 2,
      name: 'Laptop',
      icon: '💊'
    },
    {
      id: 3,
      name: 'Headphones',
      icon: '💊'
    }
  ];

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
                onClick={() => navigate('/customer-app/orders')}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                Dashboard
              </Button>
              
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/customer-app/orders')}
                className="flex items-center gap-2 text-orange-600 hover:text-orange-700"
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

      {/* Blue Header Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/customer-app')}
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </Button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-5xl">📱</span>
              <h1 className="text-4xl font-bold">Electronics Store</h1>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-400 text-blue-900 hover:bg-blue-300 px-3 py-1">
                  <span className="mr-1">{feature.icon}</span>
                  {feature.text}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Description */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚡</span>
            <h2 className="text-3xl font-bold text-blue-800">Latest Technology & Electronics</h2>
          </div>
          <p className="text-lg text-gray-700">
            Discover the latest smartphones, laptops, audio equipment, and smart devices. All products come with manufacturer warranty and installation support.
          </p>
        </div>

        {/* Product Categories */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {categories.map((category, index) => (
            <Card key={index} className="text-center cursor-pointer hover:shadow-md transition-shadow bg-blue-50">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">{category.icon}</span>
                </div>
                <h3 className="font-bold text-blue-800">{category.name}</h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Electronics */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Featured Electronics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{product.icon}</div>
                    <div className="text-center mb-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        In Stock
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h4>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-primary-800 dark:text-primary-200 mb-6">
              Why Choose Our Electronics Store?
            </h3>
            <div className="flex flex-wrap justify-between gap-4">
              {[
                {
                  icon: "🛡️",
                  title: "Manufacturer Warranty",
                  desc: "All products come with official warranty",
                },
                {
                  icon: "🔧",
                  title: "Free Installation",
                  desc: "Professional setup for complex devices",
                },
                {
                  icon: "💰",
                  title: "Best Price Guarantee",
                  desc: "Competitive prices with price matching",
                },
                {
                  icon: "🚚",
                  title: "Safe Delivery",
                  desc: "Secure packaging for fragile electronics",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="w-40 h-40 flex flex-col items-center justify-center text-center rounded-full shadow-md bg-gradient-to-br from-blue-100 to-green-200 text-blue-900 dark:text-white"
                >
                  <div className="text-2xl mb-1">{feature.icon}</div>
                  <div className="text-sm font-semibold px-2">
                    {feature.title}
                  </div>
                  <div className="text-xs text-blue-800 dark:text-gray-300 px-3 mt-1">
                    {feature.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Products Placeholder */}
          <div className="bg-gradient-to-r from-primary-50 to-accent-200 rounded-lg p-6 text-blue-900">
            <h3 className="text-xl font-semibold mb-4">🔥 Trending Now</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">📱</div>
                <h4 className="font-semibold">Latest iPhones</h4>
                <p className="text-sm opacity-90">From $999</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">💻</div>
                <h4 className="font-semibold">MacBook Pro</h4>
                <p className="text-sm opacity-90">From $2,399</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-2xl mb-2">🎧</div>
                <h4 className="font-semibold">AirPods Pro</h4>
                <p className="text-sm opacity-90">From $249</p>
              </div>
            </div>
          </div>
          
      </div>
    </div>
  );
};

export default ElectronicsPage;