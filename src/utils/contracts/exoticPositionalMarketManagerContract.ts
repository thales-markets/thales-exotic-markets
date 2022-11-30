export const exoticPositionalMarketManagerContract = {
    addresses: {
        10: '0x9a51524422DDF1B8AfEc04CBa6451a6c50320998',
        69: '0x6cEb96ABcAD1078af8D92A628628C75074E9E0b4',
        420: '0x42aE885508cc7155fbf747d5ACD8BAbDa1b5d9f0',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_exoticMarketMastercopy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_exoticMarketOpenBidMastercopy',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_oracleCouncilAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_paymentToken',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_tagsAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_theRundownConsumerAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_marketDataAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_exoticRewards',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: '_safeBoxAddress',
                    type: 'address',
                },
            ],
            name: 'AddressesUpdated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'minFixedTicketPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxFixedTicketPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'disputePrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fixedBondAmount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'safeBoxLowAmount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'arbitraryRewardForDisputor',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxAmountForOpenBidPosition',
                    type: 'uint256',
                },
            ],
            name: 'AmountsUpdated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'marketQuestion',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'marketSource',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'endOfPositioning',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fixedTicketPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'withdrawalAllowed',
                    type: 'bool',
                },
                {
                    indexed: false,
                    internalType: 'uint256[]',
                    name: 'tags',
                    type: 'uint256[]',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'positionCount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'string[]',
                    name: 'positionPhrases',
                    type: 'string[]',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketOwner',
                    type: 'address',
                },
            ],
            name: 'CLMarketCreated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'backstopTimeout',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'minimumPositioningDuration',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'withdrawalTimePeriod',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'pDAOResolveTimePeriod',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'claimTimeoutDefaultPeriod',
                    type: 'uint256',
                },
            ],
            name: 'DurationsUpdated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'bool',
                    name: '_creationRestrictedToOwner',
                    type: 'bool',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: '_openBidAllowed',
                    type: 'bool',
                },
            ],
            name: 'FlagsUpdated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'marketQuestionStringLimit',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'marketSourceStringLimit',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'marketPositionStringLimit',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'disputeStringLengthLimit',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maximumPositionsAllowed',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxNumberOfTags',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxOracleCouncilMembers',
                    type: 'uint256',
                },
            ],
            name: 'LimitsUpdated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketAddress',
                    type: 'address',
                },
            ],
            name: 'MarketCanceled',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'marketQuestion',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'marketSource',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'endOfPositioning',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fixedTicketPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'withdrawalAllowed',
                    type: 'bool',
                },
                {
                    indexed: false,
                    internalType: 'uint256[]',
                    name: 'tags',
                    type: 'uint256[]',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'positionCount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'string[]',
                    name: 'positionPhrases',
                    type: 'string[]',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketOwner',
                    type: 'address',
                },
            ],
            name: 'MarketCreated',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'marketQuestion',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'marketSource',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'string',
                    name: 'additionalInfo',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'endOfPositioning',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'fixedTicketPrice',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'withdrawalAllowed',
                    type: 'bool',
                },
                {
                    indexed: false,
                    internalType: 'uint256[]',
                    name: 'tags',
                    type: 'uint256[]',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'positionCount',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'string[]',
                    name: 'positionPhrases',
                    type: 'string[]',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketOwner',
                    type: 'address',
                },
            ],
            name: 'MarketCreatedWithDescription',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketAddress',
                    type: 'address',
                },
            ],
            name: 'MarketReset',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketAddress',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'outcomePosition',
                    type: 'uint256',
                },
            ],
            name: 'MarketResolved',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'thalesBondsAddress',
                    type: 'address',
                },
            ],
            name: 'NewThalesBonds',
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
                    name: 'pauserAddress',
                    type: 'address',
                },
            ],
            name: 'PauserAddressAdded',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'pauserAddress',
                    type: 'address',
                },
            ],
            name: 'PauserAddressRemoved',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'safeBoxPercentage',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'creatorPercentage',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'resolverPercentage',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'withdrawalPercentage',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'maxFinalWithdrawPercentage',
                    type: 'uint256',
                },
            ],
            name: 'PercentagesUpdated',
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
                    name: '_pauserAddress',
                    type: 'address',
                },
            ],
            name: 'addPauserAddress',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'arbitraryRewardForDisputor',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'backstopTimeout',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'backstopTimeoutGeneral',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketAddress',
                    type: 'address',
                },
            ],
            name: 'cancelMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'cancelledByCreator',
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
            inputs: [],
            name: 'claimTimeoutDefaultPeriod',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketAddress',
                    type: 'address',
                },
            ],
            name: 'closeDispute',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'string',
                    name: '_marketQuestion',
                    type: 'string',
                },
                {
                    internalType: 'string',
                    name: '_marketSource',
                    type: 'string',
                },
                {
                    internalType: 'string',
                    name: '_additionalInfo',
                    type: 'string',
                },
                {
                    internalType: 'uint256',
                    name: '_endOfPositioning',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_fixedTicketPrice',
                    type: 'uint256',
                },
                {
                    internalType: 'bool',
                    name: '_withdrawalAllowed',
                    type: 'bool',
                },
                {
                    internalType: 'uint256[]',
                    name: '_tags',
                    type: 'uint256[]',
                },
                {
                    internalType: 'uint256',
                    name: '_positionCount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256[]',
                    name: '_positionsOfCreator',
                    type: 'uint256[]',
                },
                {
                    internalType: 'string[]',
                    name: '_positionPhrases',
                    type: 'string[]',
                },
            ],
            name: 'createExoticMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'creationRestrictedToOwner',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'creatorAddress',
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
            name: 'creatorPercentage',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketAddress',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_disputor',
                    type: 'address',
                },
            ],
            name: 'disputeMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'disputePrice',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'disputeStringLengthLimit',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'exoticMarketMastercopy',
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
            name: 'exoticMarketOpenBidMastercopy',
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
            name: 'exoticRewards',
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
            name: 'fixedBondAmount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getActiveMarketAddress',
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
            ],
            name: 'initialize',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketAddress',
                    type: 'address',
                },
            ],
            name: 'isActiveMarket',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'isChainLinkMarket',
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
                    name: '_pauser',
                    type: 'address',
                },
            ],
            name: 'isPauserAddress',
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
                    name: '_marketAddress',
                    type: 'address',
                },
            ],
            name: 'issueBondsBackToCreatorAndResolver',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'marketDataAddress',
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
            name: 'marketPositionStringLimit',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'marketQuestionStringLimit',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'marketSourceStringLimit',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'maxAmountForOpenBidPosition',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'maxFinalWithdrawPercentage',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'maxFixedTicketPrice',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'maxNumberOfTags',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'maxOracleCouncilMembers',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'maximumPositionsAllowed',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'minFixedTicketPrice',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'minimumPositioningDuration',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
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
            name: 'numberOfActiveMarkets',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'openBidAllowed',
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
            inputs: [],
            name: 'oracleCouncilAddress',
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
            name: 'pDAOResolveTimePeriod',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
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
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'pauserAddress',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'pauserIndex',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'pausersCount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'paymentToken',
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
                    name: '_pauserAddress',
                    type: 'address',
                },
            ],
            name: 'removePauserAddress',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketAddress',
                    type: 'address',
                },
            ],
            name: 'resetMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketAddress',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_outcomePosition',
                    type: 'uint256',
                },
            ],
            name: 'resolveMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'resolverAddress',
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
            name: 'resolverPercentage',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'safeBoxAddress',
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
            name: 'safeBoxLowAmount',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'safeBoxPercentage',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_market',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_disputorAddress',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'sendRewardToDisputor',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_exoticMarketMastercopy',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_exoticMarketOpenBidMastercopy',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_oracleCouncilAddress',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_paymentToken',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_tagsAddress',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_theRundownConsumerAddress',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_marketDataAddress',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_exoticRewards',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_safeBoxAddress',
                    type: 'address',
                },
            ],
            name: 'setAddresses',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_minFixedTicketPrice',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxFixedTicketPrice',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_disputePrice',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_fixedBondAmount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_safeBoxLowAmount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_arbitraryRewardForDisputor',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxAmountForOpenBidPosition',
                    type: 'uint256',
                },
            ],
            name: 'setAmounts',
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
            name: 'setBackstopTimeout',
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
                {
                    internalType: 'uint256',
                    name: '_timeout',
                    type: 'uint256',
                },
            ],
            name: 'setCustomBackstopTimeout',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_backstopTimeout',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_minimumPositioningDuration',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_withdrawalTimePeriod',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_pDAOResolveTimePeriod',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_claimTimeoutDefaultPeriod',
                    type: 'uint256',
                },
            ],
            name: 'setDurations',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'bool',
                    name: '_creationRestrictedToOwner',
                    type: 'bool',
                },
                {
                    internalType: 'bool',
                    name: '_openBidAllowed',
                    type: 'bool',
                },
            ],
            name: 'setFlags',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'uint256',
                    name: '_marketQuestionStringLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_marketSourceStringLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_marketPositionStringLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_disputeStringLengthLimit',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maximumPositionsAllowed',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxNumberOfTags',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxOracleCouncilMembers',
                    type: 'uint256',
                },
            ],
            name: 'setLimits',
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
                    internalType: 'uint256',
                    name: '_safeBoxPercentage',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_creatorPercentage',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_resolverPercentage',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_withdrawalPercentage',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_maxFinalWithdrawPercentage',
                    type: 'uint256',
                },
            ],
            name: 'setPercentages',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_thalesBonds',
                    type: 'address',
                },
            ],
            name: 'setThalesBonds',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'tagsAddress',
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
            name: 'thalesBonds',
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
            name: 'theRundownConsumerAddress',
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
                    name: 'proxyAddress',
                    type: 'address',
                },
            ],
            name: 'transferOwnershipAtInit',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'withdrawalPercentage',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'withdrawalTimePeriod',
            outputs: [
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
    ],
};

export default exoticPositionalMarketManagerContract;
