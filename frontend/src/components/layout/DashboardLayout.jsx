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
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
  BarChart3,
  UserCog,
  Building2,
  Package,
  ShoppingCart,
  Truck,
  UserCheck,
  Tag
} from 'lucide-react';

const DashboardLayout = ({ children, user, activeTab, onTabChange }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getRoleNavigation = (role) => {
    const navItems = {
      saas_admin: [
        { label: 'Dashboard', tab: 'overview', icon: Store },
        { label: 'Tenants', tab: 'tenants', icon: Users },
        { label: 'Analytics', tab: 'analytics', icon: BarChart3 },
        { label: 'User Management', tab: 'users', icon: UserCog },
        { label: 'Platform Config', tab: 'config', icon: Settings },
        { label: 'Security Center', tab: 'security', icon: Shield },
        { label: 'Notifications', tab: 'notifications', icon: Bell },
      ],
      super_admin: [
        { label: 'Overview', tab: 'overview', icon: Store },
        { label: 'Staff', tab: 'staff', icon: Users },
        { label: 'Outlets', tab: 'outlets', icon: Building2 },
        { label: 'Products', tab: 'products', icon: Package },
        { label: 'Orders', tab: 'orders', icon: ShoppingCart },
        { label: 'Delivery', tab: 'delivery', icon: Truck },
        { label: 'Customers', tab: 'customers', icon: UserCheck },
        { label: 'Analytics', tab: 'analytics', icon: BarChart3 },
        { label: 'Promotions', tab: 'promotions', icon: Tag },
        { label: 'Audit', tab: 'audit', icon: Shield },
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
        { label: 'Dashboard', href: '/dashboard', icon: Package },
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
        { label: 'Dashboard', href: '/dashboard', icon: UserCheck },
        { label: 'Tickets', href: '/tickets', icon: Settings },
        { label: 'Knowledge Base', href: '/kb', icon: Package },
      ],
    };

    return navItems[role] || [];
  };

  const navigation = getRoleNavigation(user.role);

  const getRoleColor = (role) => {
    const colors = {
      saas_admin: 'from-blue-600 to-green-600',
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white/95 backdrop-blur-xl shadow-2xl border-r border-slate-200/80 transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200/60 bg-gradient-to-r from-white/80 to-blue-50/50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 bg-gradient-to-tr ${getRoleColor(user.role)} rounded-xl flex items-center justify-center shadow-lg`}>
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
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
            className="lg:hidden hover:bg-blue-50 w-8 h-8 p-0 rounded-lg"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigation.map((item, index) => (
            <Button
              key={item.label}
              variant="ghost"
              className={`w-full justify-start gap-3 h-11 font-medium transition-all duration-200 text-sm rounded-lg ${
                activeTab === item.tab 
                  ? 'bg-gradient-to-r from-blue-50 to-green-50 text-blue-700 shadow-sm' 
                  : 'text-slate-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:text-blue-700'
              }`}
              onClick={() => {
                if (item.tab) {
                  onTabChange?.(item.tab);
                } else if (item.href) {
                  navigate(item.href);
                }
                setSidebarOpen(false);
              }}
            >
              <div className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-white flex items-center justify-center transition-colors">
                <item.icon className="w-4 h-4" />
              </div>
              {item.label}
            </Button>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200/60 bg-gradient-to-r from-white/50 to-blue-50/30">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-green-50 border border-blue-100/60">
            <Avatar className="w-10 h-10 ring-2 ring-white shadow-sm">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className={`bg-gradient-to-tr ${getRoleColor(user.role)} text-white text-sm font-bold`}>
                {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
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
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-auto">
        {/* Top Navigation Bar */}
        <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200/60 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden hover:bg-blue-50 w-9 h-9 p-0 rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              
              {/* Page Title Context */}
              <div className="hidden sm:block">
                <h2 className="text-lg font-semibold text-slate-800">
                  Welcome back, {user.name ? user.name.split(' ')[0] : 'User'}
                </h2>
                <p className="text-sm text-slate-600">
                  {user.roleDisplay} Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-blue-50 rounded-lg w-9 h-9 p-0"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-full border border-white"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 h-10 px-3 hover:bg-blue-50 rounded-lg">
                    <Avatar className="w-8 h-8 ring-1 ring-blue-100">
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
                <DropdownMenuContent align="end" className="w-56 border-slate-200 shadow-lg">
                  <DropdownMenuLabel className="font-semibold text-slate-800">My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:bg-blue-50">
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
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;