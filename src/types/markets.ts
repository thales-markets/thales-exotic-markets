export type Market = {
    address: string;
    title: string;
    maturityDate: number;
    options: string[];
    isOpen: boolean;
    tags: string[];
    isClaimAvailable: boolean;
    numberOfOpenedDisputes: number;
    hasPosition: boolean;
};

export type Markets = Market[];
