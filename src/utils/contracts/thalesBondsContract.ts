export const thalesBondsContract = {
    addresses: {
        10: '0x160Ca569999601bca06109D42d561D85D6Bb4b57',
        69: '0xFA58e022acD77EE4f373b508c8265000A4f22994',
        420: '0xc1B3523a8AbF8D01CD19730Ab9F09de23C257B6B',
    },
    abi: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'BondTransferredFromCreatorToResolver',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'account',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'BondTransferredFromMarketBondToUser',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'creator',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'CreatorBondSent',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'disputor',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'DisputorBondSent',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'managerAddress',
                    type: 'address',
                },
            ],
            name: 'NewManagerAddress',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'oracleCouncil',
                    type: 'address',
                },
            ],
            name: 'NewOracleCouncilAddress',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'stakingThales',
                    type: 'address',
                },
            ],
            name: 'NewStakingThalesAddress',
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
                    name: 'market',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'resolver',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'amount',
                    type: 'uint256',
                },
            ],
            name: 'ResolverBondSent',
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
            inputs: [],
            name: 'curveOnrampEnabled',
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
            name: 'curveSUSD',
            outputs: [
                {
                    internalType: 'contract ICurveSUSD',
                    name: '',
                    type: 'address',
                },
            ],
            stateMutability: 'view',
            type: 'function',
        },
        {
            inputs: [],
            name: 'dai',
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
                    name: '_market',
                    type: 'address',
                },
            ],
            name: 'getClaimableBondAmountForMarket',
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
            ],
            name: 'getClaimedBondAmountForMarket',
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
            ],
            name: 'getCreatorBondForMarket',
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
                    name: 'amount',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'collateral',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: 'toSUSD',
                    type: 'bool',
                },
            ],
            name: 'getCurveQuoteForDifferentCollateral',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'collateralQuote',
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
            ],
            name: 'getDisputorBondForMarket',
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
            ],
            name: 'getResolverBondForMarket',
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
            ],
            name: 'getTotalDepositedBondAmountForMarket',
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
                    name: '_market',
                    type: 'address',
                },
            ],
            name: 'issueBondsBackToCreatorAndResolver',
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
            name: 'marketBond',
            outputs: [
                {
                    internalType: 'uint256',
                    name: 'totalDepositedMarketBond',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'totalMarketBond',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'creatorBond',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'resolverBond',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'disputorsTotalBond',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'disputorsCount',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'marketFunds',
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
            name: 'marketManager',
            outputs: [
                {
                    internalType: 'contract IExoticPositionalMarketManager',
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
                    name: '_market',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_bondToReduce',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '_disputorAddress',
                    type: 'address',
                },
            ],
            name: 'sendBondFromMarketToUser',
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
                    internalType: 'address',
                    name: '_creatorAddress',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'sendCreatorBondToMarket',
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
            name: 'sendDisputorBondToMarket',
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
                    internalType: 'address',
                    name: '_account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'sendOpenDisputeBondFromMarketToDisputor',
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
                    internalType: 'address',
                    name: '_resolverAddress',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'sendResolverBondToMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_curveSUSD',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_dai',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_usdc',
                    type: 'address',
                },
                {
                    internalType: 'address',
                    name: '_usdt',
                    type: 'address',
                },
                {
                    internalType: 'bool',
                    name: '_curveOnrampEnabled',
                    type: 'bool',
                },
            ],
            name: 'setCurveSUSD',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_managerAddress',
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
                    name: '_stakingThales',
                    type: 'address',
                },
            ],
            name: 'setStakingThalesContract',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'stakingThales',
            outputs: [
                {
                    internalType: 'contract IStakingThales',
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
                    name: '_market',
                    type: 'address',
                },
            ],
            name: 'transferCreatorToResolverBonds',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'transferFromMarket',
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
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: 'collateral',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: 'expectedPayout',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'additionalSlippage',
                    type: 'uint256',
                },
            ],
            name: 'transferToMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_account',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_amount',
                    type: 'uint256',
                },
            ],
            name: 'transferToMarket',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [],
            name: 'usdc',
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
            name: 'usdt',
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
    ],
};

export default thalesBondsContract;
