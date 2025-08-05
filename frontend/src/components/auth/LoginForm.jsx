import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Store } from 'lucide-react';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication - simulate API call
    setTimeout(() => {
      const mockUser = getMockUserByEmail(email);
      
      if (mockUser && password === 'password123') {
        localStorage.setItem('user', JSON.stringify(mockUser));
        toast({
          title: "Welcome to Nkiosk!",
          description: `Successfully logged in as ${mockUser.name}`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Try: admin@saas.com with password123",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const getMockUserByEmail = (email) => {
    const mockUsers = {
      'admin@saas.com': {
        id: '1',
        name: 'John Smith',
        email: 'admin@saas.com',
        role: 'saas_admin',
        roleDisplay: 'SaaS Admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      'superadmin@tenant1.com': {
        id: '2',
        name: 'Sarah Johnson',
        email: 'superadmin@tenant1.com',
        role: 'super_admin',
        roleDisplay: 'Super Admin',
        tenant: 'QuickMart',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
      },
      'manager@store1.com': {
        id: '3',
        name: 'Mike Davis',
        email: 'manager@store1.com',
        role: 'store_manager',
        roleDisplay: 'Store Manager',
        store: 'Downtown QuickMart',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      'vendor@foodie.com': {
        id: '4',
        name: 'Lisa Chen',
        email: 'vendor@foodie.com',
        role: 'vendor',
        roleDisplay: 'Vendor',
        business: 'Foodie Express',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
      },
      'delivery@fast.com': {
        id: '5',
        name: 'Carlos Rodriguez',
        email: 'delivery@fast.com',
        role: 'delivery_partner',
        roleDisplay: 'Delivery Partner',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      },
      'customer@email.com': {
        id: '6',
        name: 'Emma Wilson',
        email: 'customer@email.com',
        role: 'customer',
        roleDisplay: 'Customer',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
      },
      'support@help.com': {
        id: '7',
        name: 'David Kim',
        email: 'support@help.com',
        role: 'support_staff',
        roleDisplay: 'Support Staff',
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face'
      }
    };
    return mockUsers[email] || null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="space-y-6 pb-8 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Store className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Nkiosk
            </CardTitle>
            <p className="text-slate-600 text-lg font-medium">
              Multi-Vendor eCommerce Platform
            </p>
            <p className="text-sm text-slate-500">
              Sign in to your dashboard
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-semibold text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-semibold text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-indigo-50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-500" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In to Dashboard'
              )}
            </Button>
          </form>

          <div className="mt-8 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100">
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              Demo Accounts
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">SaaS Admin:</span>
                <span className="text-slate-800">admin@saas.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Super Admin:</span>
                <span className="text-slate-800">superadmin@tenant1.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Store Manager:</span>
                <span className="text-slate-800">manager@store1.com</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600 font-medium">Vendor:</span>
                <span className="text-slate-800">vendor@foodie.com</span>
              </div>
              <div className="mt-3 pt-3 border-t border-indigo-200 flex justify-between">
                <span className="text-slate-600 font-medium">Password:</span>
                <span className="text-slate-800 font-mono bg-white px-2 py-1 rounded text-xs">password123</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;