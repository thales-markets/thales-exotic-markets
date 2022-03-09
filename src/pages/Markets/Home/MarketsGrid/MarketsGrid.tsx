import SPAAnchor from 'components/SPAAnchor';
import React from 'react';
import styled from 'styled-components';
import { FlexDiv } from 'styles/common';
import { Markets } from 'types/markets';
import { buildMarketLink } from 'utils/routes';
import MarketCard from '../MarketCard';

type MarketsGridProps = {
    markets: Markets;
};

const MarketsGrid: React.FC<MarketsGridProps> = ({ markets }) => {
    return (
        <Container>
            {markets.map((market, index) => {
                return (
                    <SPAAnchor key={index} href={buildMarketLink(market.address)}>
                        <MarketCard market={market} />
                    </SPAAnchor>
                );
            })}
        </Container>
    );
};

const Container = styled(FlexDiv)`
    flex-wrap: wrap;
    max-width: 1220px;
    justify-content: center;
`;

export default MarketsGrid;
