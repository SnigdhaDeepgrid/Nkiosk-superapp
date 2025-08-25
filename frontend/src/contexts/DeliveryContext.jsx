import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  assignments: [],
  currentOrder: null,
  availability: true,
  earnings: {
    today: 0,
    week: 0,
    month: 0,
    completedDeliveries: []
  },
  location: {
    lat: null,
    lng: null,
    watchId: null
  },
  websocket: null,
  riderId: 'rider_001' // This would come from auth in real app
};

// Action types
const DELIVERY_ACTIONS = {
  SET_ASSIGNMENTS: 'SET_ASSIGNMENTS',
  ADD_ASSIGNMENT: 'ADD_ASSIGNMENT',
  ACCEPT_ASSIGNMENT: 'ACCEPT_ASSIGNMENT',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  SET_CURRENT_ORDER: 'SET_CURRENT_ORDER',
  COMPLETE_DELIVERY: 'COMPLETE_DELIVERY',
  TOGGLE_AVAILABILITY: 'TOGGLE_AVAILABILITY',
  UPDATE_LOCATION: 'UPDATE_LOCATION',
  SET_WEBSOCKET: 'SET_WEBSOCKET',
  UPDATE_EARNINGS: 'UPDATE_EARNINGS'
};

// Reducer function
function deliveryReducer(state, action) {
  switch (action.type) {
    case DELIVERY_ACTIONS.SET_ASSIGNMENTS:
      return {
        ...state,
        assignments: action.payload
      };

    case DELIVERY_ACTIONS.ADD_ASSIGNMENT:
      return {
        ...state,
        assignments: [...state.assignments, action.payload]
      };

    case DELIVERY_ACTIONS.ACCEPT_ASSIGNMENT:
      const acceptedAssignment = state.assignments.find(a => a.id === action.payload);
      return {
        ...state,
        assignments: state.assignments.filter(a => a.id !== action.payload),
        currentOrder: acceptedAssignment ? { ...acceptedAssignment, status: 'accepted', acceptedAt: new Date() } : state.currentOrder
      };

    case DELIVERY_ACTIONS.UPDATE_ORDER_STATUS:
      return {
        ...state,
        currentOrder: state.currentOrder ? {
          ...state.currentOrder,
          status: action.payload.status,
          updatedAt: new Date(),
          ...(action.payload.data || {})
        } : null
      };

    case DELIVERY_ACTIONS.SET_CURRENT_ORDER:
      return {
        ...state,
        currentOrder: action.payload
      };

    case DELIVERY_ACTIONS.COMPLETE_DELIVERY:
      const completedOrder = state.currentOrder;
      return {
        ...state,
        currentOrder: null,
        earnings: {
          ...state.earnings,
          today: state.earnings.today + (completedOrder?.payout || 0),
          week: state.earnings.week + (completedOrder?.payout || 0),
          month: state.earnings.month + (completedOrder?.payout || 0),
          completedDeliveries: [
            ...state.earnings.completedDeliveries,
            {
              ...completedOrder,
              completedAt: new Date(),
              earnings: completedOrder?.payout || 0
            }
          ]
        }
      };

    case DELIVERY_ACTIONS.TOGGLE_AVAILABILITY:
      return {
        ...state,
        availability: !state.availability
      };

    case DELIVERY_ACTIONS.UPDATE_LOCATION:
      return {
        ...state,
        location: {
          ...state.location,
          lat: action.payload.lat,
          lng: action.payload.lng,
          watchId: action.payload.watchId || state.location.watchId
        }
      };

    case DELIVERY_ACTIONS.SET_WEBSOCKET:
      return {
        ...state,
        websocket: action.payload
      };

    case DELIVERY_ACTIONS.UPDATE_EARNINGS:
      return {
        ...state,
        earnings: {
          ...state.earnings,
          ...action.payload
        }
      };

    default:
      return state;
  }
}

// Create context
const DeliveryContext = createContext();

// Provider component
export const DeliveryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(deliveryReducer, initialState);

  // Actions
  const actions = {
    setAssignments: (assignments) => {
      dispatch({ type: DELIVERY_ACTIONS.SET_ASSIGNMENTS, payload: assignments });
    },

    addAssignment: (assignment) => {
      dispatch({ type: DELIVERY_ACTIONS.ADD_ASSIGNMENT, payload: assignment });
    },

    acceptAssignment: (assignmentId) => {
      dispatch({ type: DELIVERY_ACTIONS.ACCEPT_ASSIGNMENT, payload: assignmentId });
    },

    markPickedUp: () => {
      dispatch({ 
        type: DELIVERY_ACTIONS.UPDATE_ORDER_STATUS, 
        payload: { status: 'en_route' }  // Changed from 'picked_up' to 'en_route'
      });
    },

    markArrived: () => {
      dispatch({ 
        type: DELIVERY_ACTIONS.UPDATE_ORDER_STATUS, 
        payload: { status: 'arrived_customer' }
      });
    },

    verifyOtp: (code) => {
      // In real app, this would verify with backend
      // For demo, we'll accept any 6-digit code that the customer might provide
      if (code.length === 6 && /^\d{6}$/.test(code)) {
        dispatch({ 
          type: DELIVERY_ACTIONS.UPDATE_ORDER_STATUS, 
          payload: { status: 'delivered' }
        });
        // Complete delivery after OTP verification
        setTimeout(() => {
          dispatch({ type: DELIVERY_ACTIONS.COMPLETE_DELIVERY });
        }, 1000);
        return true;
      }
      return false;
    },

    toggleAvailability: () => {
      dispatch({ type: DELIVERY_ACTIONS.TOGGLE_AVAILABILITY });
    },

    updateLocation: (lat, lng, watchId) => {
      dispatch({ 
        type: DELIVERY_ACTIONS.UPDATE_LOCATION, 
        payload: { lat, lng, watchId }
      });
    },

    setWebSocket: (ws) => {
      dispatch({ type: DELIVERY_ACTIONS.SET_WEBSOCKET, payload: ws });
    }
  };

  // Location tracking effect
  useEffect(() => {
    if (state.availability && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          actions.updateLocation(latitude, longitude, watchId);
          
          // Mock API call to update location (every 10s if on delivery)
          if (state.currentOrder) {
            console.log('📍 Updating rider location:', { latitude, longitude });
            // In real app: sendLocationToBackend(latitude, longitude, state.riderId);
          }
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 10000
        }
      );

      return () => {
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    }
  }, [state.availability, state.currentOrder]);

  return (
    <DeliveryContext.Provider value={{ ...state, ...actions }}>
      {children}
    </DeliveryContext.Provider>
  );
};

// Hook to use delivery context
export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

export default DeliveryContext;