/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useReducer, useEffect } from "react";

// Cart Actions
const CART_ACTIONS = {
  LOAD_CART: "LOAD_CART",
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QUANTITY: "UPDATE_QUANTITY",
  CLEAR_CART: "CLEAR_CART",
  TOGGLE_DRAWER: "TOGGLE_DRAWER",
  OPEN_DRAWER: "OPEN_DRAWER",
  CLOSE_DRAWER: "CLOSE_DRAWER",
};

// Initial state
const initialState = {
  items: [],
  isOpen: false,
};

// Helper functions
const createCartItem = (
  product,
  selectedSize,
  selectedColor,
  quantity = 1
) => ({
  id: `${product.id}-${selectedSize}-${selectedColor}`,
  productId: product.id,
  name: product.name,
  price: product.price,
  originalPrice: product.originalPrice,
  images: product.images,
  selectedSize,
  selectedColor,
  quantity,
  addedAt: Date.now(),
});

const findItemIndex = (items, productId, selectedSize, selectedColor) => {
  return items.findIndex(
    (item) =>
      item.productId === productId &&
      item.selectedSize === selectedSize &&
      item.selectedColor === selectedColor
  );
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.LOAD_CART:
      return {
        ...state,
        items: action.payload || [],
      };

    case CART_ACTIONS.ADD_ITEM: {
      const { product, selectedSize, selectedColor, quantity } = action.payload;
      const existingIndex = findItemIndex(
        state.items,
        product.id,
        selectedSize,
        selectedColor
      );

      if (existingIndex >= 0) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + quantity,
        };
        return { ...state, items: updatedItems };
      } else {
        // Add new item
        const newItem = createCartItem(
          product,
          selectedSize,
          selectedColor,
          quantity
        );
        return { ...state, items: [...state.items, newItem] };
      }
    }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
      };

    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemId, quantity } = action.payload;

      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== itemId),
        };
      }

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        ),
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
      };

    case CART_ACTIONS.TOGGLE_DRAWER:
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case CART_ACTIONS.OPEN_DRAWER:
      return {
        ...state,
        isOpen: true,
      };

    case CART_ACTIONS.CLOSE_DRAWER:
      return {
        ...state,
        isOpen: false,
      };

    default:
      return state;
  }
};

// Create context
export const CartContext = createContext(undefined);

// Storage helpers
const STORAGE_KEY = "duppshop-cart";

const saveToStorage = (items) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.warn("Failed to save cart to localStorage:", error);
  }
};

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.warn("Failed to load cart from localStorage:", error);
    return [];
  }
};

// Cart Provider
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from storage on mount
  useEffect(() => {
    const savedItems = loadFromStorage();
    dispatch({ type: CART_ACTIONS.LOAD_CART, payload: savedItems });
  }, []);

  // Save to storage when items change
  useEffect(() => {
    saveToStorage(state.items);
  }, [state.items]);

  // Actions
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, selectedSize, selectedColor, quantity },
    });
  };

  const removeFromCart = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { itemId, quantity },
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const toggleCart = () => {
    dispatch({ type: CART_ACTIONS.TOGGLE_DRAWER });
  };

  const openCart = () => {
    dispatch({ type: CART_ACTIONS.OPEN_DRAWER });
  };

  const closeCart = () => {
    dispatch({ type: CART_ACTIONS.CLOSE_DRAWER });
  };

  // Computed values
  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const getSubtotal = () => getTotalPrice();

  const getShipping = (threshold = 50) => {
    return getTotalPrice() >= threshold ? 0 : 9.99;
  };

  const getTax = (rate = 0.08) => {
    return getTotalPrice() * rate;
  };

  const getTotal = (shippingThreshold = 50, taxRate = 0.08) => {
    const subtotal = getSubtotal();
    const shipping = getShipping(shippingThreshold);
    const tax = getTax(taxRate);
    return subtotal + shipping + tax;
  };

  const getItemQuantity = (productId, selectedSize, selectedColor) => {
    const item = state.items.find(
      (item) =>
        item.productId === productId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor
    );
    return item ? item.quantity : 0;
  };

  const isInCart = (productId, selectedSize, selectedColor) => {
    return getItemQuantity(productId, selectedSize, selectedColor) > 0;
  };

  const value = {
    // State
    items: state.items,
    isOpen: state.isOpen,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,

    // Computed values
    getTotalItems,
    getTotalPrice,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    getItemQuantity,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
