/* Manticore Technologies, LLC */
/* Copyright 2025 Manticore Technologies, LLC */
/* All Rights Reserved */

/*
    This file is the main entry point for the application.
    It is used to render the application and provide the theme context to the application.
*/

/* Import the React and ReactDOM libraries */
import React from 'react';
import ReactDOM from 'react-dom/client';

/* Import the application component */
import Application from './Application/application';

/* Import the context providers */
import { ThemeProvider } from '@/Application/contexts/ThemeContext';
import { AuthProvider } from '@/Application/contexts/AuthContext';

/* Import the global styles */
import '@coinbase/onchainkit/styles.css';

// Import the global styles
import './styles/main.css' // Global colors and typography
import './styles/keyframes.css' // All the animations are in this file

// Setup our root element
const rootElement = document.getElementById('root');

// Render the app
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(

    /*
        This is the root element for the application.
        It is used to render the application and provide the theme context to the application.

        - React.StrictMode: This is used to ensure that the application is rendered correctly.
        --- ThemeProvider: This is used to provide the theme context to the application.
        ------ Application: This is the main application component.
    */
    <React.StrictMode>
      
      <ThemeProvider>
        
        <AuthProvider>

          <Application />
        
        </AuthProvider>
      
      </ThemeProvider>

    </React.StrictMode>,
  
  );
}
