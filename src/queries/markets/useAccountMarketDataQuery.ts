import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { AccountMarketData } from 'types/markets';
import { ethers } from 'ethers';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import networkConnector from 'utils/networkConnector';

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
                hasPosition: false,
            };

            const { signer } = networkConnector;
            if (signer && walletAddress !== '') {
                const contractWithSigner = new ethers.Contract(marketAddress, marketContract.abi, signer);
                const [userPosition] = await Promise.all([contractWithSigner.userPosition(walletAddress)]);
                marketData.position = Number(userPosition);
                marketData.hasPosition = Number(userPosition) > 0;
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
