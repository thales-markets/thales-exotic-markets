export type DisputeInfo = {
    address: string;
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
    isClaimAvailable: boolean;
    // numberOfOpenedDisputes: number;
    // hasPosition: boolean;
    // isTicketType: boolean;
    // winningPosition: string | null;
    // disputes?: Disputes;
};

export type MarketDetails = MarketInfo & {
    hasPosition: boolean;
    position?: number;
    isTicketType: boolean;
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

export type TagInfo = {
    id: number;
    label: string;
};

export type Tags = TagInfo[];
