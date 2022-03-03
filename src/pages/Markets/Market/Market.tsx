import Button from 'components/Button';
import Checkbox from 'components/fields/Checkbox';
import SimpleLoader from 'components/SimpleLoader';
import useMarketQuery from 'queries/markets/useMarketQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered, FlexDivRow, FlexDivRowCentered } from 'styles/common';
import MarketStatus from '../components/MarketStatus';
import MarketTitle from '../components/MarketTitle';
import OpenDisputeButton from '../components/OpenDisputeButton';
import Tags from '../components/Tags';
import { Market as MarketInfo } from 'types/markets';

type MarketProps = RouteComponentProps<{
    marketAddress: string;
}>;

const Market: React.FC<MarketProps> = (props) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const { params } = props.match;
    const address = params && params.marketAddress ? params.marketAddress : '';

    const marketQuery = useMarketQuery(address, {
        enabled: isAppReady && address !== '',
    });

    const market: MarketInfo | undefined = useMemo(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            return marketQuery.data as MarketInfo;
        }
        return undefined;
    }, [marketQuery.isSuccess, marketQuery.data]);

    // const showTicketBuy = market && market.isOpen && market.isTicketType && !market.hasPosition;
    // const showTicketWithdraw = market && market.isOpen && market.isTicketType && market.hasPosition;
    // const showTicketInfo = market && market.isOpen && market.isTicketType;

    return (
        <Container>
            {market ? (
                <>
                    <MarketTitle fontSize={40}>{market.title}</MarketTitle>
                    <Positions>
                        {market.positions.map((position: string, index: number) => (
                            <Checkbox
                                key={position}
                                checked={index === 0}
                                value={index === 0 ? 'true' : 'false'}
                                onChange={() => {}}
                                label={position}
                            />
                        ))}
                    </Positions>
                    <TicketInfo>Ticket price 30 sUSD</TicketInfo>
                    <Button type="secondary">{t('market.button.claim-label')}</Button>
                    <MarketStatus market={market} fontSize={40} labelFontSize={20} />
                    <Footer>
                        <Tags tags={market.tags} labelFontSize={20} />
                        <ButtonsContainer>
                            {market.isClaimAvailable && <Button>{t('market.button.claim-label')}</Button>}
                            <OpenDisputeButton numberOfOpenedDisputes={market.numberOfOpenedDisputes}>
                                {t('market.button.open-dispute-label')}
                            </OpenDisputeButton>
                        </ButtonsContainer>
                    </Footer>
                </>
            ) : (
                <SimpleLoader />
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 25px;
    width: 1220px;
    padding: 100px 40px;
    background: ${(props) => props.theme.background.secondary};
`;

const Positions = styled(FlexDivRowCentered)``;

const Footer = styled(FlexDivRow)``;

const ButtonsContainer = styled(FlexDivRow)``;

const TicketInfo = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 55px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

export default Market;
