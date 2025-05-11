import React, { useEffect, useReducer, useContext } from 'react';
import reducer from '../reducers/filter_reducer';
import type{ FilterState, Filters, Product as FilterProduct } from '../reducers/filter_reducer';
import {
  LOAD_PRODUCTS,
  SET_GRIDVIEW,
  SET_LISTVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  FILTER_PRODUCTS,
  UPDATE_FILTERS,
  CLEAR_FILTERS,
} from '../actions';
import { useProductsContext } from './products_context';

export interface FilterContextType extends FilterState {
  setGridView: () => void;
  setListView: () => void;
  updateSort: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  updateFilters: (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => void;
  clearFilters: () => void;
}

const initialState: FilterState = {
  filtered_products: [],
  all_products: [],
  grid_view: true,
  sort: 'price-lowest',
  filters: {
    text: '',
    company: 'all',
    category: 'all',
    color: 'all',
    min_price: 0,
    max_price: 0,
    price: 0,
    shipping: false,
  },
};

const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products: rawProducts } = useProductsContext();
  const products = rawProducts as unknown as FilterProduct[];
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: LOAD_PRODUCTS, payload: products });
  }, [products]);

  useEffect(() => {
    dispatch({ type: FILTER_PRODUCTS });
    dispatch({ type: SORT_PRODUCTS });
  }, [state.sort, state.filters]);

  const setGridView = () => dispatch({ type: SET_GRIDVIEW });
  const setListView = () => dispatch({ type: SET_LISTVIEW });
  const updateSort = (e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: UPDATE_SORT, payload: e.target.value });
  const updateFilters = (e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
    const target = e.target as HTMLInputElement;
    const name = target.name as keyof Filters;
    let value: string | number | boolean = target.value;
    if (target.type === 'checkbox') value = target.checked;
    if (name === 'category' && 'textContent' in target) value = target.textContent || 'all';
    if (name === 'color' && 'dataset' in target) value = target.dataset.color || 'all';
    if (name === 'price') value = Number(value);
    dispatch({ type: UPDATE_FILTERS, payload: { name, value } });
  };
  const clearFilters = () => dispatch({ type: CLEAR_FILTERS });

  return (
    <FilterContext.Provider value={{ ...state, setGridView, setListView, updateSort, updateFilters, clearFilters }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilterContext must be used within a FilterProvider');
  return context;
};
