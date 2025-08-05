import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, Building2 } from 'lucide-react';

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
          title: "Login Successful",
          description: `Welcome back, ${mockUser.name}!`,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid email or password. Try: admin@saas.com with password123",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur">
        <CardHeader className="space-y-4 pb-8">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-tr from-slate-900 to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center text-slate-900">
            DeliveryHub
          </CardTitle>
          <p className="text-slate-600 text-center">
            Multi-Service Delivery Platform
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-700 font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="h-12 border-slate-200 focus:border-slate-400 focus:ring-slate-400 pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
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
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all duration-200 hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-3">Demo Accounts:</h4>
            <div className="space-y-2 text-sm text-slate-600">
              <p><strong>SaaS Admin:</strong> admin@saas.com</p>
              <p><strong>Super Admin:</strong> superadmin@tenant1.com</p>
              <p><strong>Store Manager:</strong> manager@store1.com</p>
              <p><strong>Vendor:</strong> vendor@foodie.com</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;