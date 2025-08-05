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
  Building2,
  Users,
  Store,
  Package,
  Truck,
  ShoppingCart,
  HeadphonesIcon,
  Settings,
  LogOut,
  Bell,
  Menu,
  X
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
        { label: 'Dashboard', href: '/dashboard', icon: Building2 },
        { label: 'Tenants', href: '/tenants', icon: Users },
        { label: 'Analytics', href: '/analytics', icon: Package },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
      super_admin: [
        { label: 'Dashboard', href: '/dashboard', icon: Store },
        { label: 'Users', href: '/users', icon: Users },
        { label: 'Products', href: '/products', icon: Package },
        { label: 'Orders', href: '/orders', icon: ShoppingCart },
        { label: 'Analytics', href: '/analytics', icon: Package },
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
        { label: 'Analytics', href: '/analytics', icon: Package },
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
        { label: 'Dashboard', href: '/dashboard', icon: HeadphonesIcon },
        { label: 'Tickets', href: '/tickets', icon: HeadphonesIcon },
        { label: 'Knowledge Base', href: '/kb', icon: Package },
      ],
    };

    return navItems[role] || [];
  };

  const navigation = getRoleNavigation(user.role);

  const getRoleColor = (role) => {
    const colors = {
      saas_admin: 'from-purple-600 to-purple-800',
      super_admin: 'from-blue-600 to-blue-800',
      store_manager: 'from-green-600 to-green-800',
      vendor: 'from-orange-600 to-orange-800',
      delivery_partner: 'from-yellow-600 to-yellow-800',
      customer: 'from-pink-600 to-pink-800',
      support_staff: 'from-indigo-600 to-indigo-800',
    };
    return colors[role] || 'from-slate-600 to-slate-800';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 bg-gradient-to-tr ${getRoleColor(user.role)} rounded-lg flex items-center justify-center`}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">DeliveryHub</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Button
              key={item.href}
              variant="ghost"
              className="w-full justify-start gap-3 h-12 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Button>
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className={`bg-gradient-to-tr ${getRoleColor(user.role)} text-white text-sm font-semibold`}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-600 truncate">{user.roleDisplay}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navigation */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-6">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>

            <div className="flex items-center gap-4 ml-auto">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-3 h-10 px-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className={`bg-gradient-to-tr ${getRoleColor(user.role)} text-white text-xs font-semibold`}>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm font-medium text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-600">{user.roleDisplay}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;