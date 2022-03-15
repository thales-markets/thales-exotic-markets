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
            const [allMarketData] = await Promise.all([contract.getAllMarketData()]);

            const [
                question,
                dataSource,
                ticketType,
                endOfPositioning,
                ticketPrice,
                creationTime,
                isWithdrawalAllowed,
                hasOpenDisputes,
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
                paused,
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
                hasOpenDisputes,
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
                paused,
                winningPosition: Number(winningPosition),
                creator,
                resolver,
                status: MarketStatus.Open,
            };

            // TODO - needs refactoring
            if (market.paused) {
                market.status = MarketStatus.Paused;
            } else {
                if (market.isResolved) {
                    if (market.winningPosition === 0) {
                        market.status = MarketStatus.Cancelled;
                    } else {
                        if (market.hasOpenDisputes) {
                            market.status = MarketStatus.ResolvedDisputed;
                        } else {
                            if (market.canUsersClaim) {
                                market.status = MarketStatus.ResolvedConfirmed;
                            } else {
                                market.status = MarketStatus.ResolvePendingConfirmation;
                            }
                        }
                    }
                } else {
                    if (market.hasOpenDisputes) {
                        market.status = MarketStatus.OpenDisputed;
                    } else {
                        if (market.canMarketBeResolved) {
                            market.status = MarketStatus.ResolvePending;
                        } else {
                            market.status = MarketStatus.Open;
                        }
                    }
                }
            }
            market.isOpen = market.status === MarketStatus.Open || market.status === MarketStatus.OpenDisputed;

            return market;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketQuery;
