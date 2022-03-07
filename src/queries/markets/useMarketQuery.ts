import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import markets from 'mocks/markets.json';
import { MarketInfo } from 'types/markets';

const useMarketQuery = (marketAddress: string, options?: UseQueryOptions<MarketInfo | undefined>) => {
    return useQuery<MarketInfo | undefined>(
        QUERY_KEYS.Market(marketAddress),
        async () => {
            return markets.find((market) => market.address === marketAddress);
        },
        options
    );
};

export default useMarketQuery;
