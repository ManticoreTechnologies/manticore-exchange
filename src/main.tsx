// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App/App';
import { ThemeProvider } from '@/context/ThemeContext';
import '@coinbase/onchainkit/styles.css';

// Import the global styles
import './main.css' // Global colors and typography
import './keyframes.css' // All the animations are in this file

// Setup our root element
const rootElement = document.getElementById('root');

// Render the app
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(

    <React.StrictMode>
      
      <ThemeProvider>
      
        <App />
      
      </ThemeProvider>

    </React.StrictMode>,
  
  );
}
