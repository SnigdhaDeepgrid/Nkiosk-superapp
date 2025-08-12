import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';
import { useCart } from '../../contexts/CartContext';

const FoodDeliveryPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItem, totalItems } = useCart();

  const features = [
    { icon: '🔥', text: 'Hot & Fresh' },
    { icon: '🚀', text: 'Quick Delivery' },
    { icon: '🍛', text: 'Local Cuisines' },
    { icon: '⭐', text: 'Top Rated' }
  ];

  const dishes = [
    {
      id: 1,
      name: 'Pesarattu with Upma',
      price: 12.99,
      description: 'Delicious pesarattu with upma prepared with authentic telugu flavors',
      restaurant: 'Telugu Kitchen'
    },
    {
      id: 2,
      name: 'Idli Sambar',
      price: 9.99,
      description: 'Delicious idli sambar prepared with authentic telugu flavors',
      restaurant: 'Telugu Kitchen'
    },
    {
      id: 3,
      name: 'Mirchi Bajji',
      price: 8.99,
      description: 'Delicious mirchi bajji prepared with authentic telugu flavors',
      restaurant: 'Telugu Kitchen'
    }
  ];

  const addToCart = (dish) => {
    // Create cart item with required properties
    const cartItem = {
      id: dish.id,
      name: dish.name,
      price: dish.price,
      image: "🍽️", // Food emoji
      type: "food",
      restaurant: dish.restaurant,
      description: dish.description
    };
    
    addItem(cartItem);
    toast({
      title: "Added to Cart",
      description: `${dish.name} has been added to your cart`,
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
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
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

      {/* Orange Header Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
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
              <span className="text-5xl">🍽️</span>
              <h1 className="text-4xl font-bold">Food Delivery</h1>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-400 text-orange-900 hover:bg-orange-300 px-3 py-1">
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
            <span className="text-4xl">🔥</span>
            <h2 className="text-3xl font-bold text-orange-800">Popular Dishes & Local Restaurants</h2>
          </div>
          <p className="text-lg text-gray-700">
            Discover delicious food from local restaurants. From traditional Telugu cuisine to international favorites, get hot meals delivered fresh to your door.
          </p>
        </div>

        {/* Popular Dishes */}
        <div className="bg-orange-50 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔥</span>
            <h3 className="text-2xl font-bold text-gray-900">Popular Dishes</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <Card key={dish.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-2">💊</div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{dish.name}</h4>
                    <p className="text-orange-600 font-bold text-2xl mb-1">${dish.price}</p>
                  </div>
                  
                  <div className="text-left space-y-2">
                    <p className="text-gray-700 text-sm">{dish.description}</p>
                    <p className="text-orange-600 text-sm font-medium">from {dish.restaurant}</p>
                  </div>
                  
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 mt-4"
                    onClick={() => addToCart(dish)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      {/* Features Grid */}
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-8 text-center">
              Why Order From Us?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {[
                {
                  icon: "⚡",
                  title: "Lightning Fast",
                  desc: "Avg delivery time under 30 min",
                },
                {
                  icon: "🌶️",
                  title: "Authentic Flavors",
                  desc: "Traditional Telugu & Indian cuisines",
                },
                {
                  icon: "💰",
                  title: "Best Prices",
                  desc: "Competitive pricing, no hidden charges",
                },
                {
                  icon: "🏆",
                  title: "Top Quality",
                  desc: "Only highly rated restaurants",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="w-40 h-40 flex flex-col items-center justify-center text-center rounded-full shadow-lg p-4 text-white bg-gradient-to-br from-orange-300 to-red-500"
                >
                  <div className="text-3xl mb-1">{feature.icon}</div>
                  <h4 className="text-sm font-semibold">{feature.title}</h4>
                  <p className="text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
      </div>
    </div>
  );
};

export default FoodDeliveryPage;