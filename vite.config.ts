import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import dotenv from 'dotenv';

// Load environment variables based on the current mode
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 8080,
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
    }
  }
});

