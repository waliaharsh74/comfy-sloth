import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
  CLEAR_CART,
  COUNT_CART_TOTALS,
} from '../actions';

export interface ProductPayload {
  name: string;
  images: { url: string }[];
  price: number;
  stock: number;
}

export interface CartItem {
  id: string;
  name: string;
  color: string;
  amount: number;
  image: string;
  price: number;
  max: number;
}

export interface CartState {
  cart: CartItem[];
  total_items: number;
  total_amount: number;
  shipping_fee: number;
}

interface AddToCartAction {
  type: typeof ADD_TO_CART;
  payload: {
    id: string;
    color: string;
    amount: number;
    product: ProductPayload;
  };
}

interface RemoveCartItemAction {
  type: typeof REMOVE_CART_ITEM;
  payload: string;
}

interface ToggleCartItemAmountAction {
  type: typeof TOGGLE_CART_ITEM_AMOUNT;
  payload: {
    id: string;
    value: 'inc' | 'dec';
  };
}

interface ClearCartAction {
  type: typeof CLEAR_CART;
}

interface CountCartTotalsAction {
  type: typeof COUNT_CART_TOTALS;
}

type CartAction =
  | AddToCartAction
  | RemoveCartItemAction
  | ToggleCartItemAmountAction
  | ClearCartAction
  | CountCartTotalsAction;

export const cart_reducer = (
  state: CartState,
  action: CartAction
): CartState => {
  if (action.type === ADD_TO_CART) {
    const { id, color, amount, product } = action.payload;
    const tempItem = state.cart.find((i) => i.id === id + color);
    if (tempItem) {
      const tempCart = state.cart.map((cartItem) => {
        if (cartItem.id === id + color) {
          let newAmount = cartItem.amount + amount;
          if (newAmount > cartItem.max) {
            newAmount = cartItem.max;
          }
          return { ...cartItem, amount: newAmount };
        }
        return cartItem;
      });
      return { ...state, cart: tempCart };
    }
    const newItem: CartItem = {
      id: id + color,
      name: product.name,
      color,
      amount,
      image: product.images[0].url,
      price: product.price,
      max: product.stock,
    };
    return { ...state, cart: [...state.cart, newItem] };
  }
  if (action.type === REMOVE_CART_ITEM) {
    const tempCart = state.cart.filter((item) => item.id !== action.payload);
    return { ...state, cart: tempCart };
  }
  if (action.type === TOGGLE_CART_ITEM_AMOUNT) {
    const { id, value } = action.payload;
    const tempCart = state.cart.map((item) => {
      if (item.id === id) {
        if (value === 'inc') {
          let newAmount = item.amount + 1;
          if (newAmount > item.max) {
            newAmount = item.max;
          }
          return { ...item, amount: newAmount };
        }
        if (value === 'dec') {
          let newAmount = item.amount - 1;
          if (newAmount < 1) {
            newAmount = 1;
          }
          return { ...item, amount: newAmount };
        }
      }
      return item;
    });
    return { ...state, cart: tempCart };
  }
  if (action.type === CLEAR_CART) {
    return { ...state, cart: [] };
  }
  if (action.type === COUNT_CART_TOTALS) {
    const { total_items, total_amount } = state.cart.reduce(
      (totals, cartItem) => {
        totals.total_items += cartItem.amount;
        totals.total_amount += cartItem.price * cartItem.amount;
        return totals;
      },
      { total_items: 0, total_amount: 0 }
    );
    return { ...state, total_items, total_amount };
  }
  throw new Error(`No Matching "${action}" - action type`);
};

export default cart_reducer;