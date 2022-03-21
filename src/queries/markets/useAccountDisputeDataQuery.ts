import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountDisputeData } from 'types/markets';
import networkConnector from 'utils/networkConnector';

const useAccountDisputeDataQuery = (
    marketAddress: string,
    dispute: number,
    walletAddress: string,
    options?: UseQueryOptions<AccountDisputeData>
) => {
    return useQuery<AccountDisputeData>(
        QUERY_KEYS.AccountDisputeData(marketAddress, dispute, walletAddress),
        async () => {
            const { thalesOracleCouncilContract } = networkConnector;
            if (thalesOracleCouncilContract) {
                const [canDisputorClaimbackBondFromUnclosedDispute] = await Promise.all([
                    thalesOracleCouncilContract.canDisputorClaimbackBondFromUnclosedDispute(
                        marketAddress,
                        dispute,
                        walletAddress
                    ),
                ]);
                return {
                    canDisputorClaimbackBondFromUnclosedDispute,
                };
            }
            return { canDisputorClaimbackBondFromUnclosedDispute: false };
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useAccountDisputeDataQuery;
