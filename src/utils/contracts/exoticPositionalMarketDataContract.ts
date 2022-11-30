export const exoticPositionalMarketDataContract = {
    addresses: {
        10: '0x7B3241C61889185188E3B444abEf7298fAe6B1E1',
        69: '0x6fb9914e1777f4c034b2813cdc035682ea62df0c',
        420: '0x2f1e736F41E494ED2C73b40ceFc659c5A4D0f194',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_marketManagerAddress',
                    type: 'address',
                },
            ],
            name: 'NewMarketManagerAddress',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'oldOwner',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerChanged',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'newOwner',
                    type: 'address',
                },
            ],
            name: 'OwnerNominated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Paused',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
            ],
            name: 'Unpaused',
            type: 'event',
        },
        {
            inputs: [],
            name: 'acceptOwnership',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_market',
                    type: 'address',
                },
            ],
            name: 'getAllMarketData',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'string',
                            name: 'marketQuestion',
                            type: 'string',
                        },
                        {
                            internalType: 'string',
                            name: 'marketSource',
                            type: 'string',
                        },
                        {
                            internalType: 'uint256',
                            name: 'ticketType',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'endOfPositioning',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'fixedTicketPrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'creationTime',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'withdrawalAllowed',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'disputed',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'resolved',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint256',
                            name: 'resolvedTime',
                            type: 'uint256',
                        },
                        {
                            internalType: 'string[]',
                            name: 'positionPhrasesList',
                            type: 'string[]',
                        },
                        {
                            internalType: 'uint256[]',
                            name: 'tags',
                            type: 'uint256[]',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalPlacedAmount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalClaimableAmount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256[]',
                            name: 'amountsPerPosition',
                            type: 'uint256[]',
                        },
                        {
                            internalType: 'bool',
                            name: 'canUsersPlacePosition',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'canMarketBeResolved',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'canMarketBeResolvedByPDAO',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'canUsersClaim',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'isCancelled',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'paused',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint256',
                            name: 'winningPosition',
                            type: 'uint256',
                        },
                        {
                            internalType: 'address',
                            name: 'creatorAddress',
                            type: 'address',
                        },
                        {
                            internalType: 'address',
                            name: 'resolverAddress',
                            type: 'address',
                        },
                        {
                            internalType: 'uint256',
                            name: 'fixedBondAmount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'disputePrice',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'safeBoxLowAmount',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'arbitraryRewardForDisputor',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'backstopTimeout',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'disputeClosedTime',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'canCreatorCancelMarket',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalUsersTakenPositions',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'noWinners',
                            type: 'bool',
                        },
                        {
                            internalType: 'bool',
                            name: 'canIssueFees',
                            type: 'bool',
                        },
                        {
                            internalType: 'uint256',
                            name: 'creatorFee',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'resolverFee',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'safeBoxFee',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'totalFee',
                            type: 'uint256',
                        },
                    ],
                    internalType: 'struct ExoticPositionalMarketData.MarketData',
                    name: '',
                    type: 'tuple',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'initNonReentrant',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_marketManagerAddress',
                    type: 'address',
                },
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'marketManagerAddress',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'nominateNewOwner',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'nominatedOwner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'owner',
            outputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'paused',
            outputs: [
                {
                    internalType: 'bool',
                    name: '',
                    type: 'bool',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketManagerAddress',
                    type: 'address',
                },
            ],
            name: 'setMarketManager',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_owner',
                    type: 'address',
                },
            ],
            name: 'setOwner',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: 'proxyAddress',
                    type: 'address',
                },
            ],
            name: 'transferOwnershipAtInit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};

export default exoticPositionalMarketDataContract;
