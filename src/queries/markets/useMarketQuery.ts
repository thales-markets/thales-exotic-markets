import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketInfo, Markets } from 'types/markets';
import thalesData from 'thales-data';

const useMarketQuery = (marketAddress: string, options?: UseQueryOptions<MarketInfo | undefined>) => {
    return useQuery<MarketInfo | undefined>(
        QUERY_KEYS.Market(marketAddress),
        async () => {
            const markets: Markets = await thalesData.exoticMarkets.markets({
                network: 69,
            });
            return markets.find((market) => market.address === marketAddress);
        },
        options
    );
};

export default useMarketQuery;
