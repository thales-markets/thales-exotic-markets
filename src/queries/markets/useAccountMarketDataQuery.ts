import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountMarketData } from 'types/markets';
import { ethers } from 'ethers';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import networkConnector from 'utils/networkConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const useAccountMarketDataQuery = (
    marketAddress: string,
    walletAddress: string,
    options?: UseQueryOptions<AccountMarketData>
) => {
    return useQuery<AccountMarketData>(
        QUERY_KEYS.AccountMarketData(marketAddress, walletAddress),
        async () => {
            const marketData: AccountMarketData = {
                position: 0,
                claimAmount: 0,
                canClaim: false,
            };

            const { signer } = networkConnector;
            if (signer && walletAddress !== '') {
                const contractWithSigner = new ethers.Contract(marketAddress, marketContract.abi, signer);
                const [userPosition, claimAmount, canClaim] = await Promise.all([
                    contractWithSigner.userPosition(walletAddress),
                    contractWithSigner.getUserClaimableAmount(walletAddress),
                    contractWithSigner.canUserClaim(walletAddress),
                ]);
                marketData.position = Number(userPosition);
                marketData.claimAmount = bigNumberFormatter(claimAmount);
                marketData.canClaim = canClaim;
            }

            return marketData;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useAccountMarketDataQuery;
