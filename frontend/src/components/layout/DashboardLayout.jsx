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

  const navItems = getRoleNavigation(user.role);

  const NavigationItem = ({ item, isActive, onClick }) => {
    const IconComponent = item.icon;
    
    return (
      <li>
        <button
          onClick={onClick}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-200 group
            ${isActive 
              ? 'bg-coral-red text-white shadow-lg shadow-coral-red/25' 
              : 'text-app-gray-700 hover:bg-coral-red-50 hover:text-coral-red'
            }
          `}
        >
          <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-app-gray-500 group-hover:text-coral-red'}`} />
          <span className="flex-1">{item.label}</span>
          {isActive && (
            <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
          )}
        </button>
      </li>
    );
  };

  return (
    <div className="min-h-screen bg-app-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-app-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-coral-red to-deep-red rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-app-gray-900">Nkiosk</h1>
                <p className="text-xs text-app-gray-500 uppercase tracking-wider">{user.roleDisplay}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-app-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5 text-app-gray-500" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-app-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 ring-2 ring-coral-red-100">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-gradient-to-tr from-coral-red to-deep-red text-white font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-app-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-app-gray-500 truncate">{user.email}</p>
                {(user.tenant || user.store || user.business) && (
                  <p className="text-xs text-coral-red font-medium truncate">
                    {user.tenant || user.store || user.business}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <NavigationItem
                  key={index}
                  item={item}
                  isActive={activeTab === item.tab}
                  onClick={() => {
                    if (onTabChange && item.tab) {
                      onTabChange(item.tab);
                      setSidebarOpen(false);
                    } else if (item.href) {
                      navigate(item.href);
                    }
                  }}
                />
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-app-gray-200">
            <div className="space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-app-gray-700 hover:text-coral-red hover:bg-coral-red-50"
                onClick={() => navigate('/settings')}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-app-gray-700 hover:text-deep-red hover:bg-deep-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="md:ml-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-app-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-app-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-app-gray-700" />
              </Button>
              
              <div className="flex items-center gap-2 text-sm">
                <span className="text-app-gray-500">Dashboard</span>
                <ChevronRight className="w-4 h-4 text-app-gray-400" />
                <span className="text-app-gray-900 font-medium capitalize">
                  {activeTab || 'Overview'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative hover:bg-app-gray-100"
              >
                <Bell className="w-5 h-5 text-app-gray-600" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-coral-red text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 ring-2 ring-coral-red-100">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-tr from-coral-red to-deep-red text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white border-app-gray-200" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-app-gray-900">{user.name}</p>
                      <p className="text-xs text-app-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-app-gray-200" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-app-gray-50" onClick={() => navigate('/profile')}>
                    <UserCog className="mr-2 h-4 w-4 text-app-gray-500" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-app-gray-50" onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4 text-app-gray-500" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-app-gray-200" />
                  <DropdownMenuItem className="cursor-pointer hover:bg-deep-red-50 text-deep-red" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;