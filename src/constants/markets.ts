export enum TagFilterEnum {
    All = 'All',
    Sports = 'Sports',
    NFL = 'NFL',
    NBA = 'NBA',
    Football = 'Football',
    Dummy = 'Dummy',
    Test = 'Test',
    Crypto = 'Crypto',
    DeFi = 'DeFi',
    Basketball = 'Basketball',
    ETH = 'ETH',
    OP = 'OP',
    Thales = 'Thales',
}

export enum GlobalFilterEnum {
    All = 'All',
    Disputed = 'Disputed',
    YourPositions = 'YourPositions',
    Claim = 'Claim',
    History = 'History',
}

export enum SortDirection {
    NONE,
    ASC,
    DESC,
}

export const DEFAULT_SORT_BY = 1;

export enum MarketType {
    TICKET,
    OPEN_BID,
}
