import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketData } from 'types/markets';
import { BigNumberish, ethers } from 'ethers';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import networkConnector from 'utils/networkConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { MarketStatus } from 'constants/markets';

const useMarketQuery = (marketAddress: string, options?: UseQueryOptions<MarketData>) => {
    return useQuery<MarketData>(
        QUERY_KEYS.Market(marketAddress),
        async () => {
            const contract = new ethers.Contract(marketAddress, marketContract.abi, networkConnector.provider);
            const { thalesOracleCouncilContract } = networkConnector;
            const [allMarketData, backstopTimeout, disputeClosedTime, isMarketClosedForDisputes] = await Promise.all([
                contract.getAllMarketData(),
                contract.backstopTimeout(),
                contract.disputeClosedTime(),
                thalesOracleCouncilContract?.isMarketClosedForDisputes(marketAddress),
            ]);

            const [
                question,
                dataSource,
                ticketType,
                endOfPositioning,
                ticketPrice,
                creationTime,
                isWithdrawalAllowed,
                isDisputed,
                isResolved,
                resolvedTime,
                positions,
                tags,
                poolSize,
                claimablePoolSize,
                poolSizePerPosition,
                canUsersPlacePosition,
                canMarketBeResolved,
                canMarketBeResolvedByPDAO,
                canUsersClaim,
                isCancelled,
                isPaused,
                winningPosition,
                creator,
                resolver,
            ] = allMarketData;

            const market: MarketData = {
                address: marketAddress,
                question,
                dataSource,
                isTicketType: ticketType === 0,
                endOfPositioning: Number(endOfPositioning) * 1000,
                ticketPrice: bigNumberFormatter(ticketPrice),
                creationTime: Number(creationTime) * 1000,
                isWithdrawalAllowed,
                isDisputed,
                isResolved,
                resolvedTime: Number(resolvedTime) * 1000,
                positions,
                tags: tags.map((tag: BigNumberish) => Number(tag)),
                poolSize: bigNumberFormatter(poolSize),
                claimablePoolSize: bigNumberFormatter(claimablePoolSize),
                poolSizePerPosition: poolSizePerPosition.map((item: BigNumberish) => bigNumberFormatter(item)),
                isOpen: !isResolved,
                numberOfDisputes: 0,
                numberOfOpenDisputes: 0,
                canUsersPlacePosition,
                canMarketBeResolved,
                canMarketBeResolvedByPDAO,
                canUsersClaim,
                isCancelled,
                isPaused,
                winningPosition: Number(winningPosition),
                creator,
                resolver,
                status: MarketStatus.Open,
                marketClosedForDisputes: isMarketClosedForDisputes,
                isMarketClosedForDisputes,
                backstopTimeout: Number(backstopTimeout) * 1000,
                disputeClosedTime: Number(disputeClosedTime) * 1000,
            };

            // TODO - needs refactoring
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
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketQuery;
