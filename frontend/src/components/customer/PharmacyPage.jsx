import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, ShoppingCart } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { useToast } from '../../hooks/use-toast';

const PharmacyPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const features = [
    { icon: '💊', text: 'Prescription Medicine' },
    { icon: '🚚', text: 'Emergency Delivery' },
    { icon: '👨‍⚕️', text: 'Expert Consultation' },
    { icon: '✅', text: 'Verified Pharmacies' }
  ];

  const products = [
    {
      id: 1,
      name: 'Medicine Package',
      image: '💊',
      inStock: true
    },
    {
      id: 2,
      name: 'Health Supplements',
      image: '💊',
      inStock: true
    },
    {
      id: 3,
      name: 'Medical Supplies',
      image: '💊',
      inStock: true
    }
  ];

  const handleFileUpload = () => {
    toast({
      title: "Upload Feature",
      description: "Prescription upload feature would be available here",
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

      {/* Red Header Section */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
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
              <span className="text-5xl">💊</span>
              <h1 className="text-4xl font-bold">Online Pharmacy</h1>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="bg-red-400 text-red-900 hover:bg-red-300 px-3 py-1">
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
            <span className="text-4xl">💊</span>
            <h2 className="text-3xl font-bold text-red-800">Prescription Upload & Emergency Delivery</h2>
          </div>
          <p className="text-lg text-gray-700">
            Get your medicines delivered quickly and safely. Upload prescriptions for verification and enjoy emergency delivery services.
          </p>
        </div>

        {/* Upload Prescription */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">📋</span>
              <h3 className="text-xl font-bold text-gray-900">Upload Prescription</h3>
            </div>
            <div className="text-center py-8 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleFileUpload}
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload File
              </Button>
              <p className="text-sm text-gray-600 mt-2">Supports JPG, PNG, PDF</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Products */}
        <div className="bg-red-50 rounded-lg p-8">
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
                    <h4 className="text-xl font-bold text-gray-900 mb-4">{product.name}</h4>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700"
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
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-8 text-center">
              Why Choose Our Pharmacy?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
              {[
                { icon: "✅", desc: "Licensed Pharmacists" },
                { icon: "🚨", desc: "Emergency Service" },
                { icon: "💳", desc: "Insurance Support" },
                { icon: "🔒", desc: "Secure Storage" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="w-36 h-36 flex flex-col items-center justify-center text-center rounded-full shadow-lg p-4 text-white bg-gradient-to-br from-orange-200 to-red-500"
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <p className="text-sm font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
          
      </div>
    </div>
  );
};

export default PharmacyPage;