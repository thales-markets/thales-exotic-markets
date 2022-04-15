import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { DisputeInfo, Disputes } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';
import networkConnector from 'utils/networkConnector';
import {
    DisputeStatus,
    DisputeVotingOption,
    DISPUTE_STATUS_SORTING_MAP,
    DISPUTE_VOTED_OPTION_STATUS_MAP,
} from 'constants/markets';
import { orderBy } from 'lodash';

const useDisputesQuery = (
    marketAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<Disputes | undefined>
) => {
    return useQuery<Disputes | undefined>(
        QUERY_KEYS.Disputes(marketAddress, networkId),
        async () => {
            try {
                const { thalesOracleCouncilContract } = networkConnector;
                const [
                    disputes,
                    isMarketClosedForDisputes,
                    allOpenDisputesCancelledToIndexForMarket,
                ] = await Promise.all([
                    thalesData.exoticMarkets.disputes({
                        market: marketAddress,
                        network: networkId,
                    }),
                    thalesOracleCouncilContract?.isMarketClosedForDisputes(marketAddress),
                    thalesOracleCouncilContract?.allOpenDisputesCancelledToIndexForMarket(marketAddress),
                ]);

                const mappedDisputes = disputes.map((dispute: DisputeInfo) => {
                    const isOpenDisputeCancelled =
                        (isMarketClosedForDisputes ||
                            dispute.disputeNumber <= allOpenDisputesCancelledToIndexForMarket) &&
                        dispute.disputeCode === 0;
                    const isDisputeOpen = dispute.disputeCode === 0;

                    const status = isOpenDisputeCancelled
                        ? DisputeStatus.Cancelled
                        : isDisputeOpen
                        ? DisputeStatus.Open
                        : DISPUTE_VOTED_OPTION_STATUS_MAP[dispute.disputeCode as DisputeVotingOption];

                    dispute.status = status;
                    dispute.statusSortingIndex = DISPUTE_STATUS_SORTING_MAP[status];
                    dispute.isOpenForVoting = !isMarketClosedForDisputes && isDisputeOpen && !isOpenDisputeCancelled;

                    return dispute;
                });

                return orderBy(mappedDisputes, ['statusSortingIndex', 'creationDate'], ['asc', 'asc']);
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

export default useDisputesQuery;
