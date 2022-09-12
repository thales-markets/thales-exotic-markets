import { NetworkId } from 'types/network';

export const QUERY_KEYS = {
    Markets: (networkId: NetworkId) => ['markets', networkId],
    Market: (marketAddress: string) => ['market', marketAddress],
    MarketTransactions: (marketAddress: string, networkId: NetworkId) => [
        'market',
        'transactions',
        marketAddress,
        networkId,
    ],
    AccountMarketData: (marketAddress: string, walletAddress: string) => ['market', marketAddress, walletAddress],
    AccountMarketTicketData: (marketAddress: string, walletAddress: string) => [
        'market',
        'ticket',
        marketAddress,
        walletAddress,
    ],
    AccountMarketOpenBidData: (marketAddress: string, walletAddress: string) => [
        'market',
        'openBid',
        marketAddress,
        walletAddress,
    ],
    MarketsParameters: (networkId: NetworkId) => ['markets', 'parameters', networkId],
    Tags: (networkId: NetworkId) => ['tags', networkId],
    Disputes: (marketAddress: string, networkId: NetworkId) => ['disputes', marketAddress, networkId],
    Dispute: (marketAddress: string, dispute: number, networkId: NetworkId) => [
        'dispute',
        marketAddress,
        dispute,
        networkId,
    ],
    AccountDisputeData: (marketAddress: string, dispute: number, walletAddress: string) => [
        'dispute',
        marketAddress,
        dispute,
        walletAddress,
    ],
    AccountPositions: (walletAddress: string, networkId: NetworkId) => ['positions', walletAddress, networkId],
    Wallet: {
        PaymentTokenBalance: (walletAddress: string, networkId: NetworkId) => [
            'wallet',
            'paymentTokenBalance',
            walletAddress,
            networkId,
        ],
        TokenBalance: (token: string, walletAddress: string, networkId: NetworkId) => [
            'wallet',
            'tokenBalance',
            token,
            walletAddress,
            networkId,
        ],
        CollateralBalance: (walletAddress: string, networkId: NetworkId) => [
            'wallet',
            'ollateralBalance',
            walletAddress,
            networkId,
        ],
        SwapApproveSpender: (networkId: NetworkId) => ['wallet', 'swap', 'approveSpender', networkId],
        GetUsdDefaultAmount: (networkId: NetworkId) => ['wallet', 'getUsdDefaultAmount', networkId],
    },
    OracleCouncilMember: (walletAddress: string, networkId: NetworkId) => [
        'oracleCouncilMember',
        walletAddress,
        networkId,
    ],
};

export default QUERY_KEYS;
