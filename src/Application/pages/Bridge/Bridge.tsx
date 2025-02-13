import React, { useState, useEffect, useRef } from 'react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import './Bridge.css';

// Initialize Stripe with your publishable test key
const stripePromise = loadStripe('pk_test_51QrnTsBZZxIsMW2eZlloiZsVkqS48sEmHLerYbIQmL1pz6FEULsyp8kNWKNwhzltpJEmuU9fT1DCFa4i7Xf6O7Vv007RwRV5t3');

// Define your digital assets with a base price (in cents)
const digitalAssets = [
  { id: 'assetA', name: 'Digital Asset A' },
  { id: 'assetB', name: 'Digital Asset B' },
  { id: 'assetC', name: 'Digital Asset C' },
];

// Base prices for each asset
const basePrices: { [key: string]: number } = {
  assetA: 1000, // $10.00
  assetB: 2000, // $20.00
  assetC: 5000, // $50.00
};

// Function to generate a random price around the base price
const getRandomPrice = (base: number) => {
  // Simulate a fluctuation of ±20%
  const fluctuation = base * 0.2;
  const min = base - fluctuation;
  const max = base + fluctuation;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Test card constants
const TEST_CARD = {
  number: '4242 4242 4242 4242',
  expiry: '12/36',
  cvc: '123'
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [selectedAsset, setSelectedAsset] = useState(digitalAssets[0]);
  const [randomPrice, setRandomPrice] = useState(getRandomPrice(basePrices[digitalAssets[0].id]));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const copyTimeout = useRef<NodeJS.Timeout>();

  // Update random price whenever the selected asset changes
  useEffect(() => {
    setRandomPrice(getRandomPrice(basePrices[selectedAsset.id]));
  }, [selectedAsset]);

  const handleAssetChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const asset = digitalAssets.find(a => a.id === event.target.value);
    if (asset) {
      setSelectedAsset(asset);
    }
  };

  // Allow manual refresh of the price to simulate fluctuations
  const handleRefreshPrice = () => {
    setRandomPrice(getRandomPrice(basePrices[selectedAsset.id]));
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      if (copyTimeout.current) {
        clearTimeout(copyTimeout.current);
      }
      copyTimeout.current = setTimeout(() => setCopiedField(null), 1500);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Create a PaymentIntent using the random price
      const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Replace with your secret test key – DO NOT expose this in production.
          Authorization: 'Bearer sk_test_51QrnTsBZZxIsMW2eJ1RnN5NfhTzYRKR70hB3eE4JSYKQGrGHj2Ul1FHXy0XzR1WssHV1WK6idj3LlcR8Vg4NSQ9f00zLzEddop',
        },
        body: new URLSearchParams({
          amount: randomPrice.toString(),
          currency: 'usd',
        }),
      });
      const paymentIntentData = await response.json();
      if (paymentIntentData.error) {
        setError(paymentIntentData.error.message);
        setLoading(false);
        return;
      }
      const clientSecret = paymentIntentData.client_secret;

      // Confirm the PaymentIntent using the card details
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Test User',
            email: 'test@example.com',
          },
        },
      });

      if (result.error) {
        setError(result.error.message || 'Payment failed');
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        setSuccess(true);
        console.log('PaymentIntent succeeded:', result.paymentIntent);
      }
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
      <h3>Select a Digital Asset</h3>
      <select onChange={handleAssetChange} value={selectedAsset.id} className="asset-select">
        {digitalAssets.map(asset => (
          <option key={asset.id} value={asset.id}>
            {asset.name}
          </option>
        ))}
      </select>

      <div className="price-info">
        <p>
          Current Price: ${ (randomPrice / 100).toFixed(2) }{' '}
          <button type="button" onClick={handleRefreshPrice}>
            Refresh Price
          </button>
        </p>
      </div>

      <div className="test-card-info">
        <h3>Test Card Details (Click to copy)</h3>
        <div className="test-card-field" onClick={() => copyToClipboard(TEST_CARD.number, 'number')}>
          <span>Card Number:</span>
          <code>{TEST_CARD.number}</code>
          {copiedField === 'number' && <span className="copied-badge">Copied!</span>}
        </div>
        <div className="test-card-field" onClick={() => copyToClipboard(TEST_CARD.expiry, 'expiry')}>
          <span>Expiry:</span>
          <code>{TEST_CARD.expiry}</code>
          {copiedField === 'expiry' && <span className="copied-badge">Copied!</span>}
        </div>
        <div className="test-card-field" onClick={() => copyToClipboard(TEST_CARD.cvc, 'cvc')}>
          <span>CVC:</span>
          <code>{TEST_CARD.cvc}</code>
          {copiedField === 'cvc' && <span className="copied-badge">Copied!</span>}
        </div>
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
                backgroundColor: 'white',
              },
              invalid: {
                color: '#9e2146',
              },
            },
            hidePostalCode: true,
          }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && (
        <div className="success-message">
          Payment successful for {selectedAsset.name} at a price of ${ (randomPrice / 100).toFixed(2) }!
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`submit-button ${loading ? 'loading' : ''}`}
      >
        {loading ? 'Processing...' : `Pay $${(randomPrice / 100).toFixed(2)}`}
      </button>
    </form>
  );
};

const Bridge = () => {
  const options: StripeElementsOptions = {
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
          Test Mode: This is a test payment form for digital assets with random, fluctuating prices.
          No real charges will be made.
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
