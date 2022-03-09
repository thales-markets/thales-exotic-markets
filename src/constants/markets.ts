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

export enum MarketType {
    TICKET,
    OPEN_BID,
}

export const DEFAULT_SORT_BY = 1;

export const DEFAULT_POSITIONING_DURATION = 10 * 24 * 60 * 60 * 1000; // 10 days

export const MINIMUM_POSITIONS = 2;
export const MAXIMUM_POSITIONS = 5;
export const MAXIMUM_TAGS = 5;

export const TODAYS_DATE = new Date();
export const DATE_PICKER_MIN_DATE = TODAYS_DATE; // today's date

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() + 2);
export const DATE_PICKER_MAX_DATE = maxDate; // 2 years from now

export const MAXIMUM_INPUT_CHARACTERS = 100;

export enum DisputeStatus {
    Open = 'open',
    Refused = 'refused',
    Accepted = 'accepted',
    AcceptedSlashed = 'accepted-slashed',
}
