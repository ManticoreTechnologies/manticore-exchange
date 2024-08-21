import api from './api';

export const fetchTransactions = async (address: string): Promise<string[]> => {
  try {
    const response = await api.node<string[]>('getaddresstxids', [
      { addresses: [address] },
      true,
    ]);
    
    return response;
  } catch (e) {
    console.log(e);
    return [];
  }
};


  