import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Order Status Constants
export const ORDER_STATUSES = {
  PLACED: 'placed',
  ACCEPTED: 'accepted_by_store',
  ASSIGNED_TO_PICKER: 'assigned_to_picker', 
  PICKED: 'picked',
  ASSIGNED_TO_PACKER: 'assigned_to_packer',
  PACKED: 'packed',
  ASSIGNED_TO_RIDER: 'assigned_to_rider',
  PICKED_UP: 'picked_up',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// Industry Categories
export const CATEGORIES = {
  GROCERY: 'grocery',
  PHARMACY: 'pharmacy', 
  ELECTRONICS: 'electronics',
  FOOD_DELIVERY: 'food_delivery'
};

// Initial state
const initialState = {
  // Orders by user role
  customerOrders: {},
  storeOrders: {},
  pickerOrders: {},
  packerOrders: {},
  riderOrders: {},
  adminOrders: [],
  
  // Current user context
  currentUser: null,
  currentRole: null,
  
  // Real-time data
  liveUpdates: {},
  otpData: {},
  
  // WebSocket connection
  websocket: null,
  
  // Workflow tracking
  orderTracking: {},
  notifications: []
};

// Action types
const WORKFLOW_ACTIONS = {
  // Order lifecycle
  PLACE_ORDER: 'PLACE_ORDER',
  ACCEPT_ORDER: 'ACCEPT_ORDER',
  REJECT_ORDER: 'REJECT_ORDER',
  ASSIGN_PICKER: 'ASSIGN_PICKER',
  COMPLETE_PICKING: 'COMPLETE_PICKING',
  ASSIGN_PACKER: 'ASSIGN_PACKER',
  COMPLETE_PACKING: 'COMPLETE_PACKING',
  ASSIGN_RIDER: 'ASSIGN_RIDER',
  PICKUP_ORDER: 'PICKUP_ORDER',
  GENERATE_OTP: 'GENERATE_OTP',
  VERIFY_OTP: 'VERIFY_OTP',
  DELIVER_ORDER: 'DELIVER_ORDER',
  CANCEL_ORDER: 'CANCEL_ORDER',
  
  // Real-time updates
  WEBSOCKET_CONNECT: 'WEBSOCKET_CONNECT',
  RECEIVE_UPDATE: 'RECEIVE_UPDATE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  
  // User management
  SET_USER_CONTEXT: 'SET_USER_CONTEXT',
  UPDATE_TRACKING: 'UPDATE_TRACKING'
};

// Reducer function
function orderWorkflowReducer(state, action) {
  switch (action.type) {
    case WORKFLOW_ACTIONS.PLACE_ORDER:
      const newOrder = {
        ...action.payload,
        id: `ORD_${Date.now()}`,
        status: ORDER_STATUSES.PLACED,
        createdAt: new Date(),
        timeline: [{
          status: ORDER_STATUSES.PLACED,
          timestamp: new Date(),
          message: 'Order placed successfully'
        }]
      };
      
      return {
        ...state,
        customerOrders: {
          ...state.customerOrders,
          [newOrder.customerId]: [
            ...(state.customerOrders[newOrder.customerId] || []),
            newOrder
          ]
        },
        storeOrders: {
          ...state.storeOrders,
          [newOrder.storeId]: [
            ...(state.storeOrders[newOrder.storeId] || []),
            newOrder
          ]
        },
        adminOrders: [...state.adminOrders, newOrder]
      };

    case WORKFLOW_ACTIONS.ACCEPT_ORDER:
      return updateOrderStatus(state, action.payload.orderId, ORDER_STATUSES.ACCEPTED, 
        'Order accepted by store manager');

    case WORKFLOW_ACTIONS.ASSIGN_PICKER:
      const updatedState = updateOrderStatus(state, action.payload.orderId, 
        ORDER_STATUSES.ASSIGNED_TO_PICKER, 'Assigned to picker for item collection');
      
      return {
        ...updatedState,
        pickerOrders: {
          ...updatedState.pickerOrders,
          [action.payload.pickerId]: [
            ...(updatedState.pickerOrders[action.payload.pickerId] || []),
            findOrderById(updatedState, action.payload.orderId)
          ]
        }
      };

    case WORKFLOW_ACTIONS.COMPLETE_PICKING:
      return updateOrderStatus(state, action.payload.orderId, ORDER_STATUSES.PICKED,
        'Items picked successfully', action.payload.pickedItems);

    case WORKFLOW_ACTIONS.ASSIGN_PACKER:
      const packerState = updateOrderStatus(state, action.payload.orderId, 
        ORDER_STATUSES.ASSIGNED_TO_PACKER, 'Assigned to packer for packaging');
      
      return {
        ...packerState,
        packerOrders: {
          ...packerState.packerOrders,
          [action.payload.packerId]: [
            ...(packerState.packerOrders[action.payload.packerId] || []),
            findOrderById(packerState, action.payload.orderId)
          ]
        }
      };

    case WORKFLOW_ACTIONS.COMPLETE_PACKING:
      return updateOrderStatus(state, action.payload.orderId, ORDER_STATUSES.PACKED,
        'Order packed and ready for delivery', action.payload.packageInfo);

    case WORKFLOW_ACTIONS.ASSIGN_RIDER:
      const riderState = updateOrderStatus(state, action.payload.orderId, 
        ORDER_STATUSES.ASSIGNED_TO_RIDER, 'Assigned to delivery partner');
      
      return {
        ...riderState,
        riderOrders: {
          ...riderState.riderOrders,
          [action.payload.riderId]: [
            ...(riderState.riderOrders[action.payload.riderId] || []),
            findOrderById(riderState, action.payload.orderId)
          ]
        }
      };

    case WORKFLOW_ACTIONS.PICKUP_ORDER:
      return updateOrderStatus(state, action.payload.orderId, ORDER_STATUSES.PICKED_UP,
        'Order picked up by delivery partner');

    case WORKFLOW_ACTIONS.GENERATE_OTP:
      return {
        ...state,
        otpData: {
          ...state.otpData,
          [action.payload.orderId]: {
            otp: action.payload.otp,
            generatedAt: new Date(),
            customerId: action.payload.customerId
          }
        }
      };

    case WORKFLOW_ACTIONS.VERIFY_OTP:
      if (state.otpData[action.payload.orderId]?.otp === action.payload.otp) {
        return updateOrderStatus(state, action.payload.orderId, ORDER_STATUSES.DELIVERED,
          'Order delivered successfully');
      }
      return state;

    case WORKFLOW_ACTIONS.WEBSOCKET_CONNECT:
      return {
        ...state,
        websocket: action.payload
      };

    case WORKFLOW_ACTIONS.RECEIVE_UPDATE:
      return {
        ...state,
        liveUpdates: {
          ...state.liveUpdates,
          [action.payload.orderId]: action.payload
        }
      };

    case WORKFLOW_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          {
            id: Date.now(),
            ...action.payload,
            timestamp: new Date()
          },
          ...state.notifications.slice(0, 49) // Keep last 50 notifications
        ]
      };

    case WORKFLOW_ACTIONS.SET_USER_CONTEXT:
      return {
        ...state,
        currentUser: action.payload.user,
        currentRole: action.payload.role
      };

    default:
      return state;
  }
}

