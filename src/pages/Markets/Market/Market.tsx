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
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivRowCentered, FlexDivEnd } from 'styles/common';
import MarketStatus from '../components/MarketStatus';
import MarketTitle from '../components/MarketTitle';
import OpenDisputeButton from '../components/OpenDisputeButton';
import Tags from '../components/Tags';
import { Market as MarketInfo } from 'types/markets';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import { CURRENCY_MAP, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';

// temp constants for mocks
const TEMP_POOL_SIZE = 15678.65;
const TEMP_ROI = 1.2356;
const TEMP_TOTAL_POOL_SIZE = 568678.65;
const TEMP_TICKET_PRICE = 30;
const TEMP_MAX_RETURN = 654;

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

    const showTicketBuy = market && market.isOpen && market.isTicketType && !market.hasPosition;
    const showTicketWithdraw = market && market.isOpen && market.isTicketType && market.hasPosition;
    const showTicketInfo = market && market.isOpen && market.isTicketType;

    return (
        <Container>
            {market ? (
                <>
                    <MarketTitle fontSize={40}>{market.title}</MarketTitle>
                    <Positions>
                        {market.positions.map((position: string, index: number) => (
                            <Position key={position}>
                                <Checkbox
                                    checked={index === 0}
                                    value={index === 0 ? 'true' : 'false'}
                                    onChange={() => {}}
                                    label={position}
                                />
                                <Info>
                                    <InfoLabel>{t('market.pool-size-label')}:</InfoLabel>
                                    <InfoContent>
                                        {formatCurrencyWithKey(CURRENCY_MAP.sUSD, TEMP_POOL_SIZE)}
                                    </InfoContent>
                                </Info>
                                <Info>
                                    <InfoLabel>{t('market.roi-label')}:</InfoLabel>
                                    <InfoContent>{formatPercentage(TEMP_ROI)}</InfoContent>
                                </Info>
                            </Position>
                        ))}
                    </Positions>
                    {showTicketInfo && (
                        <TicketInfo>
                            {t('market.ticekt-price-label')}{' '}
                            {formatCurrencyWithKey(
                                CURRENCY_MAP.sUSD,
                                TEMP_TICKET_PRICE,
                                DEFAULT_CURRENCY_DECIMALS,
                                true
                            )}
                        </TicketInfo>
                    )}
                    <Info fontSize={20}>
                        <InfoLabel>{t('market.return-label')}:</InfoLabel>
                        <InfoContent>{formatCurrencyWithKey(CURRENCY_MAP.sUSD, TEMP_MAX_RETURN)}</InfoContent>
                    </Info>
                    <ButtonContainer>
                        {showTicketBuy && <BuyButton type="secondary">{t('market.button.buy-label')}</BuyButton>}
                        {showTicketWithdraw && (
                            <MarketButton type="secondary">{t('market.button.withdraw-label')}</MarketButton>
                        )}
                    </ButtonContainer>
                    <MarketStatus market={market} fontSize={40} labelFontSize={20} fontWeight={700} />
                    <Footer>
                        <Tags tags={market.tags} labelFontSize={20} />
                        <Info fontSize={20}>
                            <InfoLabel>{t('market.total-pool-size-label')}:</InfoLabel>
                            <InfoContent>{formatCurrencyWithKey(CURRENCY_MAP.sUSD, TEMP_TOTAL_POOL_SIZE)}</InfoContent>
                        </Info>
                        <FooterButtonsContainer>
                            {market.isClaimAvailable && <Button>{t('market.button.claim-label')}</Button>}
                            <OpenDisputeButton numberOfOpenedDisputes={market.numberOfOpenedDisputes}>
                                {t('market.button.open-dispute-label')}
                            </OpenDisputeButton>
                        </FooterButtonsContainer>
                    </Footer>
                </>
            ) : (
                <SimpleLoader />
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 40px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 25px;
    width: 100%;
    padding: 40px 40px 30px 40px;
    background: ${(props) => props.theme.background.secondary};
    flex: initial;
`;

const Positions = styled(FlexDivRowCentered)`
    margin-top: 0px;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

const Position = styled(FlexDivColumn)<{ fontSize?: number }>`
    margin-bottom: 20px;
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

const TicketInfo = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 55px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin-top: 25px;
    margin-bottom: 20px;
`;

const MarketButton = styled(Button)`
    height: 32px;
    font-size: 22px;
    padding-top: 2px;
`;

const BuyButton = styled(MarketButton)`
    text-transform: uppercase;
`;

const Footer = styled(FlexDivRow)`
    margin-top: 10px;
    > div {
        width: 33%;
    }
`;

const FooterButtonsContainer = styled(FlexDivEnd)`
    align-items: center;
`;

export default Market;
