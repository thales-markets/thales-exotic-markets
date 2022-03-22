export const getRoi = (ticketPrice: number, potentialWinnings: number) =>
    potentialWinnings > 0 ? (potentialWinnings - ticketPrice) / ticketPrice : 0;
