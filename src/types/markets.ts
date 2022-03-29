import { DisputeStatus, DisputeVotingOption, MarketStatus } from 'constants/markets';

export type MarketInfo = {
    address: string;
    creator: string;
    creationTime: number;
    resolver: string;
    resolvedTime: number;
    question: string;
    dataSource: string;
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
    noWinner: boolean;
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
    winningAmountsNewUser: number[];
    winningAmountsNoPosition: number[];
    totalUsersTakenPositions: number;
    winningAmountPerTicket: number;
};

export type Markets = MarketInfo[];

export type AccountMarketData = {
    position: number;
    claimAmount: number;
    canClaim: boolean;
    winningAmount: number;
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
    isWithdrawn: boolean;
    isClaimed: boolean;
};

export type AccountPositions = AccountPosition[];

export type AccountPositionsMap = {
    [market: string]: AccountPosition;
};
