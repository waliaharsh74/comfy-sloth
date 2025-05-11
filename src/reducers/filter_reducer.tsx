import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions';

export interface Product {
  name: string;
  price: number;
  category: string;
  company: string;
  colors: string[];
  shipping: boolean;
}

export interface Filters {
  text: string;
  company: string;
  category: string;
  color: string;
  min_price: number;
  max_price: number;
  price: number;
  shipping: boolean;
}

export interface FilterState {
  filtered_products: Product[];
  all_products: Product[];
  grid_view: boolean;
  sort: string;
  filters: Filters;
}

interface LoadProductsAction {
  type: typeof LOAD_PRODUCTS;
  payload: Product[];
}

interface SetGridViewAction {
  type: typeof SET_GRIDVIEW;
}

interface SetListViewAction {
  type: typeof SET_LISTVIEW;
}

interface UpdateSortAction {
  type: typeof UPDATE_SORT;
  payload: string;
}

interface SortProductsAction {
  type: typeof SORT_PRODUCTS;
}

interface UpdateFiltersAction {
  type: typeof UPDATE_FILTERS;
  payload: {
    name: keyof Filters;
    value: string | number | boolean;
  };
}

interface FilterProductsAction {
  type: typeof FILTER_PRODUCTS;
}

interface ClearFiltersAction {
  type: typeof CLEAR_FILTERS;
}

type FilterAction =
  | LoadProductsAction
  | SetGridViewAction
  | SetListViewAction
  | UpdateSortAction
  | SortProductsAction
  | UpdateFiltersAction
  | FilterProductsAction
  | ClearFiltersAction;

export const filter_reducer = (
  state: FilterState,
  action: FilterAction
): FilterState => {
  if (action.type === LOAD_PRODUCTS) {
    const prices = action.payload.map((p) => p.price);
    const maxPrice = Math.max(...prices, 0);
    return {
      ...state,
      all_products: [...action.payload],
      filtered_products: [...action.payload],
      filters: { ...state.filters, max_price: maxPrice, price: maxPrice },
    };
  }
  if (action.type === SET_GRIDVIEW) {
    return { ...state, grid_view: true };
  }
  if (action.type === SET_LISTVIEW) {
    return { ...state, grid_view: false };
  }
  if (action.type === UPDATE_SORT) {
    return { ...state, sort: action.payload };
  }
  if (action.type === SORT_PRODUCTS) {
    const { sort, filtered_products } = state;
    let tempProducts = [...filtered_products];
    if (sort === 'price-lowest') {
      tempProducts.sort((a, b) => a.price - b.price);
    }
    if (sort === 'price-highest') {
      tempProducts.sort((a, b) => b.price - a.price);
    }
    if (sort === 'name-a') {
      tempProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sort === 'name-z') {
      tempProducts.sort((a, b) => b.name.localeCompare(a.name));
    }
    return { ...state, filtered_products: tempProducts };
  }
  if (action.type === UPDATE_FILTERS) {
    const { name, value } = action.payload;
    return { ...state, filters: { ...state.filters, [name]: value } };
  }
  if (action.type === FILTER_PRODUCTS) {
    const { all_products } = state;
    const { text, category, company, color, price, shipping } = state.filters;
    let tempProducts = [...all_products];
    if (text) {
      tempProducts = tempProducts.filter((product) =>
        product.name.toLowerCase().startsWith(text)
      );
    }
    if (category !== 'all') {
      tempProducts = tempProducts.filter(
        (product) => product.category === category
      );
    }
    if (company !== 'all') {
      tempProducts = tempProducts.filter(
        (product) => product.company === company
      );
    }
    if (color !== 'all') {
      tempProducts = tempProducts.filter((product) =>
        product.colors.includes(color)
      );
    }
    tempProducts = tempProducts.filter((product) => product.price <= price);
    if (shipping) {
      tempProducts = tempProducts.filter((product) => product.shipping);
    }
    return { ...state, filtered_products: tempProducts };
  }
  if (action.type === CLEAR_FILTERS) {
    return {
      ...state,
      filters: {
        ...state.filters,
        text: '',
        company: 'all',
        category: 'all',
        color: 'all',
        price: state.filters.max_price,
        shipping: false,
      },
    };
  }
  throw new Error(`No Matching "${action}" - action type`);
};

export default filter_reducer;
