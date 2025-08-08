import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';

const GroceryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const features = [
    { icon: '🍃', text: 'Fresh Produce' },
    { icon: '🚚', text: 'Same Day Delivery' },
    { icon: '❄️', text: 'Cold Storage' },
    { icon: '🏪', text: 'Local Vendors' }
  ];

  const products = [
    {
      id: 1,
      name: 'Organic Bananas',
      image: '🍌',
      price: 2.99,
      unit: 'per bunch',
      inStock: true
    },
    {
      id: 2,
      name: 'Organic Apples',
      image: '🍎',
      price: 4.99,
      unit: 'per kg',
      inStock: true
    },
    {
      id: 3,
      name: 'Fresh Spinach',
      image: '🥬',
      price: 3.49,
      unit: 'per bundle',
      inStock: true
    }
  ];

  const addToCart = (product) => {
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart`,
    });
  };

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

      {/* Green Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white">
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
              <span className="text-5xl">🥬</span>
              <h1 className="text-4xl font-bold">Fresh Grocery Store</h1>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-green-400 text-green-900 hover:bg-green-300 px-3 py-1">
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
          <h2 className="text-3xl font-bold text-green-800 mb-4">Farm Fresh Groceries Delivered</h2>
          <p className="text-lg text-gray-700">
            Get the freshest vegetables, fruits, and daily essentials delivered to your doorstep. Our partner vendors ensure quality and freshness in every order.
          </p>
        </div>

        {/* Available Products */}
        <div className="bg-green-50 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Products</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-6xl mb-4">{product.image}</div>
                    <div className="text-center mb-2">
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        In Stock
                      </Badge>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h4>
                    <p className="text-lg font-semibold text-green-600 mb-1">
                      ${product.price} <span className="text-sm text-gray-500">{product.unit}</span>
                    </p>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 mt-4"
                      onClick={() => addToCart(product)}
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
      </div>
    </div>
  );
};

export default GroceryPage;