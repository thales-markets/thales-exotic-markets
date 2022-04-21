import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketInfo, Markets } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';
import networkConnector from 'utils/networkConnector';
import { getMarketStatus } from 'utils/markets';

const useMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<Markets | undefined>) => {
    return useQuery<Markets | undefined>(
        QUERY_KEYS.Markets(networkId),
        async () => {
            try {
                const { marketManagerContract } = networkConnector;
                const [markets, claimTimeoutDefaultPeriod] = await Promise.all([
                    thalesData.exoticMarkets.markets({
                        network: networkId,
                    }),
                    marketManagerContract?.claimTimeoutDefaultPeriod(),
                ]);

                const mappedMarkets = markets.map((market: MarketInfo) => {
                    market.canMarketBeResolved =
                        Date.now() > market.endOfPositioning && !market.isDisputed && !market.isResolved;
                    market.claimTimeoutDefaultPeriod = Number(claimTimeoutDefaultPeriod) * 1000;
                    market.canUsersClaim =
                        market.isResolved &&
                        !market.isDisputed &&
                        ((market.resolvedTime > 0 &&
                            Date.now() > market.resolvedTime + market.claimTimeoutDefaultPeriod) ||
                            (market.backstopTimeout > 0 &&
                                market.resolvedTime > 0 &&
                                market.disputeClosedTime > 0 &&
                                Date.now() > market.disputeClosedTime + market.backstopTimeout));

                    market.isMarketClosedForDisputes = market.marketClosedForDisputes && market.canUsersClaim;
                    market.status = getMarketStatus(market);

                    return market;
                });
                return mappedMarkets;
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

export default useMarketsQuery;
