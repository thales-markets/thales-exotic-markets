import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';
import { MarketsParameters } from 'types/markets';
import { MAXIMUM_POSITIONS, MAXIMUM_TAGS, MINIMUM_TICKET_PRICE } from 'constants/markets';

const useMarketsParametersQuery = (networkId: NetworkId, options?: UseQueryOptions<MarketsParameters>) => {
    return useQuery<MarketsParameters>(
        QUERY_KEYS.MarketsParameters(networkId),
        async () => {
            const marketsParameters: MarketsParameters = {
                fixedBondAmount: 0,
                maximumPositionsAllowed: MAXIMUM_POSITIONS,
                minimumPositioningDuration: 0,
                creatorPercentage: 0,
                resolverPercentage: 0,
                safeBoxPercentage: 0,
                withdrawalPercentage: 0,
                disputePrice: 0,
                paymentToken: '',
                creationRestrictedToOwner: false,
                owner: '',
                maxNumberOfTags: MAXIMUM_TAGS,
                minFixedTicketPrice: MINIMUM_TICKET_PRICE,
            };
            const marketManagerContract = networkConnector.marketManagerContract;
            if (marketManagerContract) {
                const [
                    fixedBondAmount,
                    maximumPositionsAllowed,
                    minimumPositioningDuration,
                    creatorPercentage,
                    resolverPercentage,
                    safeBoxPercentage,
                    withdrawalPercentage,
                    disputePrice,
                    paymentToken,
                    creationRestrictedToOwner,
                    owner,
                    maxNumberOfTags,
                    minFixedTicketPrice,
                ] = await Promise.all([
                    marketManagerContract.fixedBondAmount(),
                    marketManagerContract.maximumPositionsAllowed(),
                    marketManagerContract.minimumPositioningDuration(),
                    marketManagerContract.creatorPercentage(),
                    marketManagerContract.resolverPercentage(),
                    marketManagerContract.safeBoxPercentage(),
                    marketManagerContract.withdrawalPercentage(),
                    marketManagerContract.disputePrice(),
                    marketManagerContract.paymentToken(),
                    marketManagerContract.creationRestrictedToOwner(),
                    marketManagerContract.owner(),
                    marketManagerContract.maxNumberOfTags(),
                    marketManagerContract.minFixedTicketPrice(),
                ]);

                marketsParameters.fixedBondAmount = bigNumberFormatter(fixedBondAmount);
                marketsParameters.maximumPositionsAllowed = Number(maximumPositionsAllowed);
                marketsParameters.minimumPositioningDuration = Number(minimumPositioningDuration);
                marketsParameters.creatorPercentage = Number(creatorPercentage);
                marketsParameters.resolverPercentage = Number(resolverPercentage);
                marketsParameters.safeBoxPercentage = Number(safeBoxPercentage);
                marketsParameters.withdrawalPercentage = Number(withdrawalPercentage);
                marketsParameters.disputePrice = bigNumberFormatter(disputePrice);
                marketsParameters.paymentToken = paymentToken;
                marketsParameters.creationRestrictedToOwner = creationRestrictedToOwner;
                marketsParameters.owner = owner;
                marketsParameters.maxNumberOfTags = Number(maxNumberOfTags);
                marketsParameters.minFixedTicketPrice = bigNumberFormatter(minFixedTicketPrice);
            }

            return marketsParameters;
        },
        {
            refetchInterval: 5000,
            ...options,
        }
    );
};

export default useMarketsParametersQuery;
