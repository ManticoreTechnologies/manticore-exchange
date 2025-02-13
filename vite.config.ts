/* Manticore Technologies, LLC */
/* Copyright 2025 Manticore Technologies, LLC */
/* All Rights Reserved */

/*
    This file is the Vite configuration file for the application.
    It is used to configure the application and the build process.
*/

/* Import the defineConfig function from Vite */
import { defineConfig } from 'vite';

/* Import the react plugin from Vite */
import react from '@vitejs/plugin-react-swc';

/* Import the dotenv library */
import dotenv from 'dotenv';

/* Import the path library */
import path from 'path';

/* Load environment variables based on the current mode */
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

/* Export the Vite configuration */
export default defineConfig(({ mode }) => {

  /* Return the Vite configuration */
  return {

    /* Define the plugins for the application */
    plugins: [react()],

    /* Define the server configuration for the application */
    server: {
      host: '0.0.0.0',
      port: 8080,
    },

    /* Define the resolve configuration for the application */
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },

    define: {
      'process.env.VITE_API_BASE_URL': JSON.stringify(
        mode === 'development' ? 'https://api.manticore.exchange' : 'https://api.manticore.exchange'
      ),
      'process.env.VITE_SERVER_URL': JSON.stringify(
        mode === 'development' ? 'https://api.manticore.exchange' : 'https://server-side-proxy-e3927d963c47.herokuapp.com'
      ),
      'process.env.VITE_COINMARKETCAP_API_KEY': JSON.stringify(
        mode === 'development' ? process.env.VITE_COINMARKETCAP_API_KEY_DEV : process.env.VITE_COINMARKETCAP_API_KEY_PROD
      ),
      'process.env.VITE_TRADING_WS_HOST': JSON.stringify(
        mode === 'development' ? process.env.VITE_TRADING_WS_HOST : process.env.VITE_TRADING_WS_HOST
      ),
      'process.env.VITE_TRADING_WS_PORT': JSON.stringify(
        mode === 'development' ? process.env.VITE_TRADING_WS_PORT : process.env.VITE_TRADING_WS_PORT
      ),
      'process.env.VITE_EXPLORER_API_HOST': JSON.stringify(
        mode === 'development' ? process.env.VITE_EXPLORER_API_HOST : process.env.VITE_EXPLORER_API_HOST
      ),
      'process.env.VITE_EXPLORER_API_PORT': JSON.stringify(
        mode === 'development' ? process.env.VITE_EXPLORER_API_PORT : process.env.VITE_EXPLORER_API_PORT
      ),
      'process.env.VITE_EXPLORER_API_PROTO': JSON.stringify(
        mode === 'development' ? process.env.VITE_EXPLORER_API_PROTO : process.env.VITE_EXPLORER_API_PROTO
      ),
      'process.env.VITE_EVRMORE_RPC_HOST': JSON.stringify(
        mode === 'development' ? process.env.VITE_EVRMORE_RPC_HOST : process.env.VITE_EVRMORE_RPC_HOST
      ),
      'process.env.VITE_EVRMORE_RPC_PORT': JSON.stringify(
        mode === 'development' ? process.env.VITE_EVRMORE_RPC_PORT : process.env.VITE_EVRMORE_RPC_PORT
      ),
      'process.env.VITE_EVRMORE_RPC_PROTO': JSON.stringify(
        mode === 'development' ? process.env.VITE_EVRMORE_RPC_PROTO : process.env.VITE_EVRMORE_RPC_PROTO
      ),
    }
  }
});

