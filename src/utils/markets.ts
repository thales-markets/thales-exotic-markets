import { MarketStatus } from 'constants/markets';
import { AccountPosition, MarketInfo } from 'types/markets';

export const getRoi = (ticketPrice: number, potentialWinnings: number, showRoi: boolean) =>
    showRoi ? (potentialWinnings - ticketPrice) / ticketPrice : 0;

export const isClaimAvailable = (market: MarketInfo, accountPosition?: AccountPosition) =>
    !!accountPosition &&
    market.canUsersClaim &&
    accountPosition.position > 0 &&
    (accountPosition.position === market.winningPosition ||
        market.status === MarketStatus.CancelledConfirmed ||
        market.noWinner);
