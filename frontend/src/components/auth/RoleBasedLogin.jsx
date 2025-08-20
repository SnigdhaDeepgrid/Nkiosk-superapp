import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { Eye, EyeOff, X, User, Crown, Store, Package, Truck, Users, HeadphonesIcon } from 'lucide-react';

const RoleBasedLogin = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const roles = [
    {
      role: 'saas_admin',
      title: 'SaaS Admin',
      icon: Crown,
      description: 'Platform management and analytics',
      demoEmail: 'admin@saas.com',
      color: 'from-purple-500 to-purple-700'
    },
    {
      role: 'super_admin',
      title: 'Super Admin',
      icon: User,
      description: 'Business operations oversight',
      demoEmail: 'superadmin@tenant1.com',
      color: 'from-blue-500 to-blue-700'
    },
    {
      role: 'store_manager',
      title: 'Store Manager',
      icon: Store,
      description: 'Store management and inventory',
      demoEmail: 'manager@store1.com',
      color: 'from-green-500 to-green-700'
    },
    {
      role: 'vendor',
      title: 'Vendor',
      icon: Package,
      description: 'Product listings and orders',
      demoEmail: 'vendor@foodie.com',
      color: 'from-orange-500 to-orange-700'
    },
    {
      role: 'delivery_partner',
      title: 'Delivery Partner',
      icon: Truck,
      description: 'Delivery tracking and routes',
      demoEmail: 'delivery@fast.com',
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      role: 'customer',
      title: 'Customer',
      icon: Users,
      description: 'Shopping and order management',
      demoEmail: 'customer@email.com',
      color: 'from-pink-500 to-pink-700'
    },
    {
      role: 'support_staff',
      title: 'Support Staff',
      icon: HeadphonesIcon,
      description: 'Customer support and assistance',
      demoEmail: 'support@help.com',
      color: 'from-teal-500 to-teal-700'
    }
  ];

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

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setEmail(role.demoEmail);
    setPassword('');
    setShowModal(true);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the backend API for authentication
      const backendUrl = process.env.REACT_APP_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store both user and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        toast({
          title: "Welcome to Nkiosk!",
          description: data.message || `Successfully logged in as ${data.user.name}`,
        });
        
        setShowModal(false);
        setIsLoading(false);
        navigate('/dashboard');
      } else {
        toast({
          title: "Login Failed",
          description: data.detail || "Invalid credentials. Use password: password123",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "Unable to connect to server. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRole(null);
    setEmail('');
    setPassword('');
    setShowPassword(false);
  };

  return (
    <>
      {/* Role Selection Section */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2E2E2E] mb-4">
              Quick Access Dashboards
            </h2>
            <p className="text-xl text-[#737373] max-w-3xl mx-auto">
              Choose your role to access your personalized dashboard
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map((role, index) => {
              const IconComponent = role.icon;
              return (
                <Card
                  key={index}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white shadow-lg border-2"
                  onClick={() => handleRoleSelect(role)}
                >
                  <CardHeader className="pb-4">
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-[#2E2E2E] text-center">
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-[#737373] text-center mb-4">
                      {role.description}
                    </p>
                    <div className="bg-[#F5F5F5] rounded-lg p-3">
                      <p className="text-xs text-[#737373] mb-1">Demo Email:</p>
                      <p className="text-sm font-mono text-[#2E2E2E] break-all">{role.demoEmail}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />
          
          {/* Modal Content */}
          <Card className="relative w-full max-w-md shadow-2xl border-0 bg-white">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  {selectedRole && React.createElement(selectedRole.icon, { 
                    className: `w-8 h-8 text-[#F25C44]` 
                  })}
                  <div>
                    <CardTitle className="text-xl font-bold text-[#2E2E2E]">
                      {selectedRole?.title} Login
                    </CardTitle>
                    <p className="text-sm text-[#737373]">
                      {selectedRole?.description}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-[#737373] hover:text-[#F25C44]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#2E2E2E] font-semibold text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-11 border-[#EAEAEA] focus:border-[#F25C44] focus:ring-[#F25C44] rounded-lg"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#2E2E2E] font-semibold text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="h-11 border-[#EAEAEA] focus:border-[#F25C44] focus:ring-[#F25C44] rounded-lg pr-11"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-[#F25C44]/10"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-[#A3A3A3]" />
                      ) : (
                        <Eye className="w-4 h-4 text-[#A3A3A3]" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#F25C44] to-[#D94436] hover:from-[#E53E2A] hover:to-[#C53529] text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing in...
                    </div>
                  ) : (
                    `Access ${selectedRole?.title} Dashboard`
                  )}
                </Button>
              </form>

              <div className="p-4 bg-gradient-to-r from-[#F25C44]/5 to-[#EAEAEA]/20 rounded-lg border border-[#F25C44]/20">
                <h4 className="font-semibold text-[#2E2E2E] mb-2 text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F25C44] rounded-full"></div>
                  Demo Credentials
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[#737373] font-medium">Email:</span>
                    <span className="text-[#2E2E2E] font-mono text-xs">{selectedRole?.demoEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#737373] font-medium">Password:</span>
                    <span className="text-[#2E2E2E] font-mono bg-white px-2 py-1 rounded text-xs">password123</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default RoleBasedLogin;