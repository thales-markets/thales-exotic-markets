import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { DisputeVoteInfo, DisputeData, DisputeVotingResults } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';
import {
    DisputeStatus,
    DisputeVotingOption,
    DISPUTE_VOTED_OPTION_STATUS_MAP,
    DISPUTE_VOTING_OPTIONS_MARKET_OPEN,
    DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED,
} from 'constants/markets';
import { orderBy } from 'lodash';
import networkConnector from 'utils/networkConnector';

const useDisputeQuery = (
    marketAddress: string,
    dispute: number,
    positions: string[],
    networkId: NetworkId,
    options?: UseQueryOptions<DisputeData | undefined>
) => {
    return useQuery<DisputeData | undefined>(
        QUERY_KEYS.Dispute(marketAddress, dispute, networkId),
        async () => {
            const { thalesOracleCouncilContract } = networkConnector;
            if (thalesOracleCouncilContract) {
                const [
                    disputeVotes,
                    contractData,
                    isMarketClosedForDisputes,
                    isDisputeOpen,
                    isOpenDisputeCancelled,
                    disputeWinningPositionChoosen,
                    firstMemberThatChooseWinningPosition,
                    acceptResultVotesCount,
                ] = await Promise.all([
                    thalesData.exoticMarkets.disputeVotes({
                        market: marketAddress,
                        dispute: dispute,
                        network: networkId,
                    }),
                    thalesOracleCouncilContract.getDispute(marketAddress, dispute),
                    thalesOracleCouncilContract.isMarketClosedForDisputes(marketAddress),
                    thalesOracleCouncilContract.isDisputeOpen(marketAddress, dispute),
                    thalesOracleCouncilContract.isOpenDisputeCancelled(marketAddress, dispute),
                    thalesOracleCouncilContract.disputeWinningPositionChoosen(marketAddress, dispute),
                    thalesOracleCouncilContract.firstMemberThatChoseWinningPosition(marketAddress),
                    thalesOracleCouncilContract.disputeVotesCount(
                        marketAddress,
                        dispute,
                        DisputeVotingOption.ACCEPT_RESULT
                    ),
                ]);

                const [disputer, reasonForDispute, votedOption, timestamp, isInPositioningPhase] = contractData;

                const disputeContractData = {
                    disputer,
                    reasonForDispute,
                    votedOption: Number(votedOption),
                    timestamp: Number(timestamp),
                    isInPositioningPhase,
                    isMarketClosedForDisputes,
                    isOpenDisputeCancelled,
                    disputeWinningPositionChoosen: Number(disputeWinningPositionChoosen),
                    firstMemberThatChooseWinningPosition,
                    acceptResultVotesCount: Number(acceptResultVotesCount),
                };

                const disputeVotingOptions = isInPositioningPhase
                    ? DISPUTE_VOTING_OPTIONS_MARKET_OPEN
                    : DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED;

                const disputeVotingResults: DisputeVotingResults = [];
                disputeVotingOptions.forEach((votingOption) => {
                    const votingOptionVotes = disputeVotes.filter(
                        (disputeVote: DisputeVoteInfo) => disputeVote.vote === votingOption
                    );
                    const numberOfVotes = votingOptionVotes.length;

                    if (votingOption === DisputeVotingOption.ACCEPT_RESULT && numberOfVotes > 0) {
                        positions.forEach((_, index: number) => {
                            const votingOptionPositionNumberOfVotes = votingOptionVotes.filter(
                                (disputeVote: DisputeVoteInfo) => disputeVote.position === index
                            ).length;
                            if (votingOptionPositionNumberOfVotes) {
                                disputeVotingResults.push({
                                    votingOption,
                                    position: index,
                                    numberOfVotes: votingOptionPositionNumberOfVotes,
                                });
                            }
                        });
                    } else {
                        disputeVotingResults.push({
                            votingOption,
                            position: 0,
                            numberOfVotes,
                        });
                    }
                });

                const status = isOpenDisputeCancelled
                    ? DisputeStatus.Cancelled
                    : isDisputeOpen
                    ? DisputeStatus.Open
                    : DISPUTE_VOTED_OPTION_STATUS_MAP[disputeContractData.votedOption as DisputeVotingOption];

                const isOpenForVoting = !isMarketClosedForDisputes && isDisputeOpen && !isOpenDisputeCancelled;

                return {
                    disputeContractData,
                    disputeVotes,
                    disputeVotingResults: orderBy(disputeVotingResults, ['votingOption'], ['asc']),
                    status,
                    isOpenForVoting,
                };
            }
            return undefined;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useDisputeQuery;
