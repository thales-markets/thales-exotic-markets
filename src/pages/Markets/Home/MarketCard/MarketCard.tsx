import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import Tags from 'pages/Markets/components/Tags';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow } from 'styles/common';
import { AccountPosition, MarketInfo } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { DEFAULT_CURRENCY_DECIMALS, PAYMENT_CURRENCY } from 'constants/currency';
import { Info, InfoContent, InfoLabel } from 'components/common';
import { isClaimAvailable } from 'utils/markets';

type MarketCardProps = {
    market: MarketInfo;
    accountPosition?: AccountPosition;
};

const MarketCard: React.FC<MarketCardProps> = ({ market, accountPosition }) => {
    const { t } = useTranslation();

    const claimAvailable = isClaimAvailable(market, accountPosition);

    return (
        <Container isClaimAvailable={claimAvailable}>
            <TopContainer>
                <TagsContainer>
                    <Tags tags={market.tags} hideLabel />
                </TagsContainer>
                <MarketTitle>{market.question}</MarketTitle>
                <MarketStatus market={market} fontWeight={700} isClaimAvailable={claimAvailable} />
            </TopContainer>
            <BottomContainer>
                <PoolInfo>
                    <Info>
                        <InfoLabel>{t('market.total-pool-size-label')}:</InfoLabel>
                        <InfoContent>
                            {formatCurrencyWithKey(PAYMENT_CURRENCY, market.poolSize, DEFAULT_CURRENCY_DECIMALS, true)}
                        </InfoContent>
                    </Info>
                    <Info>
                        <InfoLabel>{t('market.number-of-participants-label')}:</InfoLabel>
                        <InfoContent>{market.numberOfParticipants}</InfoContent>
                    </Info>
                </PoolInfo>
                <Info fontSize={18}>
                    {market.isTicketType ? (
                        <>
                            <InfoLabel>{t('market.ticket-price-label')}:</InfoLabel>
                            <InfoContent>
                                {formatCurrencyWithKey(
                                    PAYMENT_CURRENCY,
                                    market.ticketPrice,
                                    DEFAULT_CURRENCY_DECIMALS,
                                    true
                                )}
                            </InfoContent>
                        </>
                    ) : (
                        <InfoContent>{t('market.open-bid-label')}</InfoContent>
                    )}
                </Info>
            </BottomContainer>
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)<{ isClaimAvailable: boolean }>`
    border: ${(props) => (props.isClaimAvailable ? 2 : 1)}px solid
        ${(props) => (props.isClaimAvailable ? props.theme.borderColor.secondary : props.theme.borderColor.primary)};
    box-sizing: border-box;
    border-radius: 25px;
    margin: 8px 4px 8px 4px;
    background: ${(props) => props.theme.background.tertiary};
    color: ${(props) => props.theme.textColor.tertiary};
    &:hover {
        background: ${(props) => props.theme.background.secondary};
        border-color: transparent;
        background-origin: border-box;
        color: ${(props) => props.theme.textColor.primary};
        div {
            border-color: ${(props) => props.theme.borderColor.primary};
        }
        box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    }
    align-items: center;
`;

const TopContainer = styled(FlexDivColumnCentered)`
    padding: 20px;
    align-items: center;
    border-bottom: 3px dashed ${(props) => props.theme.borderColor.tertiary};
`;

const BottomContainer = styled(FlexDivColumnCentered)`
    padding: 20px;
    align-items: center;
`;

const TagsContainer = styled(FlexDivRow)`
    margin-bottom: 30px;
`;

const PoolInfo = styled(FlexDivColumnCentered)`
    font-size: 15px;
    padding: 10px 25px;
    border: 2px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 15px;
    width: fit-content;
    margin-bottom: 20px;
`;

export default MarketCard;
