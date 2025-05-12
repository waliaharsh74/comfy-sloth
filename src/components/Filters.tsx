import React from 'react';
import styled from 'styled-components';
import { FaCheck } from 'react-icons/fa';
import { useFilterContext } from '../context/filter_context';
import { getUniqueValues, formatPrice } from '../utils/helpers';

const Filters: React.FC = () => {
  const {
    filters: { text, category, company, color, min_price, price, max_price, shipping },
    updateFilters,
    all_products,
    clearFilters,
  } = useFilterContext();

  const categories = getUniqueValues(all_products, 'category') as string[];
  const companies = getUniqueValues(all_products, 'company') as string[];
  const colors = getUniqueValues(all_products, 'colors') as string[];

  return (
    <Wrapper>
      <div className="content">
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-control">
            <input
              type="text"
              name="text"
              value={text}
              placeholder="search"
              onChange={updateFilters}
              className="search-input"
            />
          </div>
          <div className="form-control">
            <h5>category</h5>
            <div>
              {categories.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  name="category"
                  className={category === c.toLowerCase() ? 'active' : ''}
                  onClick={updateFilters}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="form-control">
            <h5>company</h5>
            <select
              name="company"
              value={company}
              onChange={(e) => updateFilters(e as unknown as React.ChangeEvent<HTMLInputElement>)}

              className="company"
            >
              {companies.map((c, idx) => (
                <option key={idx} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <h5>colors</h5>
            <div className="colors">
              {colors.map((c, idx) =>
                c === 'all' ? (
                  <button
                    key={idx}
                    type="button"
                    name="color"
                    data-color="all"
                    className={color === 'all' ? 'all-btn active' : 'all-btn'}
                    onClick={updateFilters}
                  >
                    all
                  </button>
                ) : (
                  <button
                    key={idx}
                    type="button"
                    name="color"
                    data-color={c}
                    style={{ background: c }}
                    className={color === c ? 'color-btn active' : 'color-btn'}
                    onClick={updateFilters}
                  >
                    {color === c && <FaCheck />}
                  </button>
                )
              )}
            </div>
          </div>
          <div className="form-control">
            <h5>price</h5>
            <p className="price">{formatPrice(price)}</p>
            <input
              type="range"
              name="price"
              onChange={updateFilters}
              min={min_price}
              max={max_price}
              value={price}
            />
          </div>
          <div className="form-control shipping">
            <label htmlFor="shipping">free shipping</label>
            <input
              type="checkbox"
              name="shipping"
              id="shipping"
              checked={shipping}
              onChange={updateFilters}
            />
          </div>
        </form>
        <button type="button" className="clear-btn" onClick={clearFilters}>
          clear filters
        </button>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`
  .form-control {
    margin-bottom: 1.25rem;
    h5 { margin-bottom: 0.5rem; }
  }
  .search-input {
    padding: 0.5rem;
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    letter-spacing: var(--spacing);
  }
  .search-input::placeholder { text-transform: capitalize; }
  button {
    display: block;
    margin: 0.25em 0;
    padding: 0.25rem 0;
    text-transform: capitalize;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
  .active { border-color: var(--clr-grey-5); opacity: 1; }
  .company {
    background: var(--clr-grey-10);
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem;
  }
  .colors { display: flex; align-items: center; }
  .color-btn, .all-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.5rem;
    opacity: 0.5;
    background: transparent;
    border: none;
    cursor: pointer;
    text-transform: capitalize;
  }
  .color-btn { width: 1rem; height: 1rem; border-radius: 50%; }
  .price { margin-bottom: 0.25rem; }
  .shipping {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    column-gap: 0.5rem;
    font-size: 1rem;
    text-transform: capitalize;
  }
  .clear-btn {
    background: var(--clr-red-dark);
    color: var(--clr-white);
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
  }
  @media (min-width: 768px) {
    .content { position: sticky; top: 1rem; }
  }
`;

export default Filters;