import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, ShoppingCart, User, LogOut, Bell } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useToast } from "../../hooks/use-toast";
import { useCart } from "../../contexts/CartContext";
import LocationSelector from "./LocationSelector";

const NKioskDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { totalItems, clearCartOnLogout } = useCart();
  const [selectedLocation, setSelectedLocation] = useState(null);

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
      color: "bg-green-100",
      textColor: "text-green-800",
      route: "/customer-app/grocery",
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      subtitle: "Medicines and health products",
      icon: "💊",
      items: "50+ Products",
      color: "bg-red-100",
      textColor: "text-red-800",
      route: "/customer-app/pharmacy",
    },
    {
      id: "food",
      title: "Food Delivery",
      subtitle: "Delicious meals from top restaurants",
      icon: "🍽️",
      items: "25+ Restaurants",
      color: "bg-orange-100",
      textColor: "text-orange-800",
      route: "/customer-app/food",
    },
    {
      id: "electronics",
      title: "Electronics",
      subtitle: "Latest gadgets and electronics",
      icon: "📱",
      items: "200+ Items",
      color: "bg-blue-100",
      textColor: "text-blue-800",
      route: "/customer-app/electronics",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("selectedLocation");
    clearCartOnLogout(); // Clear cart on logout
    toast({
      title: "Logged Out",
      description: "Successfully logged out from your account",
    });
    navigate("/login");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
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
                onClick={() => navigate("/customer-app/orders")}
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
                onClick={() => navigate("/customer-app/orders")}
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
                onClick={() => navigate("/customer-app/cart")}
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
          <h1
            className={`text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-400 to-green-600 animate-pulse-slow`}
          >
            Welcome to NKiosk SuperApp
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Your one-stop destination for all your needs
          </p>

          {/* Location Display */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <MapPin className="w-5 h-5 text-green-600" />
            <span className="text-lg font-medium text-gray-700">
              Shopping at: {selectedLocation.name}
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setSelectedLocation(null)}
              className="ml-2"
            >
              Change Location
            </Button>
          </div>
        </div>

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
                  category.textColor?.replace("text-", "") || "green-600",
                secondary: category.color?.replace("bg-", "") || "green-100",
                text: category.textColor?.replace("text-", "") || "green-800",
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
            bg-white text-neutral-900
            border-2 border-transparent hover:border-${theme.primary}
          `}
                  >
                    {/* Background gradient */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br from-${theme.secondary} to-transparent opacity-20 group-hover:opacity-40 transition-opacity`}
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
                        className={`text-3xl font-bold mb-3 ${category.textColor} group-hover:text-gradient transition-all duration-300`}
                      >
                        {category.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-neutral-600 mb-3">
                        {category.subtitle}
                      </p>

                      {/* Stats */}
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-${theme.secondary} text-${theme.text}`}
                      >
                        {category.items}
                      </div>

                      {/* Hover underline effect */}
                      <div
                        className={`absolute bottom-0 left-0 right-0 h-1 bg-${theme.primary} transform scale-x-0 group-hover:scale-x-100 transition-transform`}
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
          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-center">
              <span className="font-medium">Note:</span> Some services may not
              be available in your selected location. Try changing your location
              to access more categories.
            </p>
          </div>
        )}
        {/* Quick Actions */}
        <div className="text-center">
          <div className="w-full px-0 bg-gradient-to-r from-blue-300 via-blue-200 to-green-300 py-6 flex flex-wrap justify-center gap-4 rounded-lg">
            <button
              onClick={handleViewOrders}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full shadow-md transition"
            >
              📦 View My Orders
            </button>
            <button
              onClick={() => handleCategorySelect("food")}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full shadow-md transition"
            >
              🔥 Order Food Now
            </button>
            <button
              onClick={() => handleCategorySelect("grocery")}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full shadow-md transition"
            >
              🥬 Fresh Groceries
            </button>
          </div>
        </div>
        {/* Features Section */}
        <div className="mt-16 px-10 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-neutral-900">
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
                className="text-center p-6 rounded-xl bg-white shadow-lg"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-neutral-900">
                  {feature.title}
                </h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NKioskDashboard;
