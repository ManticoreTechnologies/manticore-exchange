import axios, { AxiosError } from 'axios';

const apiUrl = import.meta.env.VITE_API_BASE_URL;
const serverUrl = import.meta.env.VITE_SERVER_URL;
const coinmarketcapApiKey = import.meta.env.VITE_COINMARKETCAP_API_KEY;
const xeggexApiUrl = 'https://api.xeggex.com/v2/'; // Base URL for Xeggex API
const api = {
  get: async <T = unknown>(endpoint: string): Promise<T> => {
    try {
      const response = await axios.get<T>(`${apiUrl}/api/${endpoint}`);
      return response.data; // Return only the JSON data
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError; // Re-throw the error to be handled by the calling function
    }
  },
  manticore_ipfs: async <T = unknown>(cid: string): Promise<T> => {
    try {
      const response = await axios.get<T>(`https://api.manticore.exchange:8001/ipfs/cid/${cid}`);
      return response.data; // Return only the JSON data
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError; // Re-throw the error to be handled by the calling function
    }
  },
  manticore_list: async <T = unknown>(mode: string): Promise<T> => {
    try {
      const response = await axios.get<T>(`https://api.manticore.exchange:8001/listby/${mode}`);
      return response.data; // Return only the JSON data
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError; // Re-throw the error to be handled by the calling function
    }
  },
  node: async <T = unknown>(endpoint: string, body: object): Promise<T> => {
    try {
      const response = await axios.post<T>(`${apiUrl}/evrmore/rpc/${endpoint}`, body);
      return response.data; // Return only the JSON data
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError; // Re-throw the error to be handled by the calling function
    }
  },
  post: async <T = unknown>(endpoint: string, body: object): Promise<T> => {
    try {
      const response = await axios.post<T>(`${apiUrl}/api/${endpoint}`, body);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError;
    }
  },
  getCoinMarketCapData: async <T = unknown>(endpoint: string): Promise<T> => {
    try {
      const response = await axios.get<T>(`${serverUrl}/api/${endpoint}`, {
        headers: {
          'X-CMC_PRO_API_KEY': coinmarketcapApiKey,
          'Accept': 'application/json',
          'Accept-Encoding': 'deflate, gzip',
        },
      });
      return response.data; // Return only the JSON data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching CoinMarketCap data:', axiosError);
      throw axiosError; // Re-throw the error to be handled by the calling function
    }
  },
  getHistoricalData: async <T = unknown>(symbol: string, start: string, end: string): Promise<T> => {
    try {
      const response = await axios.get<T>(`${serverUrl}/api/cryptocurrency/quotes/historical`, {
        params: {
          symbol,
          start,
          end,
        },
        headers: {
          'X-CMC_PRO_API_KEY': coinmarketcapApiKey,
          'Accept': 'application/json',
          'Accept-Encoding': 'deflate, gzip',
        },
      });
      return response.data; // Return only the JSON data
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error fetching historical data:', axiosError);
      throw axiosError; // Re-throw the error to be handled by the calling function
    }
  },
  getXeggexPrice: async <T = unknown>(pair: string): Promise<T> => {
    try {
      const response = await axios.get<T>(`${xeggexApiUrl}ticker/${pair}`);
      return response.data; // Return only the JSON data
    } catch (error) {
      const axiosError = error as AxiosError;
      throw axiosError; // Re-throw the error to be handled by the calling function
    }
  },
};

export default api;












