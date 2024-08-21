interface TransactionDetail {
    blockhash: string;
    blocktime: number;
    confirmations: number;
    hash: string;
    height: number;
    hex: string;
    locktime: number;
    size: number;
    time: number;
    txid: string;
    version: number;
    vin: Vin[];
    vout: Vout[];
    vsize: number;
  }
  interface APIResponse {
    message: any;
  }
  interface APITransaction{
    data: TransactionDetail
  }
  
  interface Vin {
    coinbase: string;
    sequence: number;
  }
  
  interface Vout {
    n: number;
    scriptPubKey: ScriptPubKey;
    spentHeight?: number;
    spentIndex?: number;
    spentTxId?: string;
    value: number;
    valueSat: number;
  }
  
  interface ScriptPubKey {
    addresses?: string[];
    asm: string;
    hex: string;
    reqSigs: number;
    type: string;
  }
  
  interface APImeta {
    total_pages: number
  }
  
  interface ApiResponse {
    data: string[],
    meta: APImeta
  }

  interface ApiDeltas {
    data: WalletDeltas
  }
  interface WalletDeltas {
      balance: number,
      received: number,
      sent: number
  }
  interface TransactionSummary {
    txid: string;
    timestamp: number; // Unix timestamp
    confirmations: number;
    amount: number; // Could represent the total output value
  }
  interface Transaction {
    txid: string;
    totalIn: number;
    totalOut: number;
    blockHeight: number;
    minerFee: number;
  }
  interface Window {
    ethereum: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: Array<any> }) => Promise<any>;
      on: (eventName: string, callback: (...args: any[]) => void) => void;
    };
  }