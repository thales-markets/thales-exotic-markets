export type Market = {
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
};

export type Markets = Market[];

export type SortOptionType = {
    id: number;
    title: string;
};
