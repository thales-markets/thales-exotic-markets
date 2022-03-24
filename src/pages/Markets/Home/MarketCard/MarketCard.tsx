import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import Tags from 'pages/Markets/components/Tags';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow } from 'styles/common';
import { AccountPosition, MarketInfo } from 'types/markets';
import { MarketStatus as MarketStatusEnum } from 'constants/markets';
import OpenDisputeInfo from 'pages/Markets/components/OpenDisputeInfo';

type MarketCardProps = {
    market: MarketInfo;
    accountPosition?: AccountPosition;
};

const MarketCard: React.FC<MarketCardProps> = ({ market, accountPosition }) => {
    const { t } = useTranslation();

    const isClaimAvailable =
        !!accountPosition &&
        market.canUsersClaim &&
        accountPosition.position > 0 &&
        (accountPosition.position === market.winningPosition || market.status === MarketStatusEnum.CancelledConfirmed);

    const showNumberOfOpenDisputes = !market.canUsersClaim;

    return (
        <Container isClaimAvailable={isClaimAvailable}>
            <MarketTitle>{market.question}</MarketTitle>
            <Positions>
                {market.positions.map((position: string, index: number) => (
                    <Position
                        key={`${position}${index}`}
                        className={
                            market.status === MarketStatusEnum.Open || market.winningPosition === index + 1
                                ? ''
                                : 'disabled'
                        }
                    >
                        {!!accountPosition && accountPosition.position === index + 1 && <Checkmark />}
                        <PositionLabel>{position}</PositionLabel>
                    </Position>
                ))}
            </Positions>
            <MarketStatus market={market} fontWeight={700} isClaimAvailable={isClaimAvailable} />
            <CardFooter>
                <Tags tags={market.tags} />
                {showNumberOfOpenDisputes && (
                    <OpenDisputeInfo
                        numberOfOpenDisputes={market.isMarketClosedForDisputes ? 0 : market.numberOfOpenDisputes}
                    >
                        {t('market.open-disputes-label')}
                    </OpenDisputeInfo>
                )}
            </CardFooter>
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)<{ isClaimAvailable: boolean }>`
    border: ${(props) => (props.isClaimAvailable ? 2 : 1)}px solid
        ${(props) => (props.isClaimAvailable ? props.theme.borderColor.secondary : props.theme.borderColor.primary)};
    box-sizing: border-box;
    border-radius: 25px;
    padding: 20px;
    margin: 8px 4px 8px 4px;
    &:hover {
        background: ${(props) => props.theme.background.secondary};
    }
`;

const Positions = styled(FlexDivColumnCentered)`
    margin-bottom: 20px;
    align-items: center;
    align-self: center;
    padding: 0 20px;
`;

const Position = styled.label`
    display: block;
    position: relative;
    margin-bottom: 20px;
    text-align: center;
    cursor: pointer;
    &.disabled {
        opacity: 0.4;
    }
`;

const PositionLabel = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
`;

const Checkmark = styled.span`
    :after {
        content: '';
        position: absolute;
        left: -17px;
        top: -1px;
        width: 5px;
        height: 14px;
        border: solid ${(props) => props.theme.borderColor.primary};
        border-width: 0 3px 3px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

const CardFooter = styled(FlexDivRow)`
    margin-top: 25px;
    align-items: end;
`;

export default MarketCard;
