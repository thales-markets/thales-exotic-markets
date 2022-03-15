import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRowCentered } from 'styles/common';
import { AccountMarketData, MarketData } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import useAccountMarketDataQuery from 'queries/markets/useAccountMarketDataQuery';

type MaturityPhaseProps = {
    market: MarketData;
};

const MaturityPhase: React.FC<MaturityPhaseProps> = ({ market }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [accountMarketData, setAccountMarketData] = useState<AccountMarketData | undefined>(undefined);

    const accountMarketDataQuery = useAccountMarketDataQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (accountMarketDataQuery.isSuccess && accountMarketDataQuery.data) {
            setAccountMarketData(accountMarketDataQuery.data as AccountMarketData);
        }
    }, [accountMarketDataQuery.isSuccess, accountMarketDataQuery.data]);

    return (
        <Positions>
            {market.positions.map((position: string, index: number) => (
                <PositionContainer key={position} className={market.winningPosition === index + 1 ? '' : 'disabled'}>
                    <Position>
                        {!!accountMarketData && accountMarketData.position === index + 1 && <Checkmark />}
                        <PositionLabel>{position}</PositionLabel>
                    </Position>
                    <Info>
                        <InfoLabel>{t('market.pool-size-label')}:</InfoLabel>
                        <InfoContent>
                            {formatCurrencyWithKey(
                                PAYMENT_CURRENCY,
                                market.poolSizePerPosition[index],
                                DEFAULT_CURRENCY_DECIMALS,
                                true
                            )}
                        </InfoContent>
                    </Info>
                </PositionContainer>
            ))}
        </Positions>
    );
};

const Positions = styled(FlexDivRowCentered)`
    margin-top: 0px;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

const PositionContainer = styled(FlexDivColumn)`
    margin-bottom: 20px;
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
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

const Position = styled.label`
    align-self: center;
    display: block;
    position: relative;
`;

const PositionLabel = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 40px;
    line-height: 55px;
    text-align: center;
    padding-left: 35px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Checkmark = styled.span`
    :after {
        content: '';
        position: absolute;
        left: 10px;
        top: 12px;
        width: 8px;
        height: 22px;
        border: solid ${(props) => props.theme.borderColor.primary};
        border-width: 0 4px 4px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

export default MaturityPhase;
