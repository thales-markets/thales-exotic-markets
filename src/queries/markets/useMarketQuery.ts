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
                allMarketData,
                canUsersPlacePosition,
                canMarketBeResolved,
                canMarketBeResolvedByPDAO,
                canUsersClaim,
            ] = await Promise.all([
                contract.getAllMarketData(),
                contract.canUsersPlacePosition(),
                contract.canMarketBeResolved(),
                contract.canMarketBeResolvedByPDAO(),
                contract.canUsersClaim(),
            ]);

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
            ] = allMarketData;

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
                canUsersPlacePosition,
                canMarketBeResolved,
                canMarketBeResolvedByPDAO,
                canUsersClaim,
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
