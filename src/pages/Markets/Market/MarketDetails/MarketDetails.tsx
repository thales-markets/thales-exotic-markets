import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivEnd } from 'styles/common';
import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import Tags from 'pages/Markets/components/Tags';
import { AccountMarketData, MarketData } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import SPAAnchor from 'components/SPAAnchor';
import { buildOpenDisputeLink } from 'utils/routes';
import MaturityPhase from './MaturityPhase';
import PositioningPhase from './PositioningPhase';
import useOracleCouncilMemberQuery from 'queries/oracleCouncil/useOracleCouncilMemberQuery';
import { MarketStatus as MarketStatusEnum } from 'constants/markets';
import OpenDisputeInfo from 'pages/Markets/components/OpenDisputeInfo';
import Button from 'components/Button';
import useAccountMarketDataQuery from 'queries/markets/useAccountMarketDataQuery';

type MarketDetailsProps = {
    market: MarketData;
};

const MarketDetails: React.FC<MarketDetailsProps> = ({ market }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const oracleCouncilMemberQuery = useOracleCouncilMemberQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const isOracleCouncilMember: boolean = useMemo(() => {
        if (oracleCouncilMemberQuery.isSuccess) {
            return oracleCouncilMemberQuery.data as boolean;
        }
        return true;
    }, [oracleCouncilMemberQuery.isSuccess, oracleCouncilMemberQuery.data]);

    const accountMarketDataQuery = useAccountMarketDataQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    const isClaimAvailable: boolean = useMemo(() => {
        if (accountMarketDataQuery.isSuccess && accountMarketDataQuery.data) {
            return (accountMarketDataQuery.data as AccountMarketData).canClaim;
        }
        return false;
    }, [accountMarketDataQuery.isSuccess, accountMarketDataQuery.data]);

    const canOpenDispute =
        !market.isMarketClosedForDisputes &&
        !isOracleCouncilMember &&
        walletAddress.toLowerCase() !== market.creator.toLowerCase();

    const showNumberOfOpenDisputes = !market.canUsersClaim;

    return (
        <MarketContainer>
            <MarketTitle fontSize={40} marginBottom={40}>
                {market.question}
            </MarketTitle>
            {market.status === MarketStatusEnum.Open && <PositioningPhase market={market} />}
            {market.status !== MarketStatusEnum.Open && <MaturityPhase market={market} />}
            <MarketStatus
                market={market}
                fontSize={40}
                labelFontSize={20}
                fontWeight={700}
                isClaimAvailable={isClaimAvailable}
            />
            <Footer>
                <Tags tags={market.tags} labelFontSize={20} />
                <Info fontSize={20}>
                    <InfoLabel>{t('market.total-pool-size-label')}:</InfoLabel>
                    <InfoContent>
                        {formatCurrencyWithKey(PAYMENT_CURRENCY, market.poolSize, DEFAULT_CURRENCY_DECIMALS, true)}
                    </InfoContent>
                </Info>
                <OpenDisputeContainer>
                    {showNumberOfOpenDisputes && (
                        <OpenDisputeInfo
                            numberOfOpenDisputes={market.isMarketClosedForDisputes ? 0 : market.numberOfOpenDisputes}
                        >
                            {t('market.open-disputes-label')}
                        </OpenDisputeInfo>
                    )}
                    {canOpenDispute && (
                        <SPAAnchor href={buildOpenDisputeLink(market.address)}>
                            <OpenDisputeButton type="secondary">
                                {t('market.button.open-dispute-label')}
                            </OpenDisputeButton>
                        </SPAAnchor>
                    )}
                </OpenDisputeContainer>
            </Footer>
        </MarketContainer>
    );
};

const MarketContainer = styled(FlexDivColumn)`
    margin-top: 60px;
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

const OpenDisputeContainer = styled(FlexDivEnd)`
    align-items: center;
    @media (max-width: 767px) {
        justify-content: center;
    }
`;

const OpenDisputeButton = styled(Button)`
    font-size: 17px;
    margin-bottom: 4px;
    margin-left: 6px;
`;

export default MarketDetails;
