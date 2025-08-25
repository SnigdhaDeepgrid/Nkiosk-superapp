import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ShoppingCart, User, LogOut, Bell, Package, Eye, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../../hooks/use-toast";
import { useCart } from "../../contexts/CartContext";
import { useOrderWorkflow } from "../../contexts/OrderWorkflowContext";
import { createWorkflowWebSocket } from "../../services/workflowWebSocket";
import LocationSelector from "./LocationSelector";
import OrderTracker from "../workflow/OrderTracker";

const NKioskDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalItems, clearCartOnLogout } = useCart();
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Order workflow integration
  const {
    customerOrders,
    notifications,
    setUserContext,
    connectWebSocket
  } = useOrderWorkflow();

  const customerId = user?.id || 'customer_001';
  const userOrders = customerOrders[customerId] || [];
  const activeOrders = userOrders.filter(order => 
    !['delivered', 'cancelled'].includes(order.status)
  );

  // Initialize workflow WebSocket
  useEffect(() => {
    setUserContext(user, 'customer');
    
    const ws = createWorkflowWebSocket(customerId, 'customer');
    connectWebSocket(ws);

    // Listen for order updates
    ws.on('order.status.update', (data) => {
      toast({
        title: "Order Update",
        description: data.message,
      });
    });

    ws.on('order.picker.assigned', (data) => {
      toast({
        title: "Picker Assigned",
        description: `${data.pickerName} is now picking your order`,
      });
    });

    ws.on('order.ready.for.delivery', (data) => {
      toast({
        title: "Out for Delivery",
        description: `${data.riderName} is delivering your order`,
      });
    });

    return () => {
      ws.cleanup();
    };
  }, []);

  // Location-based category availability
  const locationCategories = {
    downtown: ["grocery", "pharmacy", "food", "electronics"],
    mall: ["grocery", "pharmacy", "food", "electronics"],
    suburbs: ["grocery", "pharmacy", "food"],
    airport: ["pharmacy", "food"],
    hospital: ["pharmacy"],
    university: ["grocery", "food", "electronics"],
  };

  const categories = [
    {
      id: "grocery",
      title: "Grocery",
      subtitle: "Fresh groceries delivered to your door",
      icon: "🥬",
      items: "50+ Items",
      color: "bg-success-green-100",
      textColor: "text-success-green-800",
      route: "/customer-app/grocery",
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      subtitle: "Medicines and health products",
      icon: "💊",
      items: "50+ Products",
      color: "bg-deep-red-100",
      textColor: "text-deep-red-800",
      route: "/customer-app/pharmacy",
    },
    {
      id: "food",
      title: "Food Delivery",
      subtitle: "Delicious meals from top restaurants",
      icon: "🍽️",
      items: "25+ Restaurants",
      color: "bg-coral-red-100",
      textColor: "text-coral-red-800",
      route: "/customer-app/food",
    },
    {
      id: "electronics",
      title: "Electronics",
      subtitle: "Latest gadgets and electronics",
      icon: "📱",
      items: "200+ Items",
      color: "bg-app-gray-100",
      textColor: "text-app-gray-800",
      route: "/customer-app/electronics",
    },
  ];

  const handleLogout = async () => {
    try {
      // Call backend logout API
      const token = localStorage.getItem('token');
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      
      if (token) {
        await fetch(`${backendUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
      }
    } catch (error) {
      console.log('Logout API error:', error);
    }
    
    // Clear local storage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("selectedLocation");
    clearCartOnLogout(); // Clear cart on logout
    
    toast({
      title: "Logged Out",
      description: "Successfully logged out from your account",
    });
    
    // Redirect to homepage
    navigate("/");
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", JSON.stringify(location));
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
        variant: "destructive",
      });
      return;
    }
    navigate(category.route);
  };

  useEffect(() => {
    const savedLocation = localStorage.getItem("selectedLocation");
    if (savedLocation) {
      setSelectedLocation(JSON.parse(savedLocation));
    }
  }, []);

  const handleViewOrders = () => {
    navigate("/customer-app/orders");
  };

   const handleCategorySelect = (categoryId) => {
    switch (categoryId) {
      case "grocery":
        navigate("/customer-app/grocery");
        break;
      case "pharmacy":
        navigate("/customer-app/pharmacy");
        break;
      case "food":
        navigate("/customer-app/food");
        break;
      case "electronics":
        navigate("/customer-app/electronics");
        break;
      default:
        console.log("Unknown category:", categoryId);
    }
  };

  // Filter categories based on selected location
  const availableCategories = selectedLocation
    ? categories.filter((cat) =>
        locationCategories[selectedLocation.type]?.includes(cat.id)
      )
    : [];

  if (!selectedLocation) {
    return (
      <LocationSelector
        onLocationSelect={handleLocationSelect}
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coral-red-50 to-app-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-app-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-coral-red">NKiosk</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/customer-app/orders")}
                className="flex items-center gap-2 text-coral-red hover:text-coral-red-700 hover:bg-coral-red-50"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <span className="text-lg">📦</span>
                </div>
                Dashboard
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/customer-app/orders")}
                className="flex items-center gap-2 text-coral-red hover:text-coral-red-700 hover:bg-coral-red-50"
              >
                <div className="w-6 h-6 flex items-center justify-center relative">
                  <Package className="w-5 h-5" />
                  {activeOrders.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">
                      {activeOrders.length}
                    </Badge>
                  )}
                </div>
                My Orders
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/customer-app/cart")}
                className="relative text-coral-red hover:text-coral-red-700 hover:bg-coral-red-50"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-deep-red text-white text-xs flex items-center justify-center">
                    {totalItems}
                  </Badge>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <span className="text-sm font-medium text-app-gray-900">{user?.name || 'Customer'}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-app-gray-500">{user?.role || 'customer'}</span>
                    {notifications.filter(n => n.userId === customerId).length > 0 && (
                      <Bell className="w-3 h-3 text-orange-500" />
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-2 border-app-gray-300 text-app-gray-700 hover:bg-app-gray-50"
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
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-coral-red via-coral-red-600 to-deep-red animate-pulse-slow`}
          >
            Welcome to NKiosk SuperApp
          </h1>
          <p className="text-xl text-app-gray-600 mb-6">
            Your one-stop destination for all your needs
          </p>

          {/* Location Display */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <MapPin className="w-5 h-5 text-success-green" />
            <span className="text-lg font-medium text-app-gray-700">
              Shopping at: {selectedLocation.name}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setSelectedLocation(null)}
              className="ml-2 bg-deep-red hover:bg-deep-red-700"
            >
              Change Location
            </Button>
          </div>
        </div>

        {/* Active Orders Section */}
        {activeOrders.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-app-gray-900">Your Active Orders</h2>
              <Button
                variant="outline"
                onClick={() => navigate("/customer-app/orders")}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View All Orders
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeOrders.slice(0, 3).map((order) => (
                <Card key={order.id} className="border-coral-red-200 hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">Order #{order.id.slice(-6)}</h3>
                      <Badge className="capitalize bg-blue-100 text-blue-800">
                        {order.status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium capitalize">{order.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Items:</span>
                        <span className="font-medium">{order.items?.length || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium">₹{order.totalAmount}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Placed:</span>
                        <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <OrderTracker orderId={order.id} minimal={true} />
                    
                    <Button
                      onClick={() => navigate(`/customer-app/track/${order.id}`)}
                      className="w-full mt-3 bg-coral-red hover:bg-coral-red-700"
                      size="sm"
                    >
                      <Clock className="w-3 h-3 mr-2" />
                      Track Order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-8 items-center">
          {/* 3D Phone Illustration (2 columns on large screens) */}
          <div className="col-span-1 lg:col-span-2 flex justify-center">
            <div className="relative w-full max-w-md">
              <img
                src="/images/shopping3d.png"
                alt="3D Gifts"
                className="rounded-2xl w-full max-w-md"
              />
            </div>
          </div>

          {/* Category Cards (3 columns on large screens) */}
          <div className="col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableCategories.map((category, index) => {
              const theme = {
                primary:
                  category.textColor?.replace("text-", "") || "success-green-600",
                secondary: category.color?.replace("bg-", "") || "success-green-100",
                text: category.textColor?.replace("text-", "") || "success-green-800",
              };

              return (
                <div
                  key={category.id}
                  className="animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    onClick={() => handleCategoryClick(category)}
                    className={`
            relative overflow-hidden rounded-xl cursor-pointer transform transition-all duration-500 
            hover:scale-105 hover:shadow-2xl group
            bg-white text-app-gray-900
            border-2 border-transparent hover:border-coral-red
          `}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-20 group-hover:opacity-40 transition-opacity`}
                    />

                    <div className="relative p-6 text-center h-55 flex flex-col justify-between">
                      {/* Icon */}
                      <div className="group text-5xl mb-2 transform transition-transform duration-300 group-hover:scale-110">
                        <div className="group-hover:animate-bounce">
                          {category.icon}
                        </div>
                      </div>

                      {/* Title */}
                      <h3
                        className={`text-3xl font-bold mb-3 ${category.textColor} group-hover:text-coral-red transition-all duration-300`}
                      >
                        {category.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-app-gray-600 mb-3">
                        {category.subtitle}
                      </p>

                      {/* Stats */}
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${category.color} ${category.textColor}`}
                      >
                        {category.items}
                      </div>

                      {/* Hover underline effect */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-coral-red transform scale-x-0 group-hover:scale-x-100 transition-transform`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Available Categories Notice */}
        {selectedLocation && availableCategories.length < 4 && (
          <div className="mt-8 p-4 bg-coral-red-50 border border-coral-red-200 rounded-lg mb-6">
            <p className="text-coral-red-800 text-center">
              <span className="font-medium">Note:</span> Some services may not
              be available in your selected location. Try changing your location
              to access more categories.
            </p>
          </div>
        )}
        {/* Quick Actions */}
        <div className="text-center">
          <div className="w-full px-0 bg-gradient-to-r from-coral-red-100 via-coral-red-50 to-app-gray-100 py-6 flex flex-wrap justify-center gap-4 rounded-lg">
            <button
              onClick={handleViewOrders}
              className="px-6 py-3 bg-coral-red hover:bg-coral-red-700 text-white font-semibold rounded-full shadow-md transition"
            >
              📦 View My Orders
            </button>
            <button
              onClick={() => handleCategorySelect("food")}
              className="px-6 py-3 bg-deep-red hover:bg-deep-red-700 text-white font-semibold rounded-full shadow-md transition"
            >
              🔥 Order Food Now
            </button>
            <button
              onClick={() => handleCategorySelect("grocery")}
              className="px-6 py-3 bg-success-green hover:bg-success-green-700 text-white font-semibold rounded-full shadow-md transition"
            >
              🥬 Fresh Groceries
            </button>
          </div>
        </div>
        {/* Features Section */}
        <div className="mt-16 px-10 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-app-gray-900">
            Why Choose NKiosk?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🚚",
                title: "Fast Delivery",
                description:
                  "Get your orders delivered quickly with our Telugu-speaking delivery team",
              },
              {
                icon: "🛡️",
                title: "Quality Assured",
                description:
                  "All products are verified and quality-checked by our vendors",
              },
              {
                icon: "💰",
                title: "Best Prices",
                description:
                  "Competitive prices across all categories with regular discounts",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-white shadow-lg border border-app-gray-100"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-app-gray-900">
                  {feature.title}
                </h3>
                <p className="text-app-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NKioskDashboard;