// Mock WebSocket service for delivery partner dashboard
class MockWebSocket {
  constructor(url, riderId) {
    this.url = url;
    this.riderId = riderId;
    this.isConnected = false;
    this.listeners = {};
    this.mockEvents = [];
    
    // Simulate connection
    setTimeout(() => {
      this.isConnected = true;
      this.emit('connect');
      console.log(`🔌 Mock WebSocket connected for rider: ${riderId}`);
      
      // Join rider room
      this.joinRoom(`rider:${riderId}`);
      
      // Start mock event simulation
      this.startMockEvents();
    }, 1000);
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
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  joinRoom(room) {
    console.log(`🏠 Joined room: ${room}`);
  }

  disconnect() {
    this.isConnected = false;
    this.emit('disconnect');
    console.log('🔌 Mock WebSocket disconnected');
  }

  startMockEvents() {
    // Simulate job proposals every 30-60 seconds
    const jobProposalInterval = setInterval(() => {
      if (this.isConnected && Math.random() > 0.5) {
        this.simulateJobProposal();
      }
    }, 45000); // 45 seconds

    // Simulate order updates occasionally
    const orderUpdateInterval = setInterval(() => {
      if (this.isConnected && Math.random() > 0.7) {
        this.simulateOrderUpdate();
      }
    }, 20000); // 20 seconds

    // Store intervals for cleanup
    this.intervals = [jobProposalInterval, orderUpdateInterval];
  }

  simulateJobProposal() {
    const mockJobs = [
      {
        id: `job_${Date.now()}`,
        storeType: 'Grocery Store',
        storeName: 'FreshMart Downtown',
        customerName: 'Sarah Johnson',
        items: 12,
        distance: '2.3 km',
        estimatedTime: '25 min',
        payout: 45.50,
        pickupAddress: '123 Main St, Downtown',
        deliveryAddress: '456 Oak Ave, Midtown',
        urgency: 'normal',
        timestamp: new Date()
      },
      {
        id: `job_${Date.now() + 1}`,
        storeType: 'Restaurant',
        storeName: 'Burger Palace',
        customerName: 'Mike Chen',
        items: 3,
        distance: '1.8 km',
        estimatedTime: '20 min',
        payout: 38.75,
        pickupAddress: '789 Food Court, Mall Plaza',
        deliveryAddress: '321 Pine St, Westside',
        urgency: 'high',
        timestamp: new Date()
      },
      {
        id: `job_${Date.now() + 2}`,
        storeType: 'Pharmacy',
        storeName: 'HealthPlus Pharmacy',
        customerName: 'Emma Wilson',
        items: 2,
        distance: '3.1 km',
        estimatedTime: '30 min',
        payout: 52.25,
        pickupAddress: '555 Health Ave, Medical District',
        deliveryAddress: '888 Elm St, Suburbs',
        urgency: 'normal',
        timestamp: new Date()
      }
    ];

    const randomJob = mockJobs[Math.floor(Math.random() * mockJobs.length)];
    
    console.log('📋 New job proposal:', randomJob);
    this.emit('rider.job.proposed', randomJob);
  }

  simulateOrderUpdate() {
    const updates = [
      {
        type: 'order.picked_up',
        orderId: 'order_123',
        message: 'Order has been picked up from store',
        timestamp: new Date()
      },
      {
        type: 'order.otp.issued',
        orderId: 'order_123',
        otp: '123456',
        message: 'OTP has been issued for delivery verification',
        timestamp: new Date()
      },
      {
        type: 'rider.job.assigned',
        assignmentId: 'assign_456',
        message: 'New delivery assignment received',
        timestamp: new Date()
      }
    ];

    const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
    
    console.log('📱 Order update:', randomUpdate);
    this.emit(randomUpdate.type, randomUpdate);
  }

  cleanup() {
    if (this.intervals) {
      this.intervals.forEach(interval => clearInterval(interval));
    }
    this.disconnect();
  }
}

// Factory function to create mock WebSocket connection
export const createMockWebSocket = (riderId = 'rider_001') => {
  const wsUrl = 'ws://mock-delivery-socket/rider';
  return new MockWebSocket(wsUrl, riderId);
};

// Mock API service for location updates
export const sendLocationUpdate = async (lat, lng, riderId) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`📍 Location updated for rider ${riderId}:`, { lat, lng });
      resolve({ success: true, timestamp: new Date() });
    }, 500);
  });
};

export default MockWebSocket;