import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivEnd } from 'styles/common';
import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import OpenDisputeButton from 'pages/Markets/components/OpenDisputeButton';
import Tags from 'pages/Markets/components/Tags';
import { MarketData } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import SPAAnchor from 'components/SPAAnchor';
import { buildOpenDisputeLink } from 'utils/routes';
import MaturityPhase from './MaturityPhase';
import PositioningPhase from './PositioningPhase';

type MarketDetailsProps = {
    market: MarketData;
};

const MarketDetails: React.FC<MarketDetailsProps> = ({ market }) => {
    const { t } = useTranslation();

    return (
        <MarketContainer>
            <MarketTitle fontSize={40}>{market.question}</MarketTitle>
            {market.isOpen && <PositioningPhase market={market} />}
            {!market.isOpen && <MaturityPhase market={market} />}
            <MarketStatus market={market} fontSize={40} labelFontSize={20} fontWeight={700} />
            <Footer>
                <Tags tags={market.tags} labelFontSize={20} />
                <Info fontSize={20}>
                    <InfoLabel>{t('market.total-pool-size-label')}:</InfoLabel>
                    <InfoContent>
                        {formatCurrencyWithKey(PAYMENT_CURRENCY, market.poolSize, DEFAULT_CURRENCY_DECIMALS, true)}
                    </InfoContent>
                </Info>
                <FooterButtonsContainer>
                    <SPAAnchor href={buildOpenDisputeLink(market.address)}>
                        <OpenDisputeButton numberOfOpenDisputes={0}>
                            {t('market.button.open-dispute-label')}
                        </OpenDisputeButton>
                    </SPAAnchor>
                </FooterButtonsContainer>
            </Footer>
        </MarketContainer>
    );
};

const MarketContainer = styled(FlexDivColumn)`
    margin-top: 40px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 25px;
    width: 100%;
    padding: 40px 40px 30px 40px;
    background: ${(props) => props.theme.background.secondary};
    flex: initial;
`;

const Info = styled(FlexDivCentered)<{ fontSize?: number }>`
    font-style: normal;
    font-weight: 300;
    font-size: ${(props) => props.fontSize || 25}px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;

const InfoLabel = styled.span`
    margin-right: 6px;
`;

const InfoContent = styled.span`
    font-weight: 700;
`;

const Footer = styled(FlexDivRow)`
    margin-top: 25px;
    > div {
        width: 33%;
    }
    @media (max-width: 767px) {
        > div {
            width: 100%;
            margin-top: 10px;
            justify-content: center;
        }
        flex-direction: column;
    }
`;

const FooterButtonsContainer = styled(FlexDivEnd)`
    align-items: center;
    @media (max-width: 767px) {
        justify-content: center;
    }
`;

export default MarketDetails;
