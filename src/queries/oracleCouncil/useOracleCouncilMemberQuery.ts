import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';

const useOracleCouncilMemberQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<boolean>
) => {
    return useQuery<boolean>(
        QUERY_KEYS.OracleCouncilMember(walletAddress, networkId),
        async () => {
            const { thalesOracleCouncilContract } = networkConnector;
            if (thalesOracleCouncilContract) {
                const isOracleCouncilMember = await thalesOracleCouncilContract.isOracleCouncilMember(walletAddress);
                return isOracleCouncilMember;
            }
            return false;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useOracleCouncilMemberQuery;
