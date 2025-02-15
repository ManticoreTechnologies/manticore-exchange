interface RpcResponse<T> {
    result: T;
    error: any;
    id: string;
}

class EvrmoreService {
    private baseUrl = 'http://10.0.0.2:8002/evrmore';

    private async makeRequest<T>(command: string, params: any[] = []): Promise<T> {
        try {
            const response = await fetch(`${this.baseUrl}/${command}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jsonrpc: '1.0',
                    method: command,
                    params: params,
                    id: 1
                })
            });

            console.log(await response.json());

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data: RpcResponse<T> = await response.json();
            if (data.error) {
                throw new Error(data.error.message);
            }

            return data.result;
        } catch (error) {
            console.error(`Error fetching ${command}:`, error);
            throw error;
        }
    }

    // Blockchain Info
    async getBlockchainInfo() {
        return this.makeRequest<{
            chain: string;
            blocks: number;
            headers: number;
            bestblockhash: string;
            difficulty: number;
            mediantime: number;
            verificationprogress: number;
            initialblockdownload: boolean;
            chainwork: string;
            size_on_disk: number;
            pruned: boolean;
        }>('getblockchaininfo');
    }

    // Block Data
    async getBlock(hash: string, verbosity: number = 1) {
        return this.makeRequest<any>('getblock', [hash, verbosity]);
    }

    // Latest Blocks
    async getLatestBlocks(count: number = 10) {
        const info = await this.getBlockchainInfo();
        const blocks = [];
        let currentHeight = info.blocks;

        for (let i = 0; i < count && currentHeight >= 0; i++) {
            const hash = await this.makeRequest<string>('getblockhash', [currentHeight]);
            const block = await this.getBlock(hash);
            blocks.push(block);
            currentHeight--;
        }

        return blocks;
    }

    // Network Info
    async getNetworkInfo() {
        return this.makeRequest<{
            version: number;
            subversion: string;
            protocolversion: number;
            localservices: string;
            localrelay: boolean;
            timeoffset: number;
            connections: number;
            networkactive: boolean;
            networks: any[];
            relayfee: number;
            incrementalfee: number;
        }>('getnetworkinfo');
    }

    // Mining Info
    async getMiningInfo() {
        return this.makeRequest<{
            blocks: number;
            currentblockweight: number;
            currentblocktx: number;
            difficulty: number;
            networkhashps: number;
            pooledtx: number;
            chain: string;
        }>('getmininginfo');
    }

    // Mempool Info
    async getMempoolInfo() {
        return this.makeRequest<{
            size: number;
            bytes: number;
            usage: number;
            maxmempool: number;
            mempoolminfee: number;
        }>('getmempoolinfo');
    }

    // Transaction Info
    async getTransaction(txid: string) {
        return this.makeRequest<any>('getrawtransaction', [txid, true]);
    }

    // Asset Info
    async getAssetInfo(assetName: string) {
        return this.makeRequest<any>('getassetdata', [assetName]);
    }
}

export const evrmoreService = new EvrmoreService(); 