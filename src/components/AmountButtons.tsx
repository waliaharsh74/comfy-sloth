import React from 'react';
import styled from 'styled-components';
import { FaPlus, FaMinus } from 'react-icons/fa';

interface AmountButtonsProps {
  increase: () => void;
  decrease: () => void;
  amount: number;
}

const AmountButtons: React.FC<AmountButtonsProps> = ({ increase, decrease, amount }) => (
  <Wrapper className="btns">
    <button type="button" className="amount-btn" onClick={decrease}>
      <FaMinus />
    </button>
    <h2 className="amount">{amount}</h2>
    <button type="button" className="amount-btn" onClick={increase}>
      <FaPlus />
    </button>
  </Wrapper>
);

const Wrapper = styled.div`
  display: grid;
  width: 140px;
  justify-items: center;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
  h2 {
    margin-bottom: 0;
  }
  button {
    background: transparent;
    border-color: transparent;
    cursor: pointer;
    padding: 1rem 0;
    width: 2rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default AmountButtons;