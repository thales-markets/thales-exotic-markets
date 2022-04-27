import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';

const useOracleCouncilMemberQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<boolean | undefined>
) => {
    return useQuery<boolean | undefined>(
        QUERY_KEYS.OracleCouncilMember(walletAddress, networkId),
        async () => {
            try {
                const { thalesOracleCouncilContract } = networkConnector;
                if (thalesOracleCouncilContract) {
                    const isOracleCouncilMember = await thalesOracleCouncilContract.isOracleCouncilMember(
                        walletAddress
                    );
                    return isOracleCouncilMember;
                }
                return false;
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

export default useOracleCouncilMemberQuery;
