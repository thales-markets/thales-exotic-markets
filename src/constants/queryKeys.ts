import { NetworkId } from 'types/network';

export const QUERY_KEYS = {
    Markets: (networkId: NetworkId) => ['markets', networkId],
    Market: (marketAddress: string) => ['market', marketAddress],
    AccountMarketData: (marketAddress: string, walletAddress: string) => ['market', marketAddress, walletAddress],
    MarketsParameters: (networkId: NetworkId) => ['markets', 'parameters', networkId],
    Tags: (networkId: NetworkId) => ['tags', networkId],
    Disputes: (marketAddress: string, networkId: NetworkId) => ['disputes', marketAddress, networkId],
    Dispute: (marketAddress: string, dispute: number, networkId: NetworkId) => [
        'dispute',
        marketAddress,
        dispute,
        networkId,
    ],
    Wallet: {
        PaymentTokenBalance: (walletAddress: string, networkId: NetworkId) => [
            'wallet',
            'paymentTokenBalance',
            walletAddress,
            networkId,
        ],
    },
    OracleCouncilMember: (walletAddress: string, networkId: NetworkId) => [
        'oracleCouncilMember',
        walletAddress,
        networkId,
    ],
};

export default QUERY_KEYS;
