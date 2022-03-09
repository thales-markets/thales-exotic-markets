import Button from 'components/Button';
import SPAAnchor from 'components/SPAAnchor';
import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import OpenDisputeButton from 'pages/Markets/components/OpenDisputeButton';
import Tags from 'pages/Markets/components/Tags';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow, FlexDivColumn } from 'styles/common';
import { MarketInfo } from 'types/markets';
import { buildOpenDisputeLink } from 'utils/routes';

type MarketCardProps = {
    market: MarketInfo;
};

const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
    const { t } = useTranslation();

    return (
        <Container isClaimAvailable={market.isClaimAvailable}>
            <MarketTitle>{market.question}</MarketTitle>
            <Positions>
                {market.positions.map((position: string) => (
                    <Position key={position}>{position}</Position>
                ))}
            </Positions>
            <MarketStatus market={market} />
            <CardFooter>
                <Tags tags={market.tags} />
                <ButtonsContainer>
                    {market.isClaimAvailable && <Button>{t('market.button.claim-label')}</Button>}
                    <SPAAnchor href={buildOpenDisputeLink(market.address)}>
                        <OpenDisputeButton numberOfOpenedDisputes={0}>
                            {t('market.button.open-dispute-label')}
                        </OpenDisputeButton>
                    </SPAAnchor>
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
    width: 390px;
    padding: 20px;
    margin: 7.5px;
    &:hover {
        background: ${(props) => props.theme.background.secondary};
    }
`;

const Positions = styled(FlexDivColumnCentered)`
    margin-bottom: 25px;
`;

const Position = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 27px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
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
