import React from 'react';
import { useFilterContext } from '../context/filter_context';
import GridView from './GridView';
import ListView from './ListView';

const ProductList: React.FC = () => {
  const { filtered_products: products, grid_view } = useFilterContext();
  const items = products as any[];

  if (items.length < 1) {
    return <h5 style={{ textTransform: 'none' }}>Sorry, no products matched your search.</h5>;
  }

  if (!grid_view) {
    return <ListView products={items} />;
  }

  return <GridView products={items} />;
};

export default ProductList;