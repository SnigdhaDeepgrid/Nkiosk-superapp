export const mockData = {
  // Tenants data for SaaS Admin
  tenants: [
    {
      id: '1',
      name: 'QuickMart',
      domain: 'quickmart.deliveryhub.com',
      status: 'active',
      users: 1245,
      createdAt: 'Jan 15, 2024',
      plan: 'Enterprise',
      monthlyRevenue: 45000,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'FreshGrocery',
      domain: 'freshgrocery.deliveryhub.com',
      status: 'active',
      users: 892,
      createdAt: 'Feb 3, 2024',
      plan: 'Professional',
      monthlyRevenue: 32000,
      lastActive: '5 minutes ago'
    },
    {
      id: '3',
      name: 'PharmaCare',
      domain: 'pharmacare.deliveryhub.com',
      status: 'active',
      users: 567,
      createdAt: 'Mar 8, 2024',
      plan: 'Professional',
      monthlyRevenue: 28000,
      lastActive: '1 hour ago'
    },
    {
      id: '4',
      name: 'TechZone',
      domain: 'techzone.deliveryhub.com',
      status: 'suspended',
      users: 234,
      createdAt: 'Apr 12, 2024',
      plan: 'Basic',
      monthlyRevenue: 12000,
      lastActive: '2 days ago'
    },
    {
      id: '5',
      name: 'FoodieExpress',
      domain: 'foodieexpress.deliveryhub.com',
      status: 'active',
      users: 1876,
      createdAt: 'May 20, 2024',
      plan: 'Enterprise',
      monthlyRevenue: 67000,
      lastActive: '30 minutes ago'
    }
  ],

  // Analytics data
  analytics: {
    totalUsers: 28456,
    monthlyRevenue: 184000,
    activeOrders: 3421,
    completionRate: 96.8,
  },

  // Recent activity for dashboard
  recentActivity: [
    {
      action: 'New tenant "UrbanEats" registered',
      timestamp: '5 minutes ago',
      type: 'tenant',
    },
    {
      action: 'System maintenance completed successfully',
      timestamp: '2 hours ago',
      type: 'system',
    },
    {
      action: 'Payment gateway integration updated',
      timestamp: '4 hours ago',
      type: 'integration',
    },
    {
      action: 'QuickMart upgraded to Enterprise plan',
      timestamp: '1 day ago',
      type: 'billing',
    },
    {
      action: 'New API rate limits applied',
      timestamp: '2 days ago',
      type: 'system',
    },
  ],

  // System status
  systemStatus: [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.9%',
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '100%',
    },
    {
      name: 'Payment Service',
      status: 'operational',
      uptime: '99.7%',
    },
    {
      name: 'Notification Service',
      status: 'degraded',
      uptime: '98.2%',
    },
    {
      name: 'Analytics Engine',
      status: 'operational',
      uptime: '99.8%',
    },
  ],

  // Revenue breakdown
  revenueByCategory: [
    {
      name: 'Food Delivery',
      revenue: 74000,
      percentage: 40.2,
    },
    {
      name: 'Grocery',
      revenue: 55000,
      percentage: 29.9,
    },
    {
      name: 'Pharmacy',
      revenue: 33000,
      percentage: 17.9,
    },
    {
      name: 'Electronics',
      revenue: 22000,
      percentage: 12.0,
    },
  ],

  // Users data (for different roles)
  users: [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@quickmart.com',
      role: 'store_manager',
      status: 'active',
      lastLogin: '2 hours ago',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Bob Smith',
      email: 'bob@quickmart.com',
      role: 'vendor',
      status: 'active',
      lastLogin: '1 day ago',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    },
    {
      id: '3',
      name: 'Carol Davis',
      email: 'carol@deliveryfast.com',
      role: 'delivery_partner',
      status: 'active',
      lastLogin: '30 minutes ago',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
  ],

  // Orders data
  orders: [
    {
      id: '#ORD-2024-001',
      customer: 'John Doe',
      items: 5,
      total: 45.99,
      status: 'delivered',
      date: '2024-01-20',
      time: '2:30 PM'
    },
    {
      id: '#ORD-2024-002',
      customer: 'Jane Smith',
      items: 3,
      total: 29.50,
      status: 'in_transit',
      date: '2024-01-20',
      time: '3:15 PM'
    },
    {
      id: '#ORD-2024-003',
      customer: 'Mike Johnson',
      items: 8,
      total: 67.25,
      status: 'processing',
      date: '2024-01-20',
      time: '4:00 PM'
    },
  ]
};