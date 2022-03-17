import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketInfo, Markets } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';
import { MarketStatus } from 'constants/markets';
import networkConnector from 'utils/networkConnector';

const useMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<Markets>) => {
    return useQuery<Markets>(
        QUERY_KEYS.Markets(networkId),
        async () => {
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
                market.canUsersClaim =
                    market.isResolved &&
                    !market.isDisputed &&
                    ((market.resolvedTime > 0 &&
                        Date.now() > market.resolvedTime + Number(claimTimeoutDefaultPeriod) * 1000) ||
                        (market.backstopTimeout > 0 &&
                            market.resolvedTime > 0 &&
                            market.disputeClosedTime > 0 &&
                            Date.now() > market.disputeClosedTime + market.backstopTimeout));
                market.isMarketClosedForDisputes = market.marketClosedForDisputes && market.canUsersClaim;

                if (market.isPaused) {
                    market.status = MarketStatus.Paused;
                } else {
                    if (market.isResolved) {
                        if (market.winningPosition === 0) {
                            if (market.isDisputed) {
                                market.status = MarketStatus.CancelledDisputed;
                            } else {
                                if (market.canUsersClaim) {
                                    market.status = MarketStatus.CancelledConfirmed;
                                } else {
                                    market.status = MarketStatus.CancelledPendingConfirmation;
                                }
                            }
                        } else {
                            if (market.isDisputed) {
                                market.status = MarketStatus.ResolvedDisputed;
                            } else {
                                if (market.canUsersClaim) {
                                    market.status = MarketStatus.ResolvedConfirmed;
                                } else {
                                    market.status = MarketStatus.ResolvedPendingConfirmation;
                                }
                            }
                        }
                    } else {
                        if (market.canMarketBeResolved) {
                            market.status = MarketStatus.ResolvePending;
                        } else {
                            if (market.isDisputed && Date.now() > market.endOfPositioning) {
                                market.status = MarketStatus.ResolvePendingDisputed;
                            } else {
                                market.status = MarketStatus.Open;
                            }
                        }
                    }
                }
                market.isOpen = market.status === MarketStatus.Open;

                return market;
            });
            return mappedMarkets;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketsQuery;