// Helper functions
function updateOrderStatus(state, orderId, newStatus, message, additionalData = {}) {
  const updateOrder = (order) => {
    if (order.id === orderId) {
      return {
        ...order,
        status: newStatus,
        timeline: [
          ...order.timeline,
          {
            status: newStatus,
            timestamp: new Date(),
            message
          }
        ],
        ...additionalData
      };
    }
    return order;
  };

  return {
    ...state,
    customerOrders: Object.keys(state.customerOrders).reduce((acc, customerId) => ({
      ...acc,
      [customerId]: state.customerOrders[customerId].map(updateOrder)
    }), {}),
    storeOrders: Object.keys(state.storeOrders).reduce((acc, storeId) => ({
      ...acc,
      [storeId]: state.storeOrders[storeId].map(updateOrder)
    }), {}),
    pickerOrders: Object.keys(state.pickerOrders).reduce((acc, pickerId) => ({
      ...acc,
      [pickerId]: state.pickerOrders[pickerId].map(updateOrder)
    }), {}),
    packerOrders: Object.keys(state.packerOrders).reduce((acc, packerId) => ({
      ...acc,
      [packerId]: state.packerOrders[packerId].map(updateOrder)
    }), {}),
    riderOrders: Object.keys(state.riderOrders).reduce((acc, riderId) => ({
      ...acc,
      [riderId]: state.riderOrders[riderId].map(updateOrder)
    }), {}),
    adminOrders: state.adminOrders.map(updateOrder)
  };
}

function findOrderById(state, orderId) {
  return state.adminOrders.find(order => order.id === orderId);
}

// Create context
const OrderWorkflowContext = createContext();

