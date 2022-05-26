import { MarketStatus } from 'constants/markets';
import { AccountPosition, MarketInfo } from 'types/markets';

export const getRoi = (investment: number, potentialWinnings: number, showRoi: boolean) => {
    const roi = showRoi ? (potentialWinnings - investment) / investment : 0;
    return roi > 0 ? roi : 0;
};

export const isClaimAvailable = (market: MarketInfo, accountPosition?: AccountPosition) =>
    !market.isPaused &&
    !!accountPosition &&
    market.canUsersClaim &&
    ((market.isTicketType &&
        accountPosition.position > 0 &&
        (accountPosition.position === market.winningPosition ||
            market.status === MarketStatus.CancelledConfirmed ||
            market.noWinners)) ||
        (!market.isTicketType &&
            accountPosition.positions.some((position) => position > 0) &&
            ((market.winningPosition > 0 && accountPosition.positions[market.winningPosition - 1] > 0) ||
                market.status === MarketStatus.CancelledConfirmed ||
                market.noWinners)));

export const isPositionAvailable = (market: MarketInfo, accountPosition?: AccountPosition) =>
    !!accountPosition &&
    ((market.isTicketType && accountPosition.position > 0) ||
        (!market.isTicketType && accountPosition.positions.some((position) => position > 0))) &&
    market.status !== MarketStatus.ResolvedConfirmed &&
    market.status !== MarketStatus.CancelledConfirmed;

export const isPositionAvailableForPositioning = (market: MarketInfo, accountPosition?: AccountPosition) =>
    (!accountPosition ||
        (market.isTicketType && accountPosition.position === 0) ||
        (!market.isTicketType && accountPosition.positions.every((position) => position === 0))) &&
    market.status === MarketStatus.Open;

export const getMarketStatus = (market: MarketInfo) => {
    if (market.isPaused) {
        return MarketStatus.Paused;
    } else {
        if (market.isResolved) {
            if (market.winningPosition === 0) {
                if (market.isDisputed && market.numberOfOpenDisputes > 0) {
                    return MarketStatus.CancelledDisputed;
                } else {
                    if (market.canUsersClaim || market.cancelledByCreator) {
                        return MarketStatus.CancelledConfirmed;
                    } else {
                        return MarketStatus.CancelledPendingConfirmation;
                    }
                }
            } else {
                if (market.isDisputed) {
                    return MarketStatus.ResolvedDisputed;
                } else {
                    if (market.canUsersClaim) {
                        return MarketStatus.ResolvedConfirmed;
                    } else {
                        return MarketStatus.ResolvedPendingConfirmation;
                    }
                }
            }
        } else {
            if (market.canMarketBeResolved) {
                return MarketStatus.ResolvePending;
            } else {
                if (market.isDisputed && Date.now() > market.endOfPositioning) {
                    return MarketStatus.ResolvePendingDisputed;
                } else {
                    return MarketStatus.Open;
                }
            }
        }
    }
};

export const getOpenBidPositionsString = (positionLabels: string[], positionAmounts: number[]) => {
    return positionLabels.filter((_, index: number) => positionAmounts[index] > 0).join(', ');
};

export const isValidHttpsUrl = (text: string) => {
    let url;

    try {
        url = new URL(text);
    } catch (_) {
        return false;
    }

    return url.protocol === 'https:';
};
