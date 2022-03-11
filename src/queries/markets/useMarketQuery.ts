import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { MarketData } from 'types/markets';
import { BigNumberish, ethers } from 'ethers';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import networkConnector from 'utils/networkConnector';
import { bigNumberFormatter } from 'utils/formatters/ethers';

const useMarketQuery = (marketAddress: string, options?: UseQueryOptions<MarketData>) => {
    return useQuery<MarketData>(
        QUERY_KEYS.Market(marketAddress),
        async () => {
            const contract = new ethers.Contract(marketAddress, marketContract.abi, networkConnector.provider);
            const [
                question,
                dataSource,
                ticketType,
                endOfPositioning,
                ticketPrice,
                creationTime,
                isWithdrawalAllowed,
                hasOpenDisputes,
                isResolved,
                resolvedTime,
                positions,
                tags,
                poolSize,
                claimablePoolSize,
                poolSizePerPosition,
            ] = await contract.getAllMarketData();

            const market: MarketData = {
                address: marketAddress,
                question,
                dataSource,
                isTicketType: ticketType === 0,
                endOfPositioning: Number(endOfPositioning) * 1000,
                ticketPrice: bigNumberFormatter(ticketPrice),
                creationTime: Number(creationTime) * 1000,
                isWithdrawalAllowed,
                hasOpenDisputes,
                isResolved,
                resolvedTime: Number(resolvedTime) * 1000,
                positions,
                tags: tags.map((tag: BigNumberish) => Number(tag)),
                poolSize: bigNumberFormatter(poolSize),
                claimablePoolSize: bigNumberFormatter(claimablePoolSize),
                poolSizePerPosition: poolSizePerPosition.map((item: BigNumberish) => bigNumberFormatter(item)),
                isOpen: !isResolved,
                isClaimAvailable: false,
                numberOfDisputes: 0,
                numberOfOpenDisputes: 0,
            };

            return market;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketQuery;
