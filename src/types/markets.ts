import { DisputeStatus, DisputeVotingOption, MarketStatus } from 'constants/markets';

export type MarketInfo = {
    address: string;
    creator: string;
    question: string;
    dataSource: string;
    endOfPositioning: number;
    ticketPrice: number;
    isWithdrawalAllowed: boolean;
    positions: string[];
    tags: number[];
    isOpen: boolean;
    numberOfDisputes: number;
    numberOfOpenDisputes: number;
};

export type MarketData = MarketInfo & {
    creationTime: number;
    resolvedTime: number;
    hasOpenDisputes: boolean;
    isResolved: boolean;
    poolSize: number;
    claimablePoolSize: number;
    poolSizePerPosition: number[];
    isTicketType: boolean;
    canUsersPlacePosition: boolean;
    canMarketBeResolved: boolean;
    canMarketBeResolvedByPDAO: boolean;
    canUsersClaim: boolean;
    isCancelled: boolean;
    paused: boolean;
    winningPosition: number;
    resolver: boolean;
    status: MarketStatus;
};

export type Markets = MarketInfo[];

export type AccountMarketData = {
    position: number;
    claimAmount: number;
    canClaim: boolean;
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
};

export type Disputes = DisputeInfo[];

export type DisputeContractData = {
    timestamp: number;
    disputer: string;
    votedOption: number;
    reasonForDispute: string;
    isInPositioningPhase: boolean;
    canMarketBeDisputed: boolean;
    isOpenDisputeCancelled: boolean;
};

export type DisputeVoteInfo = {
    id: string;
    timestamp: number;
    market: string;
    dispute: number;
    voter: string;
    vote: number;
};

export type DisputeVotes = DisputeVoteInfo[];

export type DisputeVotingResultInfo = {
    votingOption: DisputeVotingOption;
    numberOfVotes: number;
};

export type DisputeVotingResults = DisputeVotingResultInfo[];

export type DisputeData = {
    disputeContractData: DisputeContractData;
    disputeVotes: DisputeVotes;
    disputeVotingResults: DisputeVotingResults;
    status: DisputeStatus;
};
