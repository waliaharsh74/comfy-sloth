import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useHistory } from 'react-router-dom';
import { useProductsContext } from '../context/products_context';
import { single_product_url as url } from '../utils/constants';
import { formatPrice } from '../utils/helpers';
import {
  Loading,
  Error,
  ProductImages,
  AddToCart,
  Stars,
  PageHero,
} from '../components';
import type { Product } from '../reducers/products_reducer';

const SingleProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const {
    single_product_loading: loading,
    single_product_error: error,
    single_product: product,
    fetchSingleProduct,
  } = useProductsContext();

  useEffect(() => {
    fetchSingleProduct(`${url}${id}`);
  }, [fetchSingleProduct, id]);

  useEffect(() => {
    if (error) {
      setTimeout(() => history.push('/'), 3000);
    }
  }, [error, history]);

  if (loading) return <Loading />;
  if (error) return <Error />;

  const {
    name,
    price,
    description,
    stock,
    stars,
    reviews,
    id: sku,
    company,
    images,
  } = product as Product;

  return (
    <Wrapper>
      <PageHero title={name} product />
      <div className="section section-center page">
        <LinkButton to="/products">Back to Products</LinkButton>
        <div className="product-center">
          <ProductImages images={images} />
          <section className="content">
            <h2>{name}</h2>
            <Stars stars={stars} reviews={reviews} />
            <h5 className="price">{formatPrice(price)}</h5>
            <p className="desc">{description}</p>
            <InfoRow><span>Available :</span>{stock > 0 ? 'In Stock' : 'Out of Stock'}</InfoRow>
            <InfoRow><span>SKU :</span>{sku}</InfoRow>
            <InfoRow><span>Brand :</span>{company}</InfoRow>
            <hr />
            {stock > 0 && <AddToCart product={product} />}
          </section>
        </div>
      </div>
    </Wrapper>
  );
};

const LinkButton = styled.a`  
  display: inline-block;
  background: var(--clr-grey-10);
  color: var(--clr-grey-3);
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  text-transform: capitalize;
  margin-bottom: 2rem;
  cursor: pointer;
`;

const InfoRow = styled.p`
  text-transform: capitalize;
  width: 300px;
  display: grid;
  grid-template-columns: 125px 1fr;
  span { font-weight: 700; }
`;

const Wrapper = styled.main`
  .product-center { display: grid; gap: 4rem; margin-top: 2rem; }
  .price { color: var(--clr-primary-5); }
  .desc { line-height: 2; max-width: 45em; }

  @media (min-width: 992px) {
    .product-center { grid-template-columns: 1fr 1fr; align-items: center; }
    .price { font-size: 1.25rem; }
  }
`;

export default SingleProductPage;