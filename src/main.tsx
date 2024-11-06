// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import './main.css'
import '@coinbase/onchainkit/styles.css';
import { Providers } from './providers';

const rootElement = document.getElementById('root');


if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ThemeProvider>
      <Providers>
        <App />
      </Providers>
      </ThemeProvider>
    </React.StrictMode>,
  );
}
