import { DisputeStatus, DisputeVotingOption, MarketStatus } from 'constants/markets';

export type MarketInfo = {
    address: string;
    creator: string;
    creationTime: number;
    resolver: string;
    resolvedTime: number;
    question: string;
    dataSource: string;
    description: string;
    isTicketType: boolean;
    endOfPositioning: number;
    ticketPrice: number;
    isWithdrawalAllowed: boolean;
    positions: string[];
    tags: number[];
    isOpen: boolean;
    numberOfDisputes: number;
    numberOfOpenDisputes: number;
    status: MarketStatus;
    marketClosedForDisputes: boolean;
    isResolved: boolean;
    isCancelled: boolean;
    winningPosition: number;
    backstopTimeout: number;
    isPaused: boolean;
    isDisputed: boolean;
    isMarketClosedForDisputes: boolean;
    canMarketBeResolved: boolean;
    canUsersClaim: boolean;
    disputeClosedTime: number;
    claimTimeoutDefaultPeriod: number;
    poolSize: number;
    numberOfParticipants: number;
    noWinners: boolean;
    cancelledByCreator: boolean;
};

export type FixedMarketData = {
    winningAmountsNewUser: number[];
    winningAmountsNoPosition: number[];
    winningAmountPerTicket: number;
};

export type OpenBidMarketData = {
    roiPerPosition: number[];
};

export type MarketData = MarketInfo & {
    claimablePoolSize: number;
    poolSizePerPosition: number[];
    canUsersPlacePosition: boolean;
    canMarketBeResolvedByPDAO: boolean;
    disputePrice: number;
    canCreatorCancelMarket: boolean;
    fixedBondAmount: number;
    safeBoxLowAmount: number;
    arbitraryRewardForDisputor: number;
    creatorBond: number;
    creatorFee: number;
    resolverFee: number;
    safeBoxFee: number;
    totalFees: number;
    canIssueFees: boolean;
    withdrawalPeriod: number;
    fixedMarketData?: FixedMarketData;
    openBidMarketData?: OpenBidMarketData;
};

export type Markets = MarketInfo[];

export type AccountMarketData = {
    claimAmount: number;
    canClaim: boolean;
    canWithdraw: boolean;
    userAlreadyClaimedAmount: number;
    isPauserAddress: boolean;
};

export type AccountMarketTicketData = AccountMarketData & {
    position: number;
    winningAmount: number;
};

export type AccountMarketOpenBidData = AccountMarketData & {
    userPositions: number[];
};

export type SortOptionType = {
    id: number;
    title: string;
};

export type MarketsParameters = {
    fixedBondAmount: number;
    maximumPositionsAllowed: number;
    minimumPositioningDuration: number;
    creatorPercentage: number;
    resolverPercentage: number;
    safeBoxPercentage: number;
    withdrawalPercentage: number;
    disputePrice: number;
    paymentToken: string;
    creationRestrictedToOwner: boolean;
    owner: string;
    maxNumberOfTags: number;
    minFixedTicketPrice: number;
    maxFixedTicketPrice: number;
    disputeStringLengthLimit: number;
    marketQuestionStringLimit: number;
    marketSourceStringLimit: number;
    marketPositionStringLimit: number;
    openBidAllowed: boolean;
    maxAmountForOpenBidPosition: number;
};

export type TagInfo = {
    id: number;
    label: string;
};

export type Tags = TagInfo[];

export type DisputeInfo = {
    id: string;
    timestamp: number;
    creationDate: number;
    disputeNumber: number;
    market: string;
    disputer: string;
    reasonForDispute: string;
    isInPositioningPhase: boolean;
    disputeCode: number;
    status: DisputeStatus;
    statusSortingIndex: number;
    isOpenForVoting: boolean;
};

export type Disputes = DisputeInfo[];

export type DisputeContractData = {
    timestamp: number;
    disputer: string;
    votedOption: number;
    reasonForDispute: string;
    isInPositioningPhase: boolean;
    isMarketClosedForDisputes: boolean;
    isOpenDisputeCancelled: boolean;
    disputeWinningPositionChoosen: number;
    firstMemberThatChooseWinningPosition: string;
    acceptResultVotesCount: number;
};

export type DisputeVoteInfo = {
    id: string;
    timestamp: number;
    market: string;
    dispute: number;
    voter: string;
    vote: number;
    position: number;
};

export type DisputeVotes = DisputeVoteInfo[];

export type DisputeVotingResultInfo = {
    votingOption: DisputeVotingOption;
    position: number;
    numberOfVotes: number;
};

export type DisputeVotingResults = DisputeVotingResultInfo[];

export type DisputeData = {
    disputeContractData: DisputeContractData;
    disputeVotes: DisputeVotes;
    disputeVotingResults: DisputeVotingResults;
    status: DisputeStatus;
    isOpenForVoting: boolean;
};

export type AccountDisputeData = {
    canDisputorClaimbackBondFromUnclosedDispute: boolean;
};

export type AccountPosition = {
    market: string;
    position: number;
    positions: number[];
    isWithdrawn: boolean;
    isClaimed: boolean;
};

export type AccountPositions = AccountPosition[];

export type AccountPositionsMap = {
    [market: string]: AccountPosition;
};

export type MarketTransactionType =
    | 'bid'
    | 'changePosition'
    | 'withdrawal'
    | 'claim'
    | 'claimRefund'
    | 'resolveMarket'
    | 'resetMarketResult'
    | 'openDispute'
    | 'updatePositions';

export type MarketTransaction = {
    hash: string;
    type: MarketTransactionType;
    account: string;
    timestamp: number;
    amount: number | string;
    blockNumber: number;
    position: string;
    positions: number[];
    positionLabels: string[];
    isTicketType: boolean;
};

export type MarketTransactions = MarketTransaction[];
