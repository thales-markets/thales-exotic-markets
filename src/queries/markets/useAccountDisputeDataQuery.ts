import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountDisputeData } from 'types/markets';
import networkConnector from 'utils/networkConnector';

const useAccountDisputeDataQuery = (
    marketAddress: string,
    dispute: number,
    walletAddress: string,
    options?: UseQueryOptions<AccountDisputeData | undefined>
) => {
    return useQuery<AccountDisputeData | undefined>(
        QUERY_KEYS.AccountDisputeData(marketAddress, dispute, walletAddress),
        async () => {
            try {
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

export default useAccountDisputeDataQuery;
