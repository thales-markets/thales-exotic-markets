import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountPositions, AccountPositionsMap } from 'types/markets';
import thalesData from 'thales-data';
import { NetworkId } from 'types/network';
import { keyBy } from 'lodash';

const useAccountPositionsQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<AccountPositionsMap>
) => {
    return useQuery<AccountPositionsMap>(
        QUERY_KEYS.AccountPositions(walletAddress, networkId),
        async () => {
            const positions: AccountPositions = await thalesData.exoticMarkets.positions({
                account: walletAddress,
            });

            const positionsMap: AccountPositionsMap = keyBy(positions, 'market');

            return positionsMap;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useAccountPositionsQuery;
