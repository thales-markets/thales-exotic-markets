import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/wallet';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';

const usePaymentTokenBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<number>
) => {
    return useQuery<number>(
        QUERY_KEYS.Wallet.PaymentTokenBalance(walletAddress, networkId),
        async () => {
            const { paymentTokenContract } = networkConnector;
            if (paymentTokenContract) {
                const balance = bigNumberFormatter(await paymentTokenContract.balanceOf(walletAddress));
                return balance < BALANCE_THRESHOLD ? 0 : balance;
            }
            return 0;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default usePaymentTokenBalanceQuery;
