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
                    canMarketBeDisputed,
                    isDisputeOpen,
                    isOpenDisputeCancelled,
                ] = await Promise.all([
                    thalesData.exoticMarkets.disputeVotes({
                        market: marketAddress,
                        dispute: dispute,
                        network: networkId,
                    }),
                    thalesOracleCouncilContract.getDispute(marketAddress, dispute),
                    thalesOracleCouncilContract.canMarketBeDisputed(marketAddress),
                    thalesOracleCouncilContract.isDisputeOpen(marketAddress, dispute),
                    thalesOracleCouncilContract.isOpenDisputeCancelled(marketAddress, dispute),
                ]);

                const [disputer, reasonForDispute, votedOption, timestamp, isInPositioningPhase] = contractData;

                const disputeContractData = {
                    disputer,
                    reasonForDispute,
                    votedOption: Number(votedOption),
                    timestamp: Number(timestamp),
                    isInPositioningPhase,
                    canMarketBeDisputed,
                    isOpenDisputeCancelled,
                };

                const disputeVotingOptions = isInPositioningPhase
                    ? DISPUTE_VOTING_OPTIONS_MARKET_OPEN
                    : DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED;

                const disputeVotingResults: DisputeVotingResults = [];
                disputeVotingOptions.forEach((votingOption) => {
                    const numberOfVotes = disputeVotes.filter(
                        (disputeVote: DisputeVoteInfo) => disputeVote.vote === votingOption
                    ).length;
                    disputeVotingResults.push({
                        votingOption,
                        numberOfVotes,
                    });
                });

                const status = isOpenDisputeCancelled
                    ? DisputeStatus.Cancelled
                    : isDisputeOpen
                    ? DisputeStatus.Open
                    : DISPUTE_VOTED_OPTION_STATUS_MAP[disputeContractData.votedOption as DisputeVotingOption];

                return {
                    disputeContractData,
                    disputeVotes,
                    disputeVotingResults: orderBy(
                        disputeVotingResults,
                        ['numberOfVotes', 'votingOption'],
                        ['desc', 'asc']
                    ),
                    status,
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
