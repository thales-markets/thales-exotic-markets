import { NetworkId } from 'types/network';

export const QUERY_KEYS = {
    Markets: (networkId: NetworkId) => ['markets', networkId],
    Market: (marketAddress: string, walletAddress: string) => ['market', marketAddress, walletAddress],
    MarketsParameters: (networkId: NetworkId) => ['markets', 'parameters', networkId],
    Tags: (networkId: NetworkId) => ['tags', networkId],
    Wallet: {
        ThalesBalance: (walletAddress: string, networkId: NetworkId) => [
            'wallet',
            'thalesBalance',
            walletAddress,
            networkId,
        ],
    },
};

export default QUERY_KEYS;
