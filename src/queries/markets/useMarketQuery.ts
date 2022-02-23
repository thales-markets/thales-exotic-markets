import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import markets from 'mocks/markets.json';
import { Market } from 'types/markets';

const useMarketQuery = (marketAddress: string, options?: UseQueryOptions<Market | undefined>) => {
    return useQuery<Market | undefined>(
        QUERY_KEYS.Market(marketAddress),
        async () => {
            return markets.find((market) => market.address === marketAddress);
        },
        options
    );
};

export default useMarketQuery;
