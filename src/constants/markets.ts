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
maxDate.setMonth(maxDate.getMonth() + 1);
export const DATE_PICKER_MAX_DATE = maxDate; // 1 month from now

export const MAXIMUM_INPUT_CHARACTERS = 100;

export enum DisputeVotingOption {
    ACCEPT_SLASH = 1,
    ACCEPT_NO_SLASH = 2,
    REFUSE_ON_POSITIONING = 3,
    ACCEPT_RESULT = 4,
    ACCEPT_RESET = 5,
    REFUSE_MATURE = 6,
}

export const DISPUTE_VOTING_OPTIONS_MARKET_OPEN = [
    DisputeVotingOption.ACCEPT_SLASH,
    DisputeVotingOption.ACCEPT_NO_SLASH,
    DisputeVotingOption.REFUSE_ON_POSITIONING,
];

export const DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED = [
    DisputeVotingOption.ACCEPT_RESULT,
    DisputeVotingOption.ACCEPT_RESET,
    DisputeVotingOption.REFUSE_MATURE,
];

export const DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS = {
    [DisputeVotingOption.ACCEPT_SLASH]: 'market.dispute.voting-option.accept-slash',
    [DisputeVotingOption.ACCEPT_NO_SLASH]: 'market.dispute.voting-option.accept-no-slash',
    [DisputeVotingOption.REFUSE_ON_POSITIONING]: 'market.dispute.voting-option.refuse-on-positioning',
    [DisputeVotingOption.ACCEPT_RESULT]: 'market.dispute.voting-option.accept-result',
    [DisputeVotingOption.ACCEPT_RESET]: 'market.dispute.voting-option.accept-reset',
    [DisputeVotingOption.REFUSE_MATURE]: 'market.dispute.voting-option.refuse-mature',
};
