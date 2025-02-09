interface Window {
    evr?: {
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        on: (eventName: string, handler: (params: any) => void) => void;
        removeListener: (eventName: string, handler: (params: any) => void) => void;
    };
} 