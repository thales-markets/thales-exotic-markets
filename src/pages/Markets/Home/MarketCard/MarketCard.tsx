import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import Tags from 'pages/Markets/components/Tags';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Colors, FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, FlexDivRow } from 'styles/common';
import { AccountPosition, MarketInfo } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { DEFAULT_CURRENCY_DECIMALS, PAYMENT_CURRENCY } from 'constants/currency';
import { Info, InfoContent, InfoLabel } from 'components/common';
import { isClaimAvailable, isPositionAvailable } from 'utils/markets';
import { MarketStatus as MarketStatusEnum } from 'constants/markets';

type MarketCardProps = {
    market: MarketInfo;
    accountPosition?: AccountPosition;
};

const MarketCard: React.FC<MarketCardProps> = ({ market, accountPosition }) => {
    const { t } = useTranslation();

    const claimAvailable = isClaimAvailable(market, accountPosition);
    const positionAvailable = isPositionAvailable(market, accountPosition);

    const getColor = () => {
        if (claimAvailable) {
            return Colors.PURPLE;
        }
        if (positionAvailable) {
            return Colors.PINK;
        }
        if (market.status === MarketStatusEnum.ResolvedConfirmed) {
            return Colors.GREY;
        }
        return Colors.PURPLE;
    };
    const color = getColor();

    const getHighlightColor = () => {
        if (claimAvailable) {
            return Colors.PURPLE;
        }
        return Colors.WHITE;
    };
    const highlightColor = getHighlightColor();

    const getHighlightBackgroundColor = () => {
        if (claimAvailable) {
            return Colors.GREEN;
        }
        if (positionAvailable) {
            return Colors.PINK;
        }
        if (market.status === MarketStatusEnum.ResolvedConfirmed) {
            return Colors.GREY;
        }
        return Colors.WHITE;
    };
    const highlightBackgroundColor = getHighlightBackgroundColor();

    const getHighlightText = () => {
        if (claimAvailable) {
            return t('market.claimable-markets-label');
        }
        if (positionAvailable) {
            return t('market.positioned-markets-label');
        }
        if (market.status === MarketStatusEnum.ResolvedConfirmed) {
            return t('market.resolved-markets-label');
        }
        return '';
    };

    const hasHighlight = claimAvailable || positionAvailable || market.status === MarketStatusEnum.ResolvedConfirmed;

    return (
        <Container isClaimAvailable={claimAvailable} color={color}>
            {hasHighlight && (
                <HighlightContainer
                    color={highlightColor}
                    backgroundColor={highlightBackgroundColor}
                    className="highlight"
                >
                    {getHighlightText()}
                </HighlightContainer>
            )}
            <TopContainer color={color}>
                <TagsContainer>
                    <Tags
                        tags={market.tags}
                        color={hasHighlight ? color : undefined}
                        hideLabel
                        paintTags={!hasHighlight}
                    />
                </TagsContainer>
                <MarketTitle fontSize={18}>{market.question}</MarketTitle>
                {market.status === MarketStatusEnum.ResolvedConfirmed ? (
                    <WinningPositionContainer>
                        <WinningPositionLabel>{t('market.winnings-position-label')}:</WinningPositionLabel>
                        <WinningPosition>{market.positions[market.winningPosition - 1]}</WinningPosition>
                    </WinningPositionContainer>
                ) : (
                    <MarketStatus market={market} fontWeight={700} fontSize={18} isClaimAvailable={claimAvailable} />
                )}
            </TopContainer>
            <BottomContainer>
                <PoolInfo color={color}>
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
                <Info fontSize={15}>
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

const Container = styled(FlexDivColumnCentered)<{ isClaimAvailable: boolean; color: string }>`
    border: none;
    box-sizing: border-box;
    border-radius: 25px;
    margin: 8px 4px 8px 4px;
    background: ${(props) => props.theme.background.tertiary};
    color: ${(props) => props.color};
    &:hover {
        background: ${(props) => props.theme.background.secondary};
        border-color: transparent;
        background-origin: border-box;
        color: ${(props) => props.theme.textColor.primary};
        box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
        div {
            border-color: ${(props) => props.theme.borderColor.primary};
        }
        .tag {
            background: transparent;
            color: ${(props) => props.theme.textColor.primary};
        }
        .highlight {
            background: transparent;
            color: ${(props) => props.theme.textColor.primary};
        }
    }
    align-items: center;
    overflow: hidden;
`;

const HighlightContainer = styled(FlexDivCentered)<{ color: string; backgroundColor: string }>`
    height: 28px;
    color: ${(props) => props.color};
    background: ${(props) => props.backgroundColor};
    width: 100%;
    font-weight: 700;
    font-size: 18px;
    line-height: 100%;
    text-align: center;
    text-transform: uppercase;
`;

const TopContainer = styled(FlexDivColumnCentered)<{ color: string }>`
    padding: 20px;
    align-items: center;
    width: 100%;
    border-bottom: 3px dashed ${(props) => props.color};
`;

const BottomContainer = styled(FlexDivColumnCentered)`
    padding: 20px;
    align-items: center;
    width: 100%;
`;

const TagsContainer = styled(FlexDivRow)`
    margin-bottom: 30px;
    > div {
        justify-content: center;
    }
`;

const PoolInfo = styled(FlexDivColumnCentered)<{ color: string }>`
    font-size: 15px;
    padding: 8px 20px;
    border: 2px solid ${(props) => props.color};
    border-radius: 15px;
    width: fit-content;
    margin-bottom: 20px;
`;

const WinningPositionContainer = styled(FlexDivColumn)``;

const WinningPositionLabel = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 4px;
`;

const WinningPosition = styled.span`
    font-style: normal;
    font-size: 20px;
    font-weight: 700;
    line-height: 100%;
    text-align: center;
`;

export default MarketCard;
