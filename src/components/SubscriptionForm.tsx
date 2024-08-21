import React, { useState } from 'react';
import '../styles/SubscriptionForm.css';

const SubscriptionForm: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Email submitted:', email);
    setEmail(''); // Clear the input after submission
  };

  return (
    <div className="subscription-form">
      <h2>Sign Up for Project Updates</h2>
      <form onSubmit={handleSubmit}>
        <input 
          id='email'
          autoComplete='true'
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter your email" 
          required 
        />
        <button type="submit" >Subscribe</button>
      </form>
    </div>
  );
};

export default SubscriptionForm;