// Provider component
export const OrderWorkflowProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderWorkflowReducer, initialState);

  // Actions
  const actions = {
    // User management
    setUserContext: (user, role) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.SET_USER_CONTEXT, 
        payload: { user, role }
      });
    },

    // Order lifecycle
    placeOrder: (orderData) => {
      dispatch({ type: WORKFLOW_ACTIONS.PLACE_ORDER, payload: orderData });
      
      // Emit WebSocket event
      if (state.websocket) {
        state.websocket.emit('order.placed', orderData);
      }
      
      // Add notification
      actions.addNotification({
        type: 'order_placed',
        title: 'New Order Placed',
        message: `Order #${orderData.id} placed successfully`,
        userId: orderData.customerId
      });
    },

    acceptOrder: (orderId, storeManagerId) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.ACCEPT_ORDER, 
        payload: { orderId, storeManagerId }
      });
      
      if (state.websocket) {
        state.websocket.emit('order.accepted', { orderId, storeManagerId });
      }
      
      // Auto-assign picker for non-food orders
      const order = findOrderById(state, orderId);
      if (order && order.category !== CATEGORIES.FOOD_DELIVERY) {
        setTimeout(() => {
          actions.assignPicker(orderId, 'picker_001'); // Mock picker assignment
        }, 2000);
      }
    },

    rejectOrder: (orderId, reason) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.CANCEL_ORDER, 
        payload: { orderId, reason }
      });
    },

    assignPicker: (orderId, pickerId) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.ASSIGN_PICKER, 
        payload: { orderId, pickerId }
      });
      
      if (state.websocket) {
        state.websocket.emit('picker.assigned', { orderId, pickerId });
      }
      
      actions.addNotification({
        type: 'picker_assigned',
        title: 'Picking Assignment',
        message: `Order #${orderId.slice(-6)} assigned for picking`,
        userId: pickerId
      });
    },

    completePicking: (orderId, pickerId, pickedItems) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.COMPLETE_PICKING, 
        payload: { orderId, pickerId, pickedItems }
      });
      
      if (state.websocket) {
        state.websocket.emit('order.picked', { orderId, pickerId, pickedItems });
      }
      
      // Auto-assign packer
      setTimeout(() => {
        actions.assignPacker(orderId, 'packer_001');
      }, 1000);
    },

    assignPacker: (orderId, packerId) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.ASSIGN_PACKER, 
        payload: { orderId, packerId }
      });
      
      if (state.websocket) {
        state.websocket.emit('packer.assigned', { orderId, packerId });
      }
      
      actions.addNotification({
        type: 'packer_assigned',
        title: 'Packing Assignment',
        message: `Order #${orderId.slice(-6)} ready for packing`,
        userId: packerId
      });
    },

    completePacking: (orderId, packerId, packageInfo) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.COMPLETE_PACKING, 
        payload: { orderId, packerId, packageInfo }
      });
      
      if (state.websocket) {
        state.websocket.emit('order.packed', { orderId, packerId, packageInfo });
      }
      
      // Auto-assign rider
      setTimeout(() => {
        actions.assignRider(orderId, 'rider_001');
      }, 1000);
    },

    assignRider: (orderId, riderId) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.ASSIGN_RIDER, 
        payload: { orderId, riderId }
      });
      
      if (state.websocket) {
        state.websocket.emit('rider.assigned', { orderId, riderId });
      }
      
      actions.addNotification({
        type: 'rider_assigned',
        title: 'Delivery Assignment',
        message: `Order #${orderId.slice(-6)} assigned for delivery`,
        userId: riderId
      });
    },

    pickupOrder: (orderId, riderId) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.PICKUP_ORDER, 
        payload: { orderId, riderId }
      });
      
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const order = findOrderById(state, orderId);
      
      actions.generateOtp(orderId, order?.customerId, otp);
      
      if (state.websocket) {
        state.websocket.emit('order.picked_up', { orderId, riderId, otp });
      }
    },

    generateOtp: (orderId, customerId, otp) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.GENERATE_OTP, 
        payload: { orderId, customerId, otp }
      });
      
      if (state.websocket) {
        state.websocket.emit('order.otp.issued', { orderId, customerId, otp });
      }
      
      // Mock send OTP to customer
      console.log(`📱 OTP sent to customer ${customerId}: ${otp}`);
      
      actions.addNotification({
        type: 'otp_generated',
        title: 'Delivery OTP',
        message: `Your delivery OTP: ${otp}`,
        userId: customerId
      });
    },

    verifyOtp: (orderId, riderId, otp) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.VERIFY_OTP, 
        payload: { orderId, riderId, otp }
      });
      
      if (state.websocket) {
        state.websocket.emit('order.delivered', { orderId, riderId });
      }
      
      const order = findOrderById(state, orderId);
      actions.addNotification({
        type: 'order_delivered',
        title: 'Order Delivered',
        message: `Order #${orderId.slice(-6)} delivered successfully`,
        userId: order?.customerId
      });
    },

    // Notification system
    addNotification: (notification) => {
      dispatch({ 
        type: WORKFLOW_ACTIONS.ADD_NOTIFICATION, 
        payload: notification
      });
    },

    // WebSocket management
    connectWebSocket: (ws) => {
      dispatch({ type: WORKFLOW_ACTIONS.WEBSOCKET_CONNECT, payload: ws });
    },

    // Mock backend functions
    notifyStoreManager: (storeId, message) => {
      console.log(`🏪 Store Manager ${storeId} notified: ${message}`);
    },

    notifyRiderNearby: (riderId, location) => {
      console.log(`🚚 Rider ${riderId} location updated: ${location}`);
    },

    sendOtpToCustomer: (customerId, otp, method = 'SMS') => {
      console.log(`📱 ${method} sent to customer ${customerId}: ${otp}`);
    }
  };

  return (
    <OrderWorkflowContext.Provider value={{ ...state, ...actions }}>
      {children}
    </OrderWorkflowContext.Provider>
  );
};

// Hook to use order workflow context
export const useOrderWorkflow = () => {
  const context = useContext(OrderWorkflowContext);
  if (!context) {
    throw new Error('useOrderWorkflow must be used within an OrderWorkflowProvider');
  }
  return context;
};

export default OrderWorkflowContext;