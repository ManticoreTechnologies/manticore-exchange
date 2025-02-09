import React from 'react';
import Cart from './Cart';
import { useNavigate } from 'react-router-dom';

const CartContainer: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/trade');
  };

  return (
    <Cart
      onBack={handleBack}
    />
  );
};

export default CartContainer; 