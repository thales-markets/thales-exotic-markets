export const thalesOracleCouncilContract = {
    addresses: {
        10: '0xDF3eefC2ED0F31947a67f0e817DfD92717630E38',
        69: '0x61118647A361CBaFE9119D5d7e08Be5026A20dC4',
        420: '0x385ac1100d82B88467e0Cdc375c15AC2239a795C',
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
                    name: 'disputeIndex',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'decidedOption',
                    type: 'uint256',
                },
            ],
            name: 'DisputeClosed',
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
                    internalType: 'uint256',
                    name: 'disputeFinalCode',
                    type: 'uint256',
                },
            ],
            name: 'MarketClosedForDisputes',
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
            ],
            name: 'MarketReopenedForDisputes',
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
                    internalType: 'string',
                    name: 'disputeString',
                    type: 'string',
                },
                {
                    indexed: false,
                    internalType: 'bool',
                    name: 'disputeInPositioningPhase',
                    type: 'bool',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'disputorAccount',
                    type: 'address',
                },
            ],
            name: 'NewDispute',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'marketManager',
                    type: 'address',
                },
            ],
            name: 'NewMarketManager',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'councilMember',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'councilMemberCount',
                    type: 'uint256',
                },
            ],
            name: 'NewOracleCouncilMember',
            type: 'event',
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'councilMember',
                    type: 'address',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'councilMemberCount',
                    type: 'uint256',
                },
            ],
            name: 'OracleCouncilMemberRemoved',
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
                    name: 'disputeIndex',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'disputeCodeVote',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'uint256',
                    name: 'winningPosition',
                    type: 'uint256',
                },
                {
                    indexed: false,
                    internalType: 'address',
                    name: 'voter',
                    type: 'address',
                },
            ],
            name: 'VotedAddedForDispute',
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
                    name: '_councilMember',
                    type: 'address',
                },
            ],
            name: 'addOracleCouncilMember',
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
            name: 'allOpenDisputesCancelledToIndexForMarket',
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
                    internalType: 'uint256',
                    name: '_disputeIndex',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '_disputorAddress',
                    type: 'address',
                },
            ],
            name: 'canDisputorClaimbackBondFromUnclosedDispute',
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
            ],
            name: 'canMarketBeDisputed',
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
                    internalType: 'uint256',
                    name: '_disputeIndex',
                    type: 'uint256',
                },
            ],
            name: 'claimUnclosedDisputeBonds',
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
            name: 'closeMarketForDisputes',
            outputs: [],
            stateMutability: 'nonpayable',
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
            name: 'councilMemberAddress',
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
            name: 'councilMemberCount',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'councilMemberIndex',
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
                    name: '',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'dispute',
            outputs: [
                {
                    internalType: 'address',
                    name: 'disputorAddress',
                    type: 'address',
                },
                {
                    internalType: 'string',
                    name: 'disputeString',
                    type: 'string',
                },
                {
                    internalType: 'uint256',
                    name: 'disputeCode',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: 'disputeTimestamp',
                    type: 'uint256',
                },
                {
                    internalType: 'bool',
                    name: 'disputeInPositioningPhase',
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
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'disputeVote',
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
                    name: '',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'disputeVotesCount',
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
                    name: '',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'disputeWinningPositionChoosen',
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
                    name: '',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '',
                    type: 'address',
                },
            ],
            name: 'disputeWinningPositionChoosenByMember',
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
                    name: '',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '',
                    type: 'uint256',
                },
            ],
            name: 'disputeWinningPositionVotes',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'firstMemberThatChoseWinningPosition',
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
                {
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getDispute',
            outputs: [
                {
                    components: [
                        {
                            internalType: 'address',
                            name: 'disputorAddress',
                            type: 'address',
                        },
                        {
                            internalType: 'string',
                            name: 'disputeString',
                            type: 'string',
                        },
                        {
                            internalType: 'uint256',
                            name: 'disputeCode',
                            type: 'uint256',
                        },
                        {
                            internalType: 'uint256',
                            name: 'disputeTimestamp',
                            type: 'uint256',
                        },
                        {
                            internalType: 'bool',
                            name: 'disputeInPositioningPhase',
                            type: 'bool',
                        },
                    ],
                    internalType: 'struct ThalesOracleCouncil.Dispute',
                    name: '',
                    type: 'tuple',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getDisputeAddressOfDisputor',
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
                {
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getDisputeCode',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getDisputeString',
            outputs: [
                {
                    internalType: 'string',
                    name: '',
                    type: 'string',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getDisputeTimestamp',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
                {
                    internalType: 'address',
                    name: '_councilMember',
                    type: 'address',
                },
            ],
            name: 'getDisputeVoteOfCouncilMember',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getDisputeVotes',
            outputs: [
                {
                    internalType: 'uint256[]',
                    name: '',
                    type: 'uint256[]',
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
            name: 'getMarketLastClosedDispute',
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
            name: 'getMarketOpenDisputes',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getNumberOfCouncilMembersForMarketDispute',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getVotesCountForMarketDispute',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'getVotesMissingForMarketDispute',
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
                {
                    internalType: 'address',
                    name: '_marketManager',
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
                {
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'isDisputeCancelled',
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
                    internalType: 'uint256',
                    name: '_index',
                    type: 'uint256',
                },
            ],
            name: 'isDisputeOpen',
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
            ],
            name: 'isMarketClosedForDisputes',
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
                    internalType: 'uint256',
                    name: '_disputeIndex',
                    type: 'uint256',
                },
            ],
            name: 'isOpenDisputeCancelled',
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
                    name: '_councilMember',
                    type: 'address',
                },
            ],
            name: 'isOracleCouncilMember',
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
            name: 'marketClosedForDisputes',
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
            name: 'marketLastClosedDispute',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'marketOpenDisputesCount',
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
                    name: '',
                    type: 'address',
                },
            ],
            name: 'marketTotalDisputes',
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
            inputs: [
                {
                    internalType: 'address',
                    name: '_market',
                    type: 'address',
                },
                {
                    internalType: 'string',
                    name: '_disputeString',
                    type: 'string',
                },
            ],
            name: 'openDispute',
            outputs: [],
            stateMutability: 'nonpayable',
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
                    name: '_councilMember',
                    type: 'address',
                },
            ],
            name: 'removeOracleCouncilMember',
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
            name: 'reopenMarketForDisputes',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_marketManager',
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
        {
            inputs: [
                {
                    internalType: 'address',
                    name: '_market',
                    type: 'address',
                },
                {
                    internalType: 'uint256',
                    name: '_disputeIndex',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_disputeCodeVote',
                    type: 'uint256',
                },
                {
                    internalType: 'uint256',
                    name: '_winningPosition',
                    type: 'uint256',
                },
            ],
            name: 'voteForDispute',
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
        },
    ],
};

export default thalesOracleCouncilContract;
