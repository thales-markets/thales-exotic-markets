import TimeRemaining from 'components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import { Market } from 'types/markets';

type MarketStatusProps = {
    market: Market;
};

const MarketStatus: React.FC<MarketStatusProps> = ({ market }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <StatusLabel>{t(`market.${market.isOpen ? 'time-remaining-label' : 'status-label'}`)}:</StatusLabel>
            {market.isOpen ? (
                <TimeRemaining end={market.maturityDate} fontSize={25} />
            ) : (
                <Status>{t(`market.status.${market.isClaimAvailable ? 'claim-available' : 'maturity'}`)}</Status>
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)``;

const StatusLabel = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 4px;
`;

const Status = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export default MarketStatus;
