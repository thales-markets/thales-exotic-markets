import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import markets from 'mocks/markets.json';
import { Markets } from 'types/markets';
import { NetworkId } from 'types/network';

const useMarketsQuery = (networkId: NetworkId, options?: UseQueryOptions<Markets>) => {
    return useQuery<Markets>(
        QUERY_KEYS.Markets(networkId),
        async () => {
            return markets;
        },
        options
    );
};

export default useMarketsQuery;
