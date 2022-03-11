import { NetworkId } from 'types/network';

export const QUERY_KEYS = {
    Markets: (networkId: NetworkId) => ['markets', networkId],
    Market: (marketAddress: string, walletAddress: string) => ['market', marketAddress, walletAddress],
    MarketsParameters: (networkId: NetworkId) => ['markets', 'parameters', networkId],
    Tags: (networkId: NetworkId) => ['tags', networkId],
    Disputes: (marketAddress: string, networkId: NetworkId) => ['disputes', marketAddress, networkId],
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
