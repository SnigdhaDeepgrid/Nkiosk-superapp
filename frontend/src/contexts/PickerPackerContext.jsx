import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  // Picker state
  assignedOrders: [],
  currentPickingOrder: null,
  pickingProgress: {},
  scannedItems: {},
  outOfStockReasons: {},
  
  // Packer state
  packingQueue: [],
  currentPackingOrder: null,
  packingProgress: {},
  packageTypes: {},
  generatedLabels: {},
  
  // Industry settings
  currentIndustry: 'grocery', // grocery, pharmacy, electronics, food
  
  // WebSocket
  websocket: null,
  
  // User info
  workerId: null,
  workerType: null // 'picker' or 'packer'
};

// Action types
const PICKER_PACKER_ACTIONS = {
  // Picker actions
  SET_ASSIGNED_ORDERS: 'SET_ASSIGNED_ORDERS',
  SET_CURRENT_PICKING_ORDER: 'SET_CURRENT_PICKING_ORDER',
  UPDATE_ITEM_STATUS: 'UPDATE_ITEM_STATUS',
  SCAN_ITEM: 'SCAN_ITEM',
  MARK_OUT_OF_STOCK: 'MARK_OUT_OF_STOCK',
  COMPLETE_PICKING: 'COMPLETE_PICKING',
  
  // Packer actions
  SET_PACKING_QUEUE: 'SET_PACKING_QUEUE',
  SET_CURRENT_PACKING_ORDER: 'SET_CURRENT_PACKING_ORDER',
  MARK_ITEM_PACKED: 'MARK_ITEM_PACKED',
  SET_PACKAGE_TYPE: 'SET_PACKAGE_TYPE',
  GENERATE_LABEL: 'GENERATE_LABEL',
  COMPLETE_PACKING: 'COMPLETE_PACKING',
  
  // General actions
  SET_INDUSTRY: 'SET_INDUSTRY',
  SET_WEBSOCKET: 'SET_WEBSOCKET',
  SET_WORKER: 'SET_WORKER',
  SYNC_UPDATE: 'SYNC_UPDATE'
};

