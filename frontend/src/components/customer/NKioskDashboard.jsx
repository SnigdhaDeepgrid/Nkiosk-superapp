import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, ShoppingCart, User, LogOut, Bell } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '../../hooks/use-toast';
import LocationSelector from './LocationSelector';

const NKioskDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [cartItems, setCartItems] = useState(0);

  // Location-based category availability
  const locationCategories = {
    'downtown': ['grocery', 'pharmacy', 'food', 'electronics'],
    'mall': ['grocery', 'pharmacy', 'food', 'electronics'],
    'suburbs': ['grocery', 'pharmacy', 'food'],
    'airport': ['pharmacy', 'food'],
    'hospital': ['pharmacy'],
    'university': ['grocery', 'food', 'electronics']
  };

  const categories = [
    {
      id: 'grocery',
      title: 'Grocery',
      subtitle: 'Fresh groceries delivered to your door',
      icon: '🥬',
      items: '50+ Items',
      color: 'bg-green-100',
      textColor: 'text-green-800',
      route: '/customer-app/grocery'
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      subtitle: 'Medicines and health products',
      icon: '💊',
      items: '50+ Products',
      color: 'bg-red-100',
      textColor: 'text-red-800',
      route: '/customer-app/pharmacy'
    },
    {
      id: 'food',
      title: 'Food Delivery',
      subtitle: 'Delicious meals from top restaurants',
      icon: '🍽️',
      items: '25+ Restaurants',
      color: 'bg-orange-100',
      textColor: 'text-orange-800',
      route: '/customer-app/food'
    },
    {
      id: 'electronics',
      title: 'Electronics',
      subtitle: 'Latest gadgets and electronics',
      icon: '📱',
      items: '200+ Items',
      color: 'bg-blue-100',
      textColor: 'text-blue-800',
      route: '/customer-app/electronics'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('selectedLocation');
    toast({
      title: "Logged Out",
      description: "Successfully logged out from your account",
    });
    navigate('/login');
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem('selectedLocation', JSON.stringify(location));
    toast({
      title: "Location Updated",
      description: `Shopping location set to ${location.name}`,
    });
  };

  const handleCategoryClick = (category) => {
    if (!selectedLocation) {
      toast({
        title: "Location Required",
        description: "Please select your location first to continue shopping",
        variant: "destructive"
      });
      return;
    }
    navigate(category.route);
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      setSelectedLocation(JSON.parse(savedLocation));
    }
  }, []);

  // Filter categories based on selected location
  const availableCategories = selectedLocation 
    ? categories.filter(cat => locationCategories[selectedLocation.type]?.includes(cat.id))
    : [];

  if (!selectedLocation) {
    return <LocationSelector onLocationSelect={handleLocationSelect} user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
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
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {cartItems}
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
                  onClick={handleLogout}
                  className="ml-2"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
            Welcome to NKiosk SuperApp
          </h1>
          <p className="text-xl text-gray-600 mb-6">Your one-stop destination for all your needs</p>
          
          {/* Location Display */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-lg font-medium text-gray-700">
              Shopping at: {selectedLocation.name}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSelectedLocation(null)}
              className="ml-2"
            >
              Change Location
            </Button>
          </div>
        </div>

        {/* 3D Phone Illustration */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=500&fit=crop&crop=center"
              alt="Shopping App Illustration"
              className="w-80 h-96 object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute -left-12 top-8 bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              🥖 Bakery
            </div>
            <div className="absolute -right-8 top-16 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              🐟 Seafood
            </div>
            <div className="absolute -left-8 top-32 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              🥕 Vegetables
            </div>
            <div className="absolute -right-12 bottom-24 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
              🥛 Dairy
            </div>
          </div>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {availableCategories.map((category) => (
            <Card 
              key={category.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              onClick={() => handleCategoryClick(category)}
            >
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-16 h-16 rounded-xl ${category.color} flex items-center justify-center text-3xl`}>
                    {category.icon}
                  </div>
                  <div className="text-right">
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      {category.items}
                    </Badge>
                  </div>
                </div>
                <h3 className={`text-2xl font-bold ${category.textColor} mb-2`}>
                  {category.title}
                </h3>
                <p className="text-gray-600 text-lg">
                  {category.subtitle}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Available Categories Notice */}
        {selectedLocation && availableCategories.length < 4 && (
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-center">
              <span className="font-medium">Note:</span> Some services may not be available in your selected location. 
              Try changing your location to access more categories.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-end">
            <Badge variant="outline" className="text-xs text-gray-500">
              Made with Emergent
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NKioskDashboard;