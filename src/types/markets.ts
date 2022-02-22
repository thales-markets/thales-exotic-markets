export type Market = {
    title: string;
    maturityDate: number;
    options: string[];
    isOpen: boolean;
    tags: string[];
};

export type Markets = Market[];
