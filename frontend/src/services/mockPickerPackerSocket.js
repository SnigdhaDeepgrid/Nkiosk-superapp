// Mock WebSocket service for Picker and Packer real-time sync
class MockPickerPackerSocket {
  constructor(url, workerId, workerType) {
    this.url = url;
    this.workerId = workerId;
    this.workerType = workerType;
    this.isConnected = false;
    this.listeners = {};
    this.mockEvents = [];
    
    // Simulate connection
    setTimeout(() => {
      this.isConnected = true;
      this.emit('connect');
      console.log(`🔌 Mock Picker/Packer Socket connected for ${workerType}: ${workerId}`);
      
      // Join worker-specific room
      this.joinRoom(`${workerType}:${workerId}`);
      
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
    
    // Log all emitted events for debugging
    console.log(`📡 ${this.workerType} emitted:`, event, data);
  }

  joinRoom(room) {
    console.log(`🏠 Joined room: ${room}`);
  }

  disconnect() {
    this.isConnected = false;
    this.emit('disconnect');
    console.log('🔌 Mock Picker/Packer Socket disconnected');
  }

  startMockEvents() {
    // Simulate new orders being assigned (for pickers)
    if (this.workerType === 'picker') {
      const orderAssignmentInterval = setInterval(() => {
        if (this.isConnected && Math.random() > 0.7) {
          this.simulateNewOrderAssignment();
        }
      }, 30000); // 30 seconds

      this.intervals = [orderAssignmentInterval];
    }

    // Simulate orders ready for packing (for packers)
    if (this.workerType === 'packer') {
      const packingReadyInterval = setInterval(() => {
        if (this.isConnected && Math.random() > 0.8) {
          this.simulateOrderReadyForPacking();
        }
      }, 25000); // 25 seconds

      this.intervals = [packingReadyInterval];
    }

    // Simulate priority updates for both
    const priorityUpdateInterval = setInterval(() => {
      if (this.isConnected && Math.random() > 0.85) {
        this.simulatePriorityUpdate();
      }
    }, 45000); // 45 seconds

    if (!this.intervals) this.intervals = [];
    this.intervals.push(priorityUpdateInterval);
  }

  simulateNewOrderAssignment() {
    const mockOrders = [
      {
        id: `ORD_${Date.now()}`,
        customerName: 'John Smith',
        industry: 'grocery',
        priority: 'high',
        estimatedTime: 15,
        totalItems: 8,
        items: [
          { id: 'item_001', name: 'Organic Bananas', quantity: 2, unit: 'bunch', barcode: '1234567890123', location: 'Aisle 1-A' },
          { id: 'item_002', name: 'Whole Milk', quantity: 1, unit: 'gallon', barcode: '2345678901234', location: 'Dairy Section' },
          { id: 'item_003', name: 'Bread - Whole Wheat', quantity: 1, unit: 'loaf', barcode: '3456789012345', location: 'Bakery' },
          { id: 'item_004', name: 'Greek Yogurt', quantity: 3, unit: 'container', barcode: '4567890123456', location: 'Dairy Section' }
        ],
        deliveryAddress: '123 Main St, City',
        timestamp: new Date()
      },
      {
        id: `ORD_${Date.now() + 1}`,
        customerName: 'Sarah Johnson',
        industry: 'pharmacy',
        priority: 'urgent',
        estimatedTime: 10,
        totalItems: 3,
        items: [
          { id: 'med_001', name: 'Ibuprofen 200mg', quantity: 1, unit: 'bottle', barcode: '5678901234567', location: 'Pharmacy-A1' },
          { id: 'med_002', name: 'Vitamin D3', quantity: 1, unit: 'bottle', barcode: '6789012345678', location: 'Pharmacy-B2' },
          { id: 'med_003', name: 'Hand Sanitizer', quantity: 2, unit: 'bottle', barcode: '7890123456789', location: 'Health & Beauty' }
        ],
        deliveryAddress: '456 Oak Ave, Town',
        timestamp: new Date()
      }
    ];

    const randomOrder = mockOrders[Math.floor(Math.random() * mockOrders.length)];
    
    console.log('📋 New order assigned:', randomOrder);
    this.emit('new_order_assigned', randomOrder);
  }

  simulateOrderReadyForPacking() {
    const mockReadyOrder = {
      id: `ORD_${Date.now()}`,
      customerName: 'Mike Wilson',
      industry: 'electronics',
      priority: 'normal',
      completedPickingAt: new Date(),
      pickedItems: 5,
      outOfStockItems: 1,
      items: [
        { id: 'elec_001', name: 'Wireless Headphones', quantity: 1, unit: 'piece', status: 'picked', packageType: 'box' },
        { id: 'elec_002', name: 'Phone Charger', quantity: 2, unit: 'piece', status: 'picked', packageType: 'bag' },
        { id: 'elec_003', name: 'Screen Protector', quantity: 1, unit: 'piece', status: 'out_of_stock', reason: 'Temporarily unavailable' }
      ],
      deliveryAddress: '789 Pine St, Village',
      timestamp: new Date()
    };
    
    console.log('📦 Order ready for packing:', mockReadyOrder);
    this.emit('order_ready_for_packing', mockReadyOrder);
  }

  simulatePriorityUpdate() {
    const priorityUpdate = {
      orderId: `ORD_${Math.floor(Math.random() * 1000)}`,
      newPriority: Math.random() > 0.5 ? 'urgent' : 'high',
      reason: 'Customer requested rush delivery',
      timestamp: new Date()
    };
    
    console.log('⚡ Priority update:', priorityUpdate);
    this.emit('priority_update', priorityUpdate);
  }

  // Simulate item status synchronization between picker and packer
  syncItemStatus(orderId, itemId, status, reason = null) {
    const syncData = {
      orderId,
      itemId,
      status,
      reason,
      syncedAt: new Date(),
      workerId: this.workerId,
      workerType: this.workerType
    };
    
    console.log('🔄 Item status sync:', syncData);
    this.emit('item_status_synced', syncData);
  }

  // Simulate label generation notification
  notifyLabelGenerated(orderId, labelId, qrCode) {
    const labelData = {
      orderId,
      labelId,
      qrCode,
      generatedAt: new Date(),
      readyForDelivery: true
    };
    
    console.log('🏷️ Label generated:', labelData);
    this.emit('label_generated', labelData);
  }

  cleanup() {
    if (this.intervals) {
      this.intervals.forEach(interval => clearInterval(interval));
    }
    this.disconnect();
  }
}

// Factory functions for different worker types
export const createPickerSocket = (workerId = 'picker_001') => {
  const wsUrl = 'ws://mock-picker-socket/warehouse';
  return new MockPickerPackerSocket(wsUrl, workerId, 'picker');
};

export const createPackerSocket = (workerId = 'packer_001') => {
  const wsUrl = 'ws://mock-packer-socket/warehouse';
  return new MockPickerPackerSocket(wsUrl, workerId, 'packer');
};

// Mock barcode scanning API
export const mockBarcodeScan = async (code) => {
  // Simulate scanning delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock product database lookup
  const mockProducts = {
    '1234567890123': { name: 'Organic Bananas', verified: true },
    '2345678901234': { name: 'Whole Milk', verified: true },
    '3456789012345': { name: 'Bread - Whole Wheat', verified: true },
    '4567890123456': { name: 'Greek Yogurt', verified: true },
    '5678901234567': { name: 'Ibuprofen 200mg', verified: true },
    '6789012345678': { name: 'Vitamin D3', verified: true },
    '7890123456789': { name: 'Hand Sanitizer', verified: true }
  };
  
  const product = mockProducts[code];
  
  return {
    success: !!product,
    product: product || null,
    scannedCode: code,
    timestamp: new Date()
  };
};

export default MockPickerPackerSocket;