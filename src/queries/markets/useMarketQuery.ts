import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketData } from 'types/markets';
import { BigNumberish, ethers } from 'ethers';
import networkConnector from 'utils/networkConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { MarketStatus } from 'constants/markets';
import marketContract from 'utils/contracts/exoticPositionalTicketMarketContract';
import openBidMarketContract from 'utils/contracts/exoticPositionalOpenBidMarketContract';
import { getMarketStatus } from 'utils/markets';

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
                    totalUsersTakenPositions,
                    noWinners,
                    allFees,
                    canIssueFees,
                    withdrawalPeriod,
                    creatorBond,
                ] = await Promise.all([
                    marketDataContract?.getAllMarketData(marketAddress),
                    thalesOracleCouncilContract?.isMarketClosedForDisputes(marketAddress),
                    thalesOracleCouncilContract?.marketTotalDisputes(marketAddress),
                    thalesOracleCouncilContract?.getMarketOpenDisputes(marketAddress),
                    marketManagerContract?.claimTimeoutDefaultPeriod(),
                    marketManagerContract?.cancelledByCreator(marketAddress),
                    contract?.totalUsersTakenPositions(),
                    contract?.noWinners(),
                    contract?.getAllFees(),
                    contract?.canIssueFees(),
                    contract?.withdrawalPeriod(),
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

                let description = '';

                try {
                    description = await contract.additionalInfo();
                } catch (e) {
                    description = '';
                }

                const market: MarketData = {
                    address: marketAddress,
                    question,
                    dataSource,
                    description,
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
                    noWinners,
                    numberOfParticipants: Number(totalUsersTakenPositions),
                    cancelledByCreator,
                    creatorBond: bigNumberFormatter(creatorBond),
                    creatorFee: bigNumberFormatter(creatorFee),
                    resolverFee: bigNumberFormatter(resolverFee),
                    safeBoxFee: bigNumberFormatter(safeBoxFee),
                    totalFees: bigNumberFormatter(totalFees),
                    canIssueFees,
                    withdrawalPeriod: Number(withdrawalPeriod) * 1000,
                };

                market.status = getMarketStatus(market);

                if (market.isTicketType) {
                    const [
                        winningAmountsNewUser,
                        winningAmountsNoPosition,
                        winningAmountPerTicket,
                    ] = await Promise.all([
                        contract?.getPotentialWinningAmountForAllPosition(true, 0),
                        contract?.getPotentialWinningAmountForAllPosition(false, 0),
                        contract?.getWinningAmountPerTicket(),
                    ]);

                    market.fixedMarketData = {
                        winningAmountsNewUser: winningAmountsNewUser.map((item: BigNumberish) =>
                            bigNumberFormatter(item)
                        ),
                        winningAmountsNoPosition: winningAmountsNoPosition.map((item: BigNumberish) =>
                            bigNumberFormatter(item)
                        ),
                        winningAmountPerTicket: bigNumberFormatter(winningAmountPerTicket),
                    };
                } else {
                    const openBidContract = new ethers.Contract(
                        marketAddress,
                        openBidMarketContract.abi,
                        networkConnector.provider
                    );
                    const [winningPerPosition] = await Promise.all([
                        openBidContract?.getPotentialOpenBidWinningForAllPositions(),
                    ]);

                    market.openBidMarketData = {
                        roiPerPosition: winningPerPosition.map((item: BigNumberish) => bigNumberFormatter(item) - 1),
                    };
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
