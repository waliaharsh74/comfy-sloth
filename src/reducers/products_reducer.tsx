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

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  featured: boolean;
}

export interface ProductsState {
  isSidebarOpen: boolean;
  products_loading: boolean;
  products_error: boolean;
  products: Product[];
  featured_products: Product[];
  single_product_loading: boolean;
  single_product_error: boolean;
  single_product: Product;
}

interface SidebarOpenAction {
  type: typeof SIDEBAR_OPEN;
}

interface SidebarCloseAction {
  type: typeof SIDEBAR_CLOSE;
}

interface GetProductsBeginAction {
  type: typeof GET_PRODUCTS_BEGIN;
}

interface GetProductsSuccessAction {
  type: typeof GET_PRODUCTS_SUCCESS;
  payload: Product[];
}

interface GetProductsErrorAction {
  type: typeof GET_PRODUCTS_ERROR;
}

interface GetSingleProductBeginAction {
  type: typeof GET_SINGLE_PRODUCT_BEGIN;
}

interface GetSingleProductSuccessAction {
  type: typeof GET_SINGLE_PRODUCT_SUCCESS;
  payload: Product;
}

interface GetSingleProductErrorAction {
  type: typeof GET_SINGLE_PRODUCT_ERROR;
}

type ProductsAction =
  | SidebarOpenAction
  | SidebarCloseAction
  | GetProductsBeginAction
  | GetProductsSuccessAction
  | GetProductsErrorAction
  | GetSingleProductBeginAction
  | GetSingleProductSuccessAction
  | GetSingleProductErrorAction;

export const products_reducer = (
  state: ProductsState,
  action: ProductsAction
): ProductsState => {
  if (action.type === SIDEBAR_OPEN) {
    return { ...state, isSidebarOpen: true };
  }
  if (action.type === SIDEBAR_CLOSE) {
    return { ...state, isSidebarOpen: false };
  }
  if (action.type === GET_PRODUCTS_BEGIN) {
    return { ...state, products_loading: true };
  }
  if (action.type === GET_PRODUCTS_SUCCESS) {
    const featured_products = action.payload.filter(
      (product) => product.featured === true
    );
    return {
      ...state,
      products_loading: false,
      products: action.payload,
      featured_products,
    };
  }
  if (action.type === GET_PRODUCTS_ERROR) {
    return { ...state, products_loading: false, products_error: true };
  }
  if (action.type === GET_SINGLE_PRODUCT_BEGIN) {
    return {
      ...state,
      single_product_loading: true,
      single_product_error: false,
    };
  }
  if (action.type === GET_SINGLE_PRODUCT_SUCCESS) {
    return {
      ...state,
      single_product_loading: false,
      single_product: action.payload,
    };
  }
  if (action.type === GET_SINGLE_PRODUCT_ERROR) {
    return {
      ...state,
      single_product_loading: false,
      single_product_error: true,
    };
  }
  throw new Error(`No Matching "${action}" - action type`);
};

export default products_reducer;