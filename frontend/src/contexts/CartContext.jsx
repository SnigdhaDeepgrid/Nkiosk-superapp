import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Cart Context
const CartContext = createContext();

// Cart Action Types
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Initial state
const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return action.payload;

    case CART_ACTIONS.ADD_ITEM: {
      const { item } = action.payload;
      const existingItemIndex = state.items.findIndex(cartItem => cartItem.id === item.id);
      
      let updatedItems;
      if (existingItemIndex >= 0) {
        // Item exists, increment quantity
        updatedItems = state.items.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        // New item, add to cart
        updatedItems = [...state.items, { ...item, quantity: 1 }];
      }
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const { itemId } = action.payload;
      const updatedItems = state.items.filter(item => item.id !== itemId);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return cartReducer(state, { 
          type: CART_ACTIONS.REMOVE_ITEM, 
          payload: { itemId } 
        });
      }
      
      const updatedItems = state.items.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      return {
        items: updatedItems,
        totalItems,
        totalPrice
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return initialState;

    default:
      return state;
  }
};

// Cart Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('nkiosk_cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: CART_ACTIONS.LOAD_CART, payload: cartData });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('nkiosk_cart', JSON.stringify(state));
  }, [state]);

  // Cart actions
  const addItem = (item) => {
    dispatch({ 
      type: CART_ACTIONS.ADD_ITEM, 
      payload: { item } 
    });
  };

  const removeItem = (itemId) => {
    dispatch({ 
      type: CART_ACTIONS.REMOVE_ITEM, 
      payload: { itemId } 
    });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ 
      type: CART_ACTIONS.UPDATE_QUANTITY, 
      payload: { itemId, quantity } 
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Clear cart when user logs out
  const clearCartOnLogout = () => {
    localStorage.removeItem('nkiosk_cart');
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const value = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    clearCartOnLogout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;