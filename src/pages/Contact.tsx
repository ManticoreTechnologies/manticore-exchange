import React from 'react';
import SubscriptionForm from '../components/SubscriptionForm';

const ContactPage: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Contact Us</h1>
      <p style={styles.paragraph}>Contact details and form go here.</p>
      <SubscriptionForm />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    padding: '20px',
    backgroundColor: '#000', // Black background
    color: '#ddd', // Light grey text color
  },
  heading: {
    fontSize: '3em',
    color: '#ff000c', // Red color for the heading
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '1.2em',
    color: '#a8a8a8', // Light grey color for the paragraph
    marginBottom: '30px',
  },
  form: {
    width: '100%',
    maxWidth: '400px', // Limit the form width for better mobile layout
  },
};

export default ContactPage;

