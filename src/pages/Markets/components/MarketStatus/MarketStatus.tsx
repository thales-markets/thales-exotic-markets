import TimeRemaining from 'components/TimeRemaining';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { MarketInfo } from 'types/markets';
import { MarketStatus as MarketStatusEnum } from 'constants/markets';

type MarketStatusProps = {
    market: MarketInfo;
    fontSize?: number;
    fontWeight?: number;
    labelFontSize?: number;
};

const MarketStatus: React.FC<MarketStatusProps> = ({ market, fontSize, fontWeight, labelFontSize }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <StatusLabel labelFontSize={labelFontSize}>
                {t(`market.${status === MarketStatusEnum.Open ? 'time-remaining-label' : 'status-label'}`)}:
            </StatusLabel>
            {market.status === MarketStatusEnum.Open ? (
                <TimeRemaining end={market.endOfPositioning} fontSize={fontSize} fontWeight={fontWeight} />
            ) : (
                <Status fontSize={fontSize}>
                    {/* {t(`market.status.${market.isClaimAvailable ? 'claim-available' : 'maturity'}`)} */}
                    {t(`market.status.${market.status.toString()}`)}
                </Status>
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)``;

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
