import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';

const useGetUsdDefaultAmountQuery = (networkId: NetworkId, options?: UseQueryOptions<number>) => {
    return useQuery<number>(
        QUERY_KEYS.Wallet.GetUsdDefaultAmount(networkId),
        async () => {
            const { exoticUsdContract } = networkConnector;
            if (exoticUsdContract) {
                return bigNumberFormatter(await exoticUsdContract.defaultAmount());
            }
            return 0;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useGetUsdDefaultAmountQuery;
