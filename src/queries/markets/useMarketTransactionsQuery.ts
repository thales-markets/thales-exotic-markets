import { useQuery, UseQueryOptions } from 'react-query';
import thalesData from 'thales-data';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketTransactions, MarketTransaction } from 'types/markets';
import { NetworkId } from 'types/network';
import networkConnector from 'utils/networkConnector';
import { BigNumberish } from 'ethers';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { getOpenBidPositionsString } from 'utils/markets';

const useMarketTransactionsQuery = (
    marketAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<MarketTransactions | undefined>
) => {
    return useQuery<MarketTransactions | undefined>(
        QUERY_KEYS.MarketTransactions(marketAddress, networkId),
        async () => {
            try {
                const { marketDataContract } = networkConnector;

                const [marketTransactions, marketData] = await Promise.all([
                    thalesData.exoticMarkets.marketTransactions({
                        market: marketAddress,
                        network: networkId,
                    }),
                    marketDataContract?.getAllMarketData(marketAddress),
                ]);

                const marketPositions = marketData[10];
                const isTicketType = Number(marketData[2]) === 0;

                const mappedMarketTransactions = marketTransactions.map((tx: MarketTransaction) => {
                    if (!isTicketType && (tx.type === 'bid' || tx.type === 'updatePositions')) {
                        tx.positions = tx.positions.map((item: BigNumberish) => bigNumberFormatter(item));
                    }
                    tx.position =
                        tx.type === 'resetMarketResult' || tx.type === 'claimRefund' || tx.type === 'openDispute'
                            ? '-'
                            : !isTicketType && tx.type === 'withdrawal' && Number(tx.position) === 0
                            ? 'ALL'
                            : !isTicketType && (tx.type === 'bid' || tx.type === 'updatePositions')
                            ? getOpenBidPositionsString(marketPositions, tx.positions)
                            : Number(tx.position) === 0
                            ? 'Cancel'
                            : marketPositions[Number(tx.position) - 1];
                    tx.positionLabels = marketPositions;
                    tx.isTicketType = isTicketType;
                    return tx;
                });

                return mappedMarketTransactions;
            } catch (e) {
                console.log(e);
                return undefined;
            }
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketTransactionsQuery;
