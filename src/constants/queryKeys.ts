import { NetworkId } from 'types/network';

export const QUERY_KEYS = {
    Markets: (networkId: NetworkId) => ['markets', networkId],
    Market: (marketAddress: string) => ['market', marketAddress],
    MarketsParameters: (networkId: NetworkId) => ['markets', 'parameters', networkId],
};

export default QUERY_KEYS;
