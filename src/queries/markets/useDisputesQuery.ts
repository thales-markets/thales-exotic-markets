import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Disputes } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';

const useDisputesQuery = (marketAddress: string, networkId: NetworkId, options?: UseQueryOptions<Disputes>) => {
    return useQuery<Disputes>(
        QUERY_KEYS.Disputes(marketAddress, networkId),
        async () => {
            const disputes: Disputes = await thalesData.exoticMarkets.disputes({
                market: marketAddress,
                network: networkId,
            });
            return disputes;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useDisputesQuery;
