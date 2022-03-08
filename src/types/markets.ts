export type DisputeInfo = {
    address: string;
    reasonForDispute: string;
    status: string;
};

export type Disputes = DisputeInfo[];

export type MarketInfo = {
    address: string;
    title: string;
    maturityDate: number;
    positions: string[];
    isOpen: boolean;
    tags: string[];
    isClaimAvailable: boolean;
    numberOfOpenedDisputes: number;
    hasPosition: boolean;
    isTicketType: boolean;
    winningPosition: string | null;
    disputes?: Disputes;
};

export type Markets = MarketInfo[];

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
};
