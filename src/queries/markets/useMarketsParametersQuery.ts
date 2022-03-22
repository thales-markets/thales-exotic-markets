import { useQuery, UseQueryOptions } from 'react-query';
import QUERY_KEYS from 'constants/queryKeys';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import networkConnector from 'utils/networkConnector';
import { NetworkId } from 'types/network';
import { MarketsParameters } from 'types/markets';

const useMarketsParametersQuery = (networkId: NetworkId, options?: UseQueryOptions<MarketsParameters>) => {
    return useQuery<MarketsParameters>(
        QUERY_KEYS.MarketsParameters(networkId),
        async () => {
            const marketsParameters: MarketsParameters = {
                fixedBondAmount: 0,
                maximumPositionsAllowed: 0,
                minimumPositioningDuration: 0,
                creatorPercentage: 0,
                resolverPercentage: 0,
                safeBoxPercentage: 0,
                withdrawalPercentage: 0,
                disputePrice: 0,
                paymentToken: '',
                creationRestrictedToOwner: false,
                owner: '',
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
                ]);

                marketsParameters.fixedBondAmount = bigNumberFormatter(fixedBondAmount);
                marketsParameters.maximumPositionsAllowed = Number(maximumPositionsAllowed);
                marketsParameters.minimumPositioningDuration = Number(minimumPositioningDuration);
                marketsParameters.creatorPercentage = Number(creatorPercentage);
                marketsParameters.resolverPercentage = Number(resolverPercentage);
                marketsParameters.safeBoxPercentage = Number(safeBoxPercentage);
                marketsParameters.withdrawalPercentage = Number(withdrawalPercentage);
                marketsParameters.disputePrice = Number(disputePrice);
                marketsParameters.paymentToken = paymentToken;
                marketsParameters.creationRestrictedToOwner = creationRestrictedToOwner;
                marketsParameters.owner = owner;
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
