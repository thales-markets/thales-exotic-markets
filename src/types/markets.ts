export type Market = {
    address: string;
    title: string;
    maturityDate: number;
    options: string[];
    isOpen: boolean;
    tags: string[];
};

export type Markets = Market[];
