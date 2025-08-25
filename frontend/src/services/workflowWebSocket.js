// Comprehensive WebSocket service for nKiosk order workflow
class WorkflowWebSocket {
  constructor(url, userId, userRole) {
    this.url = url;
    this.userId = userId;
    this.userRole = userRole;
    this.isConnected = false;
    this.listeners = {};
    this.channels = [];
    
    // Auto-reconnect settings
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 5000;
    
    // Connect automatically
    this.connect();
  }

  connect() {
    try {
      console.log(`🔌 Connecting workflow WebSocket for ${this.userRole}: ${this.userId}`);
      
      // Simulate connection
      setTimeout(() => {
        this.isConnected = true;
        this.emit('connect');
        
        // Subscribe to role-specific channels
        this.subscribeToChannels();
        
        // Start mock events
        this.startMockEvents();
        
        console.log(`✅ Workflow WebSocket connected for ${this.userRole}: ${this.userId}`);
      }, 1000);
      
    } catch (error) {
      console.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  subscribeToChannels() {
    // Subscribe to user-specific channel
    const userChannel = `${this.userRole}:${this.userId}`;
    this.joinChannel(userChannel);
    
    // Subscribe to role-specific global channels
    switch (this.userRole) {
      case 'customer':
        this.joinChannel(`customer:${this.userId}`);
        break;
      case 'store_manager':
        this.joinChannel(`store:${this.userId}`);
        this.joinChannel('store:global');
        break;
      case 'picker':
        this.joinChannel(`picker:${this.userId}`);
        this.joinChannel('picker:global');
        break;
      case 'packer':
        this.joinChannel(`packer:${this.userId}`);
        this.joinChannel('packer:global');
        break;
      case 'delivery_partner':
        this.joinChannel(`rider:${this.userId}`);
        this.joinChannel('rider:global');
        break;
      case 'admin':
        this.joinChannel('admin:global');
        this.joinChannel('system:analytics');
        break;
    }
  }

  joinChannel(channel) {
    this.channels.push(channel);
    console.log(`📡 Joined channel: ${channel}`);
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data = {}) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback({
        ...data,
        timestamp: new Date(),
        userId: this.userId,
        userRole: this.userRole
      }));
    }
    
