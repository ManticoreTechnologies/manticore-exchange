import { useState } from 'react';
import '../styles/Subscribe.css';
import api from '../utility/api';

const SubscribeForm = () => {
  const [email, setEmail] = useState('');


  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value); // Update the state with the new email value
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent the default form submission behavior
    if (email) {
      try {
        const response = await api.get<APIResponse>(`registeremail/${email}`);
        alert(JSON.stringify(response.message)); // Alert the response
      } catch (error: any) {
        alert('Failed to register email: ' + error.message);
      }
    } else {
      alert('Please enter a valid email address.');
    }
  };


  return (  
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        placeholder="Enter your email" 
        required 
        onChange={handleEmailChange} 
        value={email} 
      />
      <button type="submit">Subscribe</button>
    </form>
  );
};

export default SubscribeForm;
