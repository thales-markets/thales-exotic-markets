import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketData } from 'types/markets';
import { BigNumberish, ethers } from 'ethers';
import networkConnector from 'utils/networkConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { MarketStatus } from 'constants/markets';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';

const useMarketQuery = (marketAddress: string, options?: UseQueryOptions<MarketData | undefined>) => {
    return useQuery<MarketData | undefined>(
        QUERY_KEYS.Market(marketAddress),
        async () => {
            try {
                const contract = new ethers.Contract(marketAddress, marketContract.abi, networkConnector.provider);
                const {
                    marketDataContract,
                    thalesOracleCouncilContract,
                    marketManagerContract,
                    thalesBondsContract,
                } = networkConnector;
                const [
                    allMarketData,
                    isMarketClosedForDisputes,
                    numberOfDisputes,
                    numberOfOpenDisputes,
                    claimTimeoutDefaultPeriod,
                    cancelledByCreator,
                    winningAmountsNewUser,
                    winningAmountsNoPosition,
                    totalUsersTakenPositions,
                    winningAmountPerTicket,
                    noWinners,
                    allFees,
                    canIssueFees,
                    creatorBond,
                ] = await Promise.all([
                    marketDataContract?.getAllMarketData(marketAddress),
                    thalesOracleCouncilContract?.isMarketClosedForDisputes(marketAddress),
                    thalesOracleCouncilContract?.marketTotalDisputes(marketAddress),
                    thalesOracleCouncilContract?.getMarketOpenDisputes(marketAddress),
                    marketManagerContract?.claimTimeoutDefaultPeriod(),
                    marketManagerContract?.cancelledByCreator(marketAddress),
                    contract?.getPotentialWinningAmountForAllPosition(true, 0),
                    contract?.getPotentialWinningAmountForAllPosition(false, 0),
                    contract?.totalUsersTakenPositions(),
                    contract?.getWinningAmountPerTicket(),
                    contract?.noWinners(),
                    contract?.getAllFees(),
                    contract?.canIssueFees(),
                    thalesBondsContract?.getCreatorBondForMarket(marketAddress),
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
                    fixedBondAmount,
                    disputePrice,
                    safeBoxLowAmount,
                    arbitraryRewardForDisputor,
                    backstopTimeout,
                    disputeClosedTime,
                    canCreatorCancelMarket,
                ] = allMarketData;

                const [creatorFee, resolverFee, safeBoxFee, totalFees] = allFees;

                const market: MarketData = {
                    address: marketAddress,
                    question,
                    dataSource,
                    isTicketType: Number(ticketType) === 0,
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
                    numberOfDisputes: Number(numberOfDisputes),
                    numberOfOpenDisputes: Number(numberOfOpenDisputes),
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
                    claimTimeoutDefaultPeriod: Number(claimTimeoutDefaultPeriod) * 1000,
                    disputePrice: bigNumberFormatter(disputePrice),
                    canCreatorCancelMarket,
                    fixedBondAmount: bigNumberFormatter(fixedBondAmount),
                    safeBoxLowAmount: bigNumberFormatter(safeBoxLowAmount),
                    arbitraryRewardForDisputor: bigNumberFormatter(arbitraryRewardForDisputor),
                    winningAmountsNewUser: winningAmountsNewUser.map((item: BigNumberish) => bigNumberFormatter(item)),
                    winningAmountsNoPosition: winningAmountsNoPosition.map((item: BigNumberish) =>
                        bigNumberFormatter(item)
                    ),
                    totalUsersTakenPositions: Number(totalUsersTakenPositions),
                    winningAmountPerTicket: bigNumberFormatter(winningAmountPerTicket),
                    noWinners,
                    numberOfParticipants: bigNumberFormatter(poolSize) / bigNumberFormatter(ticketPrice),
                    cancelledByCreator,
                    creatorBond: bigNumberFormatter(creatorBond),
                    creatorFee: bigNumberFormatter(creatorFee),
                    resolverFee: bigNumberFormatter(resolverFee),
                    safeBoxFee: bigNumberFormatter(safeBoxFee),
                    totalFees: bigNumberFormatter(totalFees),
                    canIssueFees,
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
                                if (market.canUsersClaim || market.cancelledByCreator) {
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

                return market;
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

export default useMarketQuery;