// Reducer function
function pickerPackerReducer(state, action) {
  switch (action.type) {
    case PICKER_PACKER_ACTIONS.SET_ASSIGNED_ORDERS:
      return {
        ...state,
        assignedOrders: action.payload
      };

    case PICKER_PACKER_ACTIONS.SET_CURRENT_PICKING_ORDER:
      return {
        ...state,
        currentPickingOrder: action.payload,
        pickingProgress: action.payload ? {
          ...state.pickingProgress,
          [action.payload.id]: {
            totalItems: action.payload.items.length,
            pickedItems: 0,
            outOfStockItems: 0,
            startedAt: new Date()
          }
        } : state.pickingProgress
      };

    case PICKER_PACKER_ACTIONS.UPDATE_ITEM_STATUS:
      const { orderId, itemId, status, reason } = action.payload;
      return {
        ...state,
        pickingProgress: {
          ...state.pickingProgress,
          [orderId]: {
            ...state.pickingProgress[orderId],
            pickedItems: status === 'picked' 
              ? (state.pickingProgress[orderId]?.pickedItems || 0) + 1
              : state.pickingProgress[orderId]?.pickedItems || 0,
            outOfStockItems: status === 'out_of_stock'
              ? (state.pickingProgress[orderId]?.outOfStockItems || 0) + 1
              : state.pickingProgress[orderId]?.outOfStockItems || 0
          }
        },
        outOfStockReasons: status === 'out_of_stock' ? {
          ...state.outOfStockReasons,
          [`${orderId}_${itemId}`]: reason
        } : state.outOfStockReasons
      };

    case PICKER_PACKER_ACTIONS.SCAN_ITEM:
      return {
        ...state,
        scannedItems: {
          ...state.scannedItems,
          [`${action.payload.orderId}_${action.payload.itemId}`]: {
            scannedAt: new Date(),
            scannedCode: action.payload.code,
            verified: action.payload.verified
          }
        }
      };

    case PICKER_PACKER_ACTIONS.COMPLETE_PICKING:
      const completedOrder = state.currentPickingOrder;
      return {
        ...state,
        currentPickingOrder: null,
        assignedOrders: state.assignedOrders.filter(order => order.id !== action.payload),
        packingQueue: completedOrder ? [...state.packingQueue, {
          ...completedOrder,
          status: 'ready_for_packing',
          completedPickingAt: new Date(),
          pickingProgress: state.pickingProgress[action.payload]
        }] : state.packingQueue
      };

    case PICKER_PACKER_ACTIONS.SET_PACKING_QUEUE:
      return {
        ...state,
        packingQueue: action.payload
      };

    case PICKER_PACKER_ACTIONS.SET_CURRENT_PACKING_ORDER:
      return {
        ...state,
        currentPackingOrder: action.payload,
        packingProgress: action.payload ? {
          ...state.packingProgress,
          [action.payload.id]: {
            totalItems: action.payload.items.filter(item => 
              !state.outOfStockReasons[`${action.payload.id}_${item.id}`]
            ).length,
            packedItems: 0,
            startedAt: new Date()
          }
        } : state.packingProgress
      };

    case PICKER_PACKER_ACTIONS.MARK_ITEM_PACKED:
      const { orderId: packOrderId, itemId: packItemId, packageType } = action.payload;
      return {
        ...state,
        packingProgress: {
          ...state.packingProgress,
          [packOrderId]: {
            ...state.packingProgress[packOrderId],
            packedItems: (state.packingProgress[packOrderId]?.packedItems || 0) + 1
          }
        },
        packageTypes: {
          ...state.packageTypes,
          [`${packOrderId}_${packItemId}`]: packageType
        }
      };

    case PICKER_PACKER_ACTIONS.GENERATE_LABEL:
      return {
        ...state,
        generatedLabels: {
          ...state.generatedLabels,
          [action.payload.orderId]: {
            labelId: action.payload.labelId,
            qrCode: action.payload.qrCode,
            generatedAt: new Date()
          }
        }
      };

    case PICKER_PACKER_ACTIONS.COMPLETE_PACKING:
      return {
        ...state,
        currentPackingOrder: null,
        packingQueue: state.packingQueue.filter(order => order.id !== action.payload)
      };

    case PICKER_PACKER_ACTIONS.SET_INDUSTRY:
      return {
        ...state,
        currentIndustry: action.payload
      };

    case PICKER_PACKER_ACTIONS.SET_WEBSOCKET:
      return {
        ...state,
        websocket: action.payload
      };

    case PICKER_PACKER_ACTIONS.SET_WORKER:
      return {
        ...state,
        workerId: action.payload.workerId,
        workerType: action.payload.workerType
      };

    case PICKER_PACKER_ACTIONS.SYNC_UPDATE:
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

// Create context
const PickerPackerContext = createContext();

// Provider component
export const PickerPackerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(pickerPackerReducer, initialState);

  // Actions
  const actions = {
    // Picker actions
    setAssignedOrders: (orders) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.SET_ASSIGNED_ORDERS, payload: orders });
    },

    startPickingOrder: (order) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.SET_CURRENT_PICKING_ORDER, payload: order });
    },

    scanItem: (orderId, itemId, code) => {
      // Mock barcode verification - in real app would check against product database
      const verified = Math.random() > 0.1; // 90% success rate
      dispatch({ 
        type: PICKER_PACKER_ACTIONS.SCAN_ITEM, 
        payload: { orderId, itemId, code, verified }
      });
      
      if (verified) {
        actions.updateItemStatus(orderId, itemId, 'picked');
      }
      
      return verified;
    },

    updateItemStatus: (orderId, itemId, status, reason = null) => {
      dispatch({ 
        type: PICKER_PACKER_ACTIONS.UPDATE_ITEM_STATUS, 
        payload: { orderId, itemId, status, reason }
      });
      
      // Emit real-time update
      if (state.websocket) {
        state.websocket.emit('item_status_update', {
          orderId, itemId, status, reason, 
          workerId: state.workerId,
          timestamp: new Date()
        });
      }
    },

    markOutOfStock: (orderId, itemId, reason) => {
      actions.updateItemStatus(orderId, itemId, 'out_of_stock', reason);
    },

    completePicking: (orderId) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.COMPLETE_PICKING, payload: orderId });
      
      // Notify packer via WebSocket
      if (state.websocket) {
        state.websocket.emit('order_ready_for_packing', {
          orderId, workerId: state.workerId, timestamp: new Date()
        });
      }
    },

    // Packer actions
    setPpackingQueue: (orders) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.SET_PACKING_QUEUE, payload: orders });
    },

    startPackingOrder: (order) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.SET_CURRENT_PACKING_ORDER, payload: order });
    },

    markItemPacked: (orderId, itemId, packageType) => {
      dispatch({ 
        type: PICKER_PACKER_ACTIONS.MARK_ITEM_PACKED, 
        payload: { orderId, itemId, packageType }
      });
    },

    generateLabel: (orderId) => {
      const labelId = `LBL_${orderId}_${Date.now()}`;
      const qrCode = `QR_${labelId}`;
      
      dispatch({ 
        type: PICKER_PACKER_ACTIONS.GENERATE_LABEL, 
        payload: { orderId, labelId, qrCode }
      });
      
      // Notify delivery system
      if (state.websocket) {
        state.websocket.emit('label_generated', {
          orderId, labelId, qrCode, 
          workerId: state.workerId,
          timestamp: new Date()
        });
      }
      
      return { labelId, qrCode };
    },

    completePacking: (orderId) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.COMPLETE_PACKING, payload: orderId });
      
      // Notify delivery partners
      if (state.websocket) {
        state.websocket.emit('order_ready_for_delivery', {
          orderId, workerId: state.workerId, timestamp: new Date()
        });
      }
    },

    // General actions
    setIndustry: (industry) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.SET_INDUSTRY, payload: industry });
    },

    setWorker: (workerId, workerType) => {
      dispatch({ 
        type: PICKER_PACKER_ACTIONS.SET_WORKER, 
        payload: { workerId, workerType }
      });
    },

    setWebSocket: (ws) => {
      dispatch({ type: PICKER_PACKER_ACTIONS.SET_WEBSOCKET, payload: ws });
    }
  };

  return (
    <PickerPackerContext.Provider value={{ ...state, ...actions }}>
      {children}
    </PickerPackerContext.Provider>
  );
};

// Hook to use picker packer context
export const usePickerPacker = () => {
  const context = useContext(PickerPackerContext);
  if (!context) {
    throw new Error('usePickerPacker must be used within a PickerPackerProvider');
  }
  return context;
};

export default PickerPackerContext;