    // Log all events for debugging
    console.log(`📤 ${this.userRole} emitted:`, event, data);
  }

  startMockEvents() {
    // Simulate various workflow events based on role
    switch (this.userRole) {
      case 'customer':
        this.simulateCustomerEvents();
        break;
      case 'store_manager':
        this.simulateStoreEvents();
        break;
      case 'picker':
        this.simulatePickerEvents();
        break;
      case 'packer':
        this.simulatePackerEvents();
        break;
      case 'delivery_partner':
        this.simulateRiderEvents();
        break;
      case 'admin':
        this.simulateAdminEvents();
        break;
    }
  }

  simulateCustomerEvents() {
    // Simulate order status updates for customers
    const eventInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      if (Math.random() > 0.7) {
        const mockEvents = [
          {
            event: 'order.status.update',
            data: {
              orderId: `ORD_${Date.now()}`,
              status: 'accepted_by_store',
              message: 'Your order has been accepted by the store',
              estimatedTime: '25-30 minutes'
            }
          },
          {
            event: 'order.picker.assigned',
            data: {
              orderId: `ORD_${Date.now() - 1000}`,
              pickerName: 'Alex Thompson',
              message: 'Your order is now being picked'
            }
          },
          {
            event: 'order.ready.for.delivery',
            data: {
              orderId: `ORD_${Date.now() - 2000}`,
              riderName: 'Carlos Rodriguez',
              message: 'Your order is out for delivery',
              trackingUrl: '/track-order'
            }
          }
        ];
        
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        this.emit(randomEvent.event, randomEvent.data);
      }
    }, 30000);

    this.intervals = [eventInterval];
  }

  simulateStoreEvents() {
    // Simulate new orders and workflow updates for store managers
    const eventInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      if (Math.random() > 0.6) {
        const mockEvents = [
          {
            event: 'order.new',
            data: {
              orderId: `ORD_${Date.now()}`,
              customerName: 'John Doe',
              category: 'grocery',
              itemCount: 8,
              totalAmount: 156.75,
              urgency: 'normal'
            }
          },
          {
            event: 'picker.completed',
            data: {
              orderId: `ORD_${Date.now() - 1000}`,
              pickerId: 'picker_001',
              pickedItems: 7,
              missingItems: 1,
              message: 'Picking completed - ready for packing'
            }
          },
          {
            event: 'packer.completed',
            data: {
              orderId: `ORD_${Date.now() - 2000}`,
              packerId: 'packer_001',
              packageType: 'insulated_bag',
              message: 'Packing completed - ready for rider assignment'
            }
          }
        ];
        
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        this.emit(randomEvent.event, randomEvent.data);
      }
    }, 25000);

    this.intervals = [eventInterval];
  }

  simulatePickerEvents() {
    // Simulate picking assignments and updates
    const eventInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      if (Math.random() > 0.8) {
        const mockEvents = [
          {
            event: 'picker.assignment.new',
            data: {
              orderId: `ORD_${Date.now()}`,
              customerName: 'Sarah Wilson',
              category: 'pharmacy',
              itemCount: 5,
              priority: 'high',
              estimatedTime: 15
            }
          },
          {
            event: 'picker.assignment.priority.update',
            data: {
              orderId: `ORD_${Date.now() - 1000}`,
              newPriority: 'urgent',
              reason: 'Customer requested rush delivery'
            }
          }
        ];
        
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        this.emit(randomEvent.event, randomEvent.data);
      }
    }, 35000);

    this.intervals = [eventInterval];
  }

  simulatePackerEvents() {
    // Simulate packing assignments
    const eventInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      if (Math.random() > 0.8) {
        const mockEvents = [
          {
            event: 'packer.assignment.new',
            data: {
              orderId: `ORD_${Date.now()}`,
              customerName: 'David Chen',
              category: 'electronics',
              pickedItems: 4,
              specialInstructions: 'Fragile items - handle with care'
            }
          },
          {
            event: 'packer.item.substitution.required',
            data: {
              orderId: `ORD_${Date.now() - 1000}`,
              itemId: 'item_123',
              originalItem: 'iPhone 15 Pro',
              suggestedSubstitute: 'iPhone 15',
              reason: 'Original item out of stock'
            }
          }
        ];
        
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        this.emit(randomEvent.event, randomEvent.data);
      }
    }, 40000);

    this.intervals = [eventInterval];
  }

  simulateRiderEvents() {
    // Simulate delivery assignments and OTP events
    const eventInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      if (Math.random() > 0.7) {
        const mockEvents = [
          {
            event: 'rider.assignment.new',
            data: {
              orderId: `ORD_${Date.now()}`,
              customerName: 'Emma Johnson',
              pickupAddress: '123 Mall Plaza, Store #45',
              deliveryAddress: '456 Oak Street, Apartment 3B',
              distance: '2.3 km',
              payout: 45.50
            }
          },
          {
            event: 'rider.otp.generated',
            data: {
              orderId: `ORD_${Date.now() - 1000}`,
              otp: Math.floor(100000 + Math.random() * 900000).toString(),
              customerPhone: '+91-98765-43210',
              message: 'OTP sent to customer for delivery verification'
            }
          }
        ];
        
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        this.emit(randomEvent.event, randomEvent.data);
      }
    }, 30000);

    this.intervals = [eventInterval];
  }

  simulateAdminEvents() {
    // Simulate system-wide analytics and alerts
    const eventInterval = setInterval(() => {
      if (!this.isConnected) return;
      
      if (Math.random() > 0.9) {
        const mockEvents = [
          {
            event: 'system.analytics.update',
            data: {
              totalOrders: Math.floor(Math.random() * 1000) + 500,
              activeRiders: Math.floor(Math.random() * 50) + 20,
              avgDeliveryTime: Math.floor(Math.random() * 10) + 25,
              revenue: Math.floor(Math.random() * 50000) + 25000
            }
          },
          {
            event: 'system.alert.high.volume',
            data: {
              message: 'High order volume detected in Electronics category',
              category: 'electronics',
              orderCount: 156,
              recommendation: 'Consider assigning additional pickers'
            }
          }
        ];
        
        const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
        this.emit(randomEvent.event, randomEvent.data);
      }
    }, 60000);

    this.intervals = [eventInterval];
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectInterval);
    } else {
      console.error('❌ Max reconnection attempts reached');
      this.emit('connection.failed');
    }
  }

  disconnect() {
    this.isConnected = false;
    
    if (this.intervals) {
      this.intervals.forEach(interval => clearInterval(interval));
    }
    
    this.emit('disconnect');
    console.log('🔌 Workflow WebSocket disconnected');
  }

  cleanup() {
    this.disconnect();
    this.listeners = {};
    this.channels = [];
  }
}

// Factory functions for different roles
export const createWorkflowWebSocket = (userId, userRole) => {
  const wsUrl = `ws://mock-workflow-socket/${userRole}`;
  return new WorkflowWebSocket(wsUrl, userId, userRole);
};

// Mock backend API functions
export const mockBackendFunctions = {
  notifyStoreManager: async (storeId, message, orderData) => {
    console.log(`🏪 Store Manager ${storeId} notified: ${message}`, orderData);
    return { success: true, timestamp: new Date() };
  },

  assignPicker: async (orderId, pickerId, storeId) => {
    console.log(`📦 Picker ${pickerId} assigned to order ${orderId} by store ${storeId}`);
    return { 
      success: true, 
      assignmentId: `PICK_${Date.now()}`,
      estimatedTime: 15 
    };
  },

  assignPacker: async (orderId, packerId, storeId) => {
    console.log(`📋 Packer ${packerId} assigned to order ${orderId} by store ${storeId}`);
    return { 
      success: true, 
      assignmentId: `PACK_${Date.now()}`,
      estimatedTime: 10 
    };
  },

  notifyRiderNearby: async (riderId, location, orderId) => {
    console.log(`🚚 Rider ${riderId} location updated for order ${orderId}:`, location);
    return { success: true, trackingUpdate: true };
  },

  sendOtpToCustomer: async (customerId, otp, orderId, method = 'SMS') => {
    console.log(`📱 ${method} OTP sent to customer ${customerId} for order ${orderId}: ${otp}`);
    return { 
      success: true, 
      messageId: `MSG_${Date.now()}`,
      deliveredAt: new Date() 
    };
  },

  generateOrderOtp: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  validateOrderOtp: (providedOtp, generatedOtp) => {
    return providedOtp === generatedOtp;
  }
};

export default WorkflowWebSocket;