import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow, FlexDivEnd, FlexDivColumnCentered } from 'styles/common';
import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import Tags from 'pages/Markets/components/Tags';
import { AccountMarketData, MarketData } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import SPAAnchor from 'components/SPAAnchor';
import { buildOpenDisputeLink } from 'utils/routes';
import MaturityPhaseTicket from './MaturityPhaseTicket';
import PositioningPhaseTicket from './PositioningPhaseTicket';
import PositioningPhaseOpenBid from './PositioningPhaseOpenBid';
import useOracleCouncilMemberQuery from 'queries/oracleCouncil/useOracleCouncilMemberQuery';
import { MarketStatus as MarketStatusEnum } from 'constants/markets';
import OpenDisputeInfo from 'pages/Markets/components/OpenDisputeInfo';
import Button from 'components/Button';
import useAccountMarketDataQuery from 'queries/markets/useAccountMarketDataQuery';
import { Info, InfoContent, InfoLabel } from 'components/common';
import DataSource from 'pages/Markets/components/DataSource';

type MarketDetailsProps = {
    market: MarketData;
};

const MarketDetails: React.FC<MarketDetailsProps> = ({ market }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [isOracleCouncilMember, setIsOracleCouncilMember] = useState<boolean>(true);
    const [isClaimAvailable, setIsClaimAvailable] = useState<boolean>(false);

    const oracleCouncilMemberQuery = useOracleCouncilMemberQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (oracleCouncilMemberQuery.isSuccess && oracleCouncilMemberQuery.data !== undefined) {
            setIsOracleCouncilMember(oracleCouncilMemberQuery.data);
        }
    }, [oracleCouncilMemberQuery.isSuccess, oracleCouncilMemberQuery.data]);

    const accountMarketDataQuery = useAccountMarketDataQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (accountMarketDataQuery.isSuccess && accountMarketDataQuery.data !== undefined) {
            setIsClaimAvailable((accountMarketDataQuery.data as AccountMarketData).canClaim && !market.isPaused);
        }
    }, [accountMarketDataQuery.isSuccess, accountMarketDataQuery.data]);

    const canOpenDispute =
        !market.isMarketClosedForDisputes &&
        !isOracleCouncilMember &&
        walletAddress.toLowerCase() !== market.creator.toLowerCase() &&
        !market.isPaused;

    const showNumberOfOpenDisputes = !market.canUsersClaim;

    return (
        <MarketContainer>
            <MarketTitle fontSize={25} marginBottom={40}>
                {market.question}
            </MarketTitle>

            {market.isTicketType && market.status === MarketStatusEnum.Open && (
                <PositioningPhaseTicket market={market} />
            )}
            {market.isTicketType && market.status !== MarketStatusEnum.Open && <MaturityPhaseTicket market={market} />}

            {!market.isTicketType && market.status === MarketStatusEnum.Open && (
                <PositioningPhaseOpenBid market={market} />
            )}

            <StatusSourceContainer>
                <StatusSourceInfo />
                <MarketStatus market={market} fontSize={25} fontWeight={700} isClaimAvailable={isClaimAvailable} />
                {showNumberOfOpenDisputes ? <DataSource dataSource={market.dataSource} /> : <StatusSourceInfo />}
            </StatusSourceContainer>
            <Footer>
                <Tags tags={market.tags} />
                <FlexDivColumnCentered>
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
                </FlexDivColumnCentered>
                <OpenDisputeContainer>
                    {showNumberOfOpenDisputes ? (
                        <OpenDisputeInfo
                            numberOfOpenDisputes={market.isMarketClosedForDisputes ? 0 : market.numberOfOpenDisputes}
                        >
                            {t('market.open-disputes-label')}
                        </OpenDisputeInfo>
                    ) : (
                        <DataSource dataSource={market.dataSource} />
                    )}
                    {canOpenDispute && (
                        <SPAAnchor href={buildOpenDisputeLink(market.address)}>
                            <OpenDisputeButton type="secondary">
                                {t(
                                    `market.button.${
                                        market.isOpen ? 'dispute-market-label' : 'dispute-resolution-label'
                                    }`
                                )}
                            </OpenDisputeButton>
                        </SPAAnchor>
                    )}
                </OpenDisputeContainer>
            </Footer>
        </MarketContainer>
    );
};

const MarketContainer = styled(FlexDivColumn)`
    margin-top: 20px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 25px;
    width: 100%;
    padding: 40px 40px 30px 40px;
    background: ${(props) => props.theme.background.secondary};
    flex: initial;
    @media (max-width: 767px) {
        padding: 30px 20px 20px 20px;
    }
`;

const StatusSourceContainer = styled(FlexDivRow)`
    align-items: end;
    @media (max-width: 767px) {
        flex-direction: column;
        align-items: center;
    }
`;

const StatusSourceInfo = styled(FlexDivRow)`
    width: 146px;
`;

const Footer = styled(FlexDivRow)`
    margin-top: 10px;
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
