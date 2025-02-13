import React, { useState } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import './Bridge.css';

// Initialize Stripe with appearance and loader options
const stripePromise = loadStripe('pk_test_51QrnTsBZZxIsMW2eZlloiZsVkqS48sEmHLerYbIQmL1pz6FEULsyp8kNWKNwhzltpJEmuU9fT1DCFa4i7Xf6O7Vv007RwRV5t3');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create a payment method using the card element
      const { error: createError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement)!,
      });

      if (createError) {
        setError(createError.message || 'Payment failed');
        return;
      }

      // For testing, we'll just simulate a successful payment
      setSuccess(true);
      
      // In production, you would send the paymentMethod.id to your server
      // to complete the payment
      console.log('Payment Method:', paymentMethod.id);
      
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!stripe || !elements) {
    return <div className="loading-message">Loading payment system...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="test-card-info">
        <h3>Test Card Details</h3>
        <p>Use this test card number: 4242 4242 4242 4242</p>
        <p>Any future expiry date, any 3 digits for CVC, any postal code</p>
      </div>

      <div className="card-element-container">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Payment successful! Your EVR balance has been credited.
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`submit-button ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Processing...' : 'Pay $50'}
      </button>
    </form>
  );
};

const Bridge = () => {
  const options: StripeElementsOptions = {
    mode: 'payment' as const,
    amount: 5000, // $50.00
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
  };

  return (
    <div className="bridge-container">
      <div className="bridge-content">
        <h1>Purchase Evrmore (EVR)</h1>
        <p>
          Test Mode: This is a test payment form. No real charges will be made.
        </p>
        
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>

        <div className="info-section">
          <h2>Test Mode Information</h2>
          <ul>
            <li>This is a test payment form</li>
            <li>No real charges will be made</li>
            <li>Use test card number: 4242 4242 4242 4242</li>
            <li>Any future expiry date and any CVC will work</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Bridge;
