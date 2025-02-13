import React, { useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import './Bridge.css';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_51QrnTsBZZxIsMW2eZlloiZsVkqS48sEmHLerYbIQmL1pz6FEULsyp8kNWKNwhzltpJEmuU9fT1DCFa4i7Xf6O7Vv007RwRV5t3');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState('10');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Initialize payment intent when amount changes
  React.useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: parseFloat(amount),
            currency: 'usd',
          }),
        });

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
      }
    };

    createPaymentIntent();
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/bridge/completion`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        setError(confirmError.message || 'Payment failed');
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        setSuccess(true);
      } else if (paymentIntent.status === 'requires_action') {
        // 3DS authentication is required, Stripe.js will handle the redirect
        const { error } = await stripe.confirmCardPayment(clientSecret);
        if (error) {
          setError(error.message || 'Payment authentication failed');
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="amount-selector">
        <label>
          Amount of EVR to purchase:
          <select value={amount} onChange={(e) => setAmount(e.target.value)}>
            <option value="10">10 EVR ($10)</option>
            <option value="50">50 EVR ($50)</option>
            <option value="100">100 EVR ($100)</option>
            <option value="500">500 EVR ($500)</option>
          </select>
        </label>
      </div>

      {clientSecret && (
        <div className="payment-element-container">
          <PaymentElement
            options={{
              layout: 'tabs',
              paymentMethodOrder: ['card'],
            }}
          />
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Payment successful! Your EVR balance has been credited.
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || loading || !clientSecret}
        className={`submit-button ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Processing...' : 'Purchase EVR'}
      </button>
    </form>
  );
};

const Bridge = () => {
  const [options, setOptions] = useState<StripeElementsOptions>({
    mode: 'payment' as const,
    amount: 1000,
    currency: 'usd',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#0066cc',
        colorBackground: '#ffffff',
        colorText: '#424770',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
    },
  });

  return (
    <div className="bridge-container">
      <div className="bridge-content">
        <h1>Purchase Evrmore (EVR)</h1>
        <p>
          Purchase EVR directly using your credit or debit card. The purchased amount
          will be credited to your wallet instantly after payment confirmation.
        </p>
        
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>

        <div className="info-section">
          <h2>Important Information</h2>
          <ul>
            <li>Minimum purchase amount: 10 EVR</li>
            <li>Transactions are processed securely through Stripe with 3D Secure authentication</li>
            <li>EVR will be sent to your connected wallet immediately after payment</li>
            <li>For any issues, please contact our support</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
