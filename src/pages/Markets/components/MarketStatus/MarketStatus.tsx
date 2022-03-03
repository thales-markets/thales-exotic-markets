import TimeRemaining from 'components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import { Market } from 'types/markets';

type MarketStatusProps = {
    market: Market;
    fontSize?: number;
    labelFontSize?: number;
};

const MarketStatus: React.FC<MarketStatusProps> = ({ market, fontSize, labelFontSize }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <StatusLabel labelFontSize={labelFontSize}>
                {t(`market.${market.isOpen ? 'time-remaining-label' : 'status-label'}`)}:
            </StatusLabel>
            {market.isOpen ? (
                <TimeRemaining end={market.maturityDate} fontSize={fontSize || 25} />
            ) : (
                <Status fontSize={fontSize}>
                    {t(`market.status.${market.isClaimAvailable ? 'claim-available' : 'maturity'}`)}
                </Status>
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)``;

const StatusLabel = styled.span<{ labelFontSize?: number }>`
    font-style: normal;
    font-weight: normal;
    font-size: ${(props) => props.labelFontSize || 15}px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 4px;
`;

const Status = styled.span<{ fontSize?: number }>`
    font-style: normal;
    font-weight: normal;
    font-size: ${(props) => props.fontSize || 25}px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export default MarketStatus;
