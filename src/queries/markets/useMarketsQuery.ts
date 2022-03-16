import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketInfo, Markets } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';
import { MarketStatus } from 'constants/markets';

const useMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<Markets>) => {
    return useQuery<Markets>(
        QUERY_KEYS.Markets(networkId),
        async () => {
            let markets: Markets = await thalesData.exoticMarkets.markets({
                network: networkId,
            });

            markets = markets.map((market: MarketInfo) => {
                // if (market.paused) {
                //     market.status = MarketStatus.Paused;
                // } else {
                if (market.isResolved) {
                    if (market.winningPosition === 0) {
                        market.status = MarketStatus.Cancelled;
                    } else {
                        if (!market.marketClosedForDisputes && market.numberOfOpenDisputes > 0) {
                            market.status = MarketStatus.ResolvedDisputed;
                        } else {
                            if (Date.now() > market.endOfPositioning) {
                                // if (market.canUsersClaim) {
                                market.status = MarketStatus.ResolvedConfirmed;
                            } else {
                                market.status = MarketStatus.ResolvePendingConfirmation;
                            }
                        }
                    }
                } else {
                    if (Date.now() > market.endOfPositioning && market.numberOfOpenDisputes === 0) {
                        market.status = MarketStatus.ResolvePending;
                    } else {
                        if (!market.marketClosedForDisputes && market.numberOfOpenDisputes > 0) {
                            market.status = MarketStatus.OpenDisputed;
                        } else {
                            market.status = MarketStatus.Open;
                        }
                    }
                }
                // }
                return market;
            });

            console.log(markets);

            return markets;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketsQuery;
