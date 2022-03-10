import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketDetails } from 'types/markets';
import thalesData from 'thales-data';
import { ethers } from 'ethers';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import networkConnector from 'utils/networkConnector';

const useMarketQuery = (
    marketAddress: string,
    walletAddress: string,
    options?: UseQueryOptions<MarketDetails | undefined>
) => {
    return useQuery<MarketDetails | undefined>(
        QUERY_KEYS.Market(marketAddress, walletAddress),
        async () => {
            const markets = await thalesData.exoticMarkets.markets({
                network: 69,
            });
            let market: MarketDetails | undefined = markets.find((market: any) => market.address === marketAddress);

            if (!market) return undefined;

            market.isTicketType = market.ticketPrice > 0;
            market.hasPosition = false;

            const contract = new ethers.Contract(marketAddress, marketContract.abi, networkConnector.provider);

            console.log(await contract.getAllMarketData());
            const { signer } = networkConnector;
            if (signer && walletAddress !== '') {
                const contractWithSigner = contract.connect(signer);
                const [userPosition] = await Promise.all([contractWithSigner.userPosition(walletAddress)]);
                market = {
                    ...market,
                    position: Number(userPosition),
                    hasPosition: Number(userPosition) > 0,
                };
            }

            return market;
        },
        options
    );
};

export default useMarketQuery;
