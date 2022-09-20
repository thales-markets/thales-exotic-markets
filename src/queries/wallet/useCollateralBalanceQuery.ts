import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from '../../constants/queryKeys';
import { bigNumberFormatterWithDecimals } from 'utils/formatters/ethers';
import { BALANCE_THRESHOLD } from 'constants/wallet';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';
import { AVAILABLE_COLLATERALS } from 'constants/tokens';
import { ethers } from 'ethers';
import erc20Contract from 'utils/contracts/erc20Abi';

type Balances = {
    susd: number;
    dai: number;
    usdc: number;
    usdt: number;
};

const useCollateralBalanceQuery = (walletAddress: string, networkId: NetworkId, options?: UseQueryOptions<any>) => {
    return useQuery<any>(
        QUERY_KEYS.Wallet.CollateralBalance(walletAddress, networkId),
        async () => {
            const { signer } = networkConnector;

            const results = await Promise.all(
                AVAILABLE_COLLATERALS.map(async (token) => {
                    const contract = new ethers.Contract(token.address, erc20Contract.abi, signer);

                    const balance = bigNumberFormatterWithDecimals(
                        await contract.balanceOf(walletAddress),
                        token.decimals
                    );
                    return balance < BALANCE_THRESHOLD ? 0 : balance;
                })
            );

            const result: Balances = {
                susd: results[0],
                dai: results[1],
                usdc: results[2],
                usdt: results[3],
            };

            return result;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useCollateralBalanceQuery;
