export type DisputeInfo = {
    id: string;
    timestamp: number;
    creationDate: number;
    market: string;
    disputor: string;
    reasonForDispute: string;
    status: string;
};

export type Disputes = DisputeInfo[];

export type MarketInfo = {
    address: string;
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
    isClaimAvailable: boolean;
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
};

export type Markets = MarketInfo[];

export type AccountMarketData = {
    position: number;
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
