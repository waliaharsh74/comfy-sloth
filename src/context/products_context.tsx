import React, { useEffect, useReducer, useContext } from 'react';
import reducer from '../reducers/products_reducer';
import type { ProductsState, Product } from '../reducers/products_reducer';
import { products_url as url } from '../utils/constants';
import {
  SIDEBAR_OPEN,
  SIDEBAR_CLOSE,
  GET_PRODUCTS_BEGIN,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCTS_ERROR,
  GET_SINGLE_PRODUCT_BEGIN,
  GET_SINGLE_PRODUCT_SUCCESS,
  GET_SINGLE_PRODUCT_ERROR,
} from '../actions';

interface ProductsContextType extends ProductsState {
  openSidebar: () => void;
  closeSidebar: () => void;
  fetchSingleProduct: (url: string) => Promise<void>;
}

const initialState: ProductsState = {
  isSidebarOpen: false,
  products_loading: false,
  products_error: false,
  products: [],
  featured_products: [],
  single_product_loading: false,
  single_product_error: false,
  single_product: { id: '', name: '', price: 0, image: '', featured: false },
};

const ProductsContext = React.createContext<ProductsContextType | undefined>(undefined);

export const ProductsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openSidebar = () => dispatch({ type: SIDEBAR_OPEN });
  const closeSidebar = () => dispatch({ type: SIDEBAR_CLOSE });

  const fetchProducts = async (url: string) => {
    dispatch({ type: GET_PRODUCTS_BEGIN });
    try {
      const response = await fetch(url);
      const data: Product[] = await response.json();
      dispatch({ type: GET_PRODUCTS_SUCCESS, payload: data });
    } catch {
      dispatch({ type: GET_PRODUCTS_ERROR });
    }
  };

  const fetchSingleProduct = async (url: string) => {
    dispatch({ type: GET_SINGLE_PRODUCT_BEGIN });
    try {
      const response = await fetch(url);
      const data: Product = await response.json();
      dispatch({ type: GET_SINGLE_PRODUCT_SUCCESS, payload: data });
    } catch {
      dispatch({ type: GET_SINGLE_PRODUCT_ERROR });
    }
  };

  useEffect(() => {
    fetchProducts(url);
  }, []);

  return (
    <ProductsContext.Provider value={{ ...state, openSidebar, closeSidebar, fetchSingleProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProductsContext = (): ProductsContextType => {
  const context = useContext(ProductsContext);
  if (!context) throw new Error('useProductsContext must be used within ProductsProvider');
  return context;
};