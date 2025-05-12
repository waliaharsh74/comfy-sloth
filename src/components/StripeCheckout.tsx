import React, { useState, useEffect, type FormEvent } from 'react';
import styled from 'styled-components';
import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,

} from '@stripe/react-stripe-js';

import axios from 'axios';
import { useCartContext } from '../context/cart_context';
import { useUserContext } from '../context/user_context';
import { formatPrice } from '../utils/helpers';
import { useHistory } from 'react-router-dom';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

const CheckoutForm: React.FC = () => {
  const { cart, total_amount, shipping_fee, clearCart } = useCartContext();
  const { myUser } = useUserContext();
  const history = useHistory();

  const [succeeded, setSucceeded] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [clientSecret, setClientSecret] = useState<string>('');

  const stripe = useStripe();
  const elements = useElements();

  const createPaymentIntent = async (): Promise<void> => {
    try {
      const { data } = await axios.post(
        '/.netlify/functions/create-payment-intent',
        JSON.stringify({ cart, shipping_fee, total_amount })
      );
      setClientSecret(data.clientSecret);
    } catch {
      // handle error
    }
  };

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': { color: '#32325d' },
      },
      invalid: { color: '#fa755a', iconColor: '#fa755a' },
    },
  };

  const handleChange = (event: any): void => {
    setDisabled(event.empty);
    setError(event.error ? event.error.message : null);
  };

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>): Promise<void> => {
    ev.preventDefault();
    setProcessing(true);
    if (!stripe || !elements) return;
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement)! },
    });
    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {
      setError(null);
      setProcessing(false);
      setSucceeded(true);
      setTimeout(() => {
        clearCart();
        history.push('/');
      }, 10000);
    }
  };

  return (
    <div>
      {succeeded ? (
        <article>
          <h4>Thank you</h4>
          <h4>Your payment was successful!</h4>
          <h4>Redirecting to home page shortly</h4>
        </article>
      ) : (
        <article>
          <h4>Hello, {myUser?.name}</h4>
          <p>Your total is {formatPrice(total_amount + shipping_fee)}</p>
          <p>Test Card Number: 4242 4242 4242 4242</p>
        </article>
      )}
      <form id="payment-form" onSubmit={handleSubmit}>
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
        <button disabled={processing || disabled || succeeded} id="submit">
          <span id="button-text">
            {processing ? <div className="spinner" id="spinner"></div> : 'Pay'}
          </span>
        </button>
        {error && <div className="card-error" role="alert">{error}</div>}
        <p className={succeeded ? 'result-message' : 'result-message hidden'}>
          Payment succeeded, see the result in your
          <a href="https://dashboard.stripe.com/test/payments"> Stripe dashboard</a>.
          Refresh the page to pay again.
        </p>
      </form>
    </div>
  );
};

const StripeCheckout: React.FC = () => (
  <Wrapper>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </Wrapper>
);

const Wrapper = styled.section`
  form { width: 30vw; align-self: center; box-shadow: 0 0 0 0.5px rgba(50,50,93,0.1),0 2px 5pxrgba(50,50,93,0.1),0 1px 1.5pxrgba(0,0,0,0.07); border-radius:7px; padding:40px; }
  input { border-radius:6px; margin-bottom:6px; padding:12px; border:1px solidrgba(50,50,93,0.1); max-height:44px; font-size:16px; width:100%; background:white; box-sizing:border-box; }
  .result-message { line-height:22px; font-size:16px; }
  .result-message a { color:rgb(89,111,214); font-weight:600; text-decoration:none; }
  .hidden { display:none; }
  #card-error { color:rgb(105,115,134); font-size:16px; line-height:20px; margin-top:12px; text-align:center; }
  #card-element { border-radius:4px 4px 0 0; padding:12px; border:1px solidrgba(50,50,93,0.1); max-height:44px; width:100%; background:white; box-sizing:border-box; }
  #payment-request-button { margin-bottom:32px; }
  button { background:#5469d4; font-family:Arial,sans-serif; color:#fff; border-radius:0 0 4px 4px; border:0; padding:12px 16px; font-size:16px; font-weight:600; cursor:pointer; display:block; transition:all 0.2s ease; box-shadow:0 4px5.5pxrgba(0,0,0,0.07); width:100%; }
  button:hover { filter:contrast(115%); }
  button:disabled { opacity:0.5; cursor:default; }
  .spinner, .spinner:before, .spinner:after { border-radius:50%; }
  .spinner { color:#fff; font-size:22px; text-indent:-99999px; margin:0 auto; position:relative; width:20px; height:20px; box-shadow:inset 0 0 0 2px; transform:translateZ(0); }
  .spinner:before, .spinner:after { position:absolute; content:''; }
  .spinner:before { width:10.4px; height:20.4px; background:#5469d4; border-radius:20.4px 0 0 20.4px; top:-0.2px; left:-0.2px; transform-origin:10.4px 10.2px; animation:loading 2s infinite ease 1.5s; }
  .spinner:after { width:10.4px; height:10.2px; background:#5469d4; border-radius:0 10.2px 10.2px 0; top:-0.1px; left:10.2px; transform-origin:0 10.2px; animation:loading 2s infinite ease; }
  @keyframes loading { 0% { transform:rotate(0deg); } 100% { transform:rotate(360deg); } }
  @media only screen and (max-width:600px) { form { width:80vw; } }
`;

export default StripeCheckout;
