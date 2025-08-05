import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../ui/dropdown-menu';
import {
  Store,
  Users,
  ShoppingBag,
  Package,
  Truck,
  ShoppingCart,
  Headphones,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  BarChart3
} from 'lucide-react';

const DashboardLayout = ({ children, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRoleNavigation = (role) => {
    const navItems = {
      saas_admin: [
        { label: 'Dashboard', href: '/dashboard', icon: Store },
        { label: 'Tenants', href: '/tenants', icon: Users },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
      super_admin: [
        { label: 'Dashboard', href: '/dashboard', icon: Store },
        { label: 'Users', href: '/users', icon: Users },
        { label: 'Products', href: '/products', icon: Package },
        { label: 'Orders', href: '/orders', icon: ShoppingCart },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
      store_manager: [
        { label: 'Dashboard', href: '/dashboard', icon: Store },
        { label: 'Orders', href: '/orders', icon: ShoppingCart },
        { label: 'Inventory', href: '/inventory', icon: Package },
        { label: 'Staff', href: '/staff', icon: Users },
      ],
      vendor: [
        { label: 'Dashboard', href: '/dashboard', icon: ShoppingBag },
        { label: 'Products', href: '/products', icon: Package },
        { label: 'Orders', href: '/orders', icon: ShoppingCart },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      ],
      delivery_partner: [
        { label: 'Dashboard', href: '/dashboard', icon: Truck },
        { label: 'Deliveries', href: '/deliveries', icon: Truck },
        { label: 'Earnings', href: '/earnings', icon: Package },
      ],
      customer: [
        { label: 'Browse', href: '/browse', icon: ShoppingCart },
        { label: 'Orders', href: '/orders', icon: Package },
        { label: 'Profile', href: '/profile', icon: Users },
      ],
      support_staff: [
        { label: 'Dashboard', href: '/dashboard', icon: Headphones },
        { label: 'Tickets', href: '/tickets', icon: Headphones },
        { label: 'Knowledge Base', href: '/kb', icon: Package },
      ],
    };

    return navItems[role] || [];
  };

  const navigation = getRoleNavigation(user.role);

  const getRoleColor = (role) => {
    const colors = {
      saas_admin: 'from-purple-600 to-indigo-600',
      super_admin: 'from-blue-600 to-indigo-600',
      store_manager: 'from-emerald-600 to-teal-600',
      vendor: 'from-orange-500 to-red-500',
      delivery_partner: 'from-yellow-500 to-orange-500',
      customer: 'from-pink-500 to-rose-500',
      support_staff: 'from-indigo-600 to-purple-600',
    };
    return colors[role] || 'from-slate-600 to-slate-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-slate-200/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/50 bg-white/50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-tr ${getRoleColor(user.role)} rounded-xl flex items-center justify-center shadow-lg`}>
              <Store className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Nkiosk
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                {user.roleDisplay}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden hover:bg-blue-50"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700 rounded-xl font-medium transition-all duration-200"
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                <item.icon className="w-4 h-4" />
              </div>
              {item.label}
            </Button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200/50 bg-white/30">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100">
            <Avatar className="w-12 h-12 ring-2 ring-white shadow-lg">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className={`bg-gradient-to-tr ${getRoleColor(user.role)} text-white text-sm font-bold`}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-600 truncate">{user.roleDisplay}</p>
              <p className="text-xs text-blue-600 font-medium">Active</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Navigation Bar */}
        <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-slate-200/50 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-blue-50"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Page Title Context */}
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-slate-800">
                  Welcome back, {user.name.split(' ')[0]}
                </h2>
                <p className="text-sm text-slate-600">
                  {user.roleDisplay} Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-indigo-50 rounded-xl"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-xs border-2 border-white"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 h-10 px-3 hover:bg-indigo-50 rounded-xl">
                    <Avatar className="w-8 h-8 ring-2 ring-indigo-100">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className={`bg-gradient-to-tr ${getRoleColor(user.role)} text-white text-xs font-semibold`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden sm:block">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-600">{user.roleDisplay}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 border-slate-200">
                  <DropdownMenuLabel className="font-semibold text-slate-800">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-indigo-50">
                    <Settings className="mr-2 h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;