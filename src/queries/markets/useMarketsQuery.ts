import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { Markets } from 'types/markets';
import { NetworkId } from 'types/network';
import thalesData from 'thales-data';

const useMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<Markets>) => {
    return useQuery<Markets>(
        QUERY_KEYS.Markets(networkId),
        async () => {
            const markets: Markets = await thalesData.exoticMarkets.markets({
                network: networkId,
            });
            return markets;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketsQuery;
