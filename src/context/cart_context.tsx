import React, { useEffect, useReducer, useContext } from 'react';
import cart_reducer from '../reducers/cart_reducer';
import type { CartState, CartItem as ReducerCartItem, ProductPayload } from '../reducers/cart_reducer';
import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
  CLEAR_CART,
  COUNT_CART_TOTALS,
} from '../actions';

interface CartContextType extends CartState {
  addToCart: (id: string, color: string, amount: number, product: ProductPayload) => void;
  removeItem: (id: string) => void;
  toggleAmount: (id: string, value: 'inc' | 'dec') => void;
  clearCart: () => void;
}

const CartContext = React.createContext<CartContextType | undefined>(undefined);

const getLocalStorageCart = (): ReducerCartItem[] => {
  const stored = localStorage.getItem('cart');
  return stored ? (JSON.parse(stored) as ReducerCartItem[]) : [];
};

const initialState: CartState = {
  cart: getLocalStorageCart(),
  total_items: 0,
  total_amount: 0,
  shipping_fee: 10000,
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cart_reducer, initialState);

  const addToCart = (id: string, color: string, amount: number, product: ProductPayload) => {
    dispatch({ type: ADD_TO_CART, payload: { id, color, amount, product } });
  };

  const removeItem = (id: string) => {
    dispatch({ type: REMOVE_CART_ITEM, payload: id });
  };

  const toggleAmount = (id: string, value: 'inc' | 'dec') => {
    dispatch({ type: TOGGLE_CART_ITEM_AMOUNT, payload: { id, value } });
  };

  const clearCart = () => {
    dispatch({ type: CLEAR_CART });
  };

  useEffect(() => {
    dispatch({ type: COUNT_CART_TOTALS });
    localStorage.setItem('cart', JSON.stringify(state.cart));
  }, [state.cart]);

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, removeItem, toggleAmount, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCartContext must be used within a CartProvider');
  return context;
};