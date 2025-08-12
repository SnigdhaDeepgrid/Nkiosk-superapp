import React, { useState } from "react";
import { MapPin, Navigation, Search, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { useToast } from "../../hooks/use-toast";

const LocationSelector = ({ onLocationSelect, user, onLogout }) => {
  const { toast } = useToast();
  const [isDetecting, setIsDetecting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const predefinedLocations = [
    {
      id: 1,
      name: "Downtown Business District",
      address: "123 Main St, Downtown",
      type: "downtown",
      categories: ["grocery", "pharmacy", "food", "electronics"],
      distance: "2.3 km",
    },
    {
      id: 2,
      name: "Central Shopping Mall",
      address: "456 Mall Ave, Central",
      type: "mall",
      categories: ["grocery", "pharmacy", "food", "electronics"],
      distance: "1.8 km",
    },
    {
      id: 3,
      name: "Suburban Neighborhood",
      address: "789 Oak Street, Suburbs",
      type: "suburbs",
      categories: ["grocery", "pharmacy", "food"],
      distance: "5.2 km",
    },
    {
      id: 4,
      name: "Airport Terminal",
      address: "International Airport",
      type: "airport",
      categories: ["pharmacy", "food"],
      distance: "12.5 km",
    },
    {
      id: 5,
      name: "General Hospital Area",
      address: "321 Health St, Medical District",
      type: "hospital",
      categories: ["pharmacy"],
      distance: "3.7 km",
    },
    {
      id: 6,
      name: "University Campus",
      address: "University Ave, Campus",
      type: "university",
      categories: ["grocery", "food", "electronics"],
      distance: "4.1 km",
    },
  ];

  const categoryIcons = {
    grocery: "🥬",
    pharmacy: "💊",
    food: "🍽️",
    electronics: "📱",
  };

  const handleGeolocation = () => {
    setIsDetecting(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Mock location detection - simulate finding nearest location
          setTimeout(() => {
            const nearestLocation = predefinedLocations[0]; // Downtown as nearest
            onLocationSelect(nearestLocation);
            toast({
              title: "Location Detected",
              description: `Found nearest location: ${nearestLocation.name}`,
            });
            setIsDetecting(false);
          }, 1500);
        },
        () => {
          toast({
            title: "Location Access Denied",
            description:
              "Please select a location manually from the list below",
            variant: "destructive",
          });
          setIsDetecting(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Please select a location manually from the list below",
        variant: "destructive",
      });
      setIsDetecting(false);
    }
  };

  const filteredLocations = predefinedLocations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-white to-green-300">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold text-blue-600">NKiosk</h1>
            <div className="flex items-center gap-2">
              <span className="text-yellow-500 text-lg">👤</span>
              <span className="text-sm font-medium">John Smith</span>
              <span className="text-xs text-gray-500">customer</span>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="ml-2"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Location
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Select your location to see available services and stores near you
          </p>
        </div>

        {/* Auto-detect Location */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="text-center">
              <Button
                onClick={handleGeolocation}
                disabled={isDetecting}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                <Navigation
                  className={`w-5 h-5 mr-2 ${
                    isDetecting ? "animate-spin" : ""
                  }`}
                />
                {isDetecting
                  ? "Detecting Location..."
                  : "Use My Current Location"}
              </Button>
              <p className="text-sm text-gray-500 mt-2">
                We'll find the nearest available services automatically
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 py-3 text-lg"
          />
        </div>

        {/* Location List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <Card
              key={location.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105"
              onClick={() => onLocationSelect(location)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {location.name}
                    </h3>
                    <p className="text-gray-600 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {location.address}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap">
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-200"
                      >
                        {location.distance} away
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">
                          Available:
                        </span>
                        <div className="flex gap-1">
                          {location.categories.map((cat) => (
                            <span key={cat} className="text-lg" title={cat}>
                              {categoryIcons[cat]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Badge variant="secondary">
                      {location.categories.length} Services
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLocations.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No locations found matching your search.
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSelector;
