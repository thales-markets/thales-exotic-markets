import React, { FC, createContext, useContext } from 'react';
import { Market } from 'types/markets';

const MarketContext = createContext<Market | null>(null);

type MarketContextProps = {
    children: React.ReactNode;
    market: Market;
};

export const MarketProvider: FC<MarketContextProps> = ({ children, market }) => (
    <MarketContext.Provider value={market}>{children}</MarketContext.Provider>
);

export const useMarketContext = () => useContext(MarketContext) as Market;
