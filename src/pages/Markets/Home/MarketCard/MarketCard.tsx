import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import OpenDisputeButton from 'pages/Markets/components/OpenDisputeButton';
import Tags from 'pages/Markets/components/Tags';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow, FlexDivColumn } from 'styles/common';
import { AccountPosition, MarketInfo } from 'types/markets';
import { buildOpenDisputeLink, navigateTo } from 'utils/routes';
import { MarketStatus as MarketStatusEnum } from 'constants/markets';

type MarketCardProps = {
    market: MarketInfo;
    accountPosition?: AccountPosition;
};

const MarketCard: React.FC<MarketCardProps> = ({ market, accountPosition }) => {
    const { t } = useTranslation();

    const isClaimAvailable =
        market.canUsersClaim &&
        !!accountPosition &&
        (accountPosition.position === market.winningPosition ||
            (accountPosition.position > 0 && market.status === MarketStatusEnum.CancelledConfirmed));

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
            <MarketStatus market={market} />
            <CardFooter>
                <Tags tags={market.tags} />
                <ButtonsContainer>
                    <OpenDisputeButton
                        numberOfOpenDisputes={market.numberOfOpenDisputes}
                        onClick={(e: any) => {
                            e.preventDefault();
                            navigateTo(buildOpenDisputeLink(market.address));
                        }}
                    >
                        {t('market.button.open-dispute-label')}
                    </OpenDisputeButton>
                </ButtonsContainer>
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
    margin: 7.5px;
    &:hover {
        background: ${(props) => props.theme.background.secondary};
    }
`;

const Positions = styled(FlexDivColumnCentered)`
    margin-bottom: 25px;
    align-items: start;
    align-self: center;
    padding: 0 20px;
`;

const Position = styled.label`
    display: block;
    position: relative;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const PositionLabel = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 27px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Checkmark = styled.span`
    :after {
        content: '';
        position: absolute;
        left: -17px;
        top: 3px;
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
`;

const ButtonsContainer = styled(FlexDivColumn)`
    align-items: end;
    button {
        &:first-child {
            margin-bottom: 4px;
        }
    }
`;

export default MarketCard;
