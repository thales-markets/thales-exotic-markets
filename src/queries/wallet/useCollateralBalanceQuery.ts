import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import { bigNumberFormatterWithDecimals } from 'utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/wallet';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';
import { AVAILABLE_COLLATERALS } from 'constants/tokens';
import { ethers } from 'ethers';
import erc20Contract from 'utils/contracts/erc20Abi';

const useCollateralBalanceQuery = (
    walletAddress: string,
    networkId: NetworkId,
    options?: UseQueryOptions<Array<number>>
) => {
    return useQuery<Array<number>>(
        QUERY_KEYS.Wallet.CollateralBalance(walletAddress, networkId),
        async () => {
            const { signer } = networkConnector;

            const result = await Promise.all(
                AVAILABLE_COLLATERALS.map(async (token) => {
                    const contract = new ethers.Contract(token.address, erc20Contract.abi, signer);

                    const balance = bigNumberFormatterWithDecimals(
                        await contract.balanceOf(walletAddress),
                        token.decimals
                    );
                    return balance < BALANCE_THRESHOLD ? 0 : balance;
                })
            );

            console.log(result);

            return result;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useCollateralBalanceQuery;
