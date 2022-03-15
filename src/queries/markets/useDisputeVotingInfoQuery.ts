import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { DisputeVotes, DisputeVotingInfo, DisputeVotingResults } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';
import { DISPUTE_VOTING_OPTIONS_MARKET_OPEN, DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED } from 'constants/markets';
import { orderBy } from 'lodash';

const useDisputeVotingInfoQuery = (
    marketAddress: string,
    dispute: number,
    isInPositioningPhase: boolean,
    networkId: NetworkId,
    options?: UseQueryOptions<DisputeVotingInfo>
) => {
    return useQuery<DisputeVotingInfo>(
        QUERY_KEYS.DisputeVotingInfo(marketAddress, dispute, networkId),
        async () => {
            const disputeVotes: DisputeVotes = await thalesData.exoticMarkets.disputeVotes({
                market: marketAddress,
                dispute: dispute,
                network: networkId,
            });

            const disputeVotingOptions = isInPositioningPhase
                ? DISPUTE_VOTING_OPTIONS_MARKET_OPEN
                : DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED;

            const disputeVotingResults: DisputeVotingResults = [];
            disputeVotingOptions.forEach((votingOption) => {
                const numberOfVotes = disputeVotes.filter((disputeVote) => disputeVote.vote === votingOption).length;
                disputeVotingResults.push({
                    votingOption,
                    numberOfVotes,
                });
            });

            return {
                disputeVotes,
                disputeVotingResults: orderBy(disputeVotingResults, ['numberOfVotes', 'votingOption'], ['desc', 'asc']),
            };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useDisputeVotingInfoQuery;
