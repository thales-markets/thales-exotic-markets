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
import marketContract from 'utils/contracts/exoticPositionalTicketMarketContract';
import networkConnector from 'utils/networkConnector';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { refetchMarketData } from 'utils/queryConnector';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';
import MaturityPhaseOpenBid from './MaturityPhaseOpenBid';
import { MAX_GAS_LIMIT } from 'constants/network';
import { TwitterShareButton } from 'react-share';
import { LINKS } from 'constants/links';

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
    const [isPausing, setIsPausing] = useState<boolean>(false);
    const [showPause, setShowPause] = useState<boolean>(false);

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
            setShowPause((accountMarketDataQuery.data as AccountMarketData).isPauserAddress && !market.isPaused);
        }
    }, [accountMarketDataQuery.isSuccess, accountMarketDataQuery.data, market.isPaused]);

    const canOpenDispute =
        !market.isMarketClosedForDisputes &&
        !isOracleCouncilMember &&
        walletAddress.toLowerCase() !== market.creator.toLowerCase() &&
        !market.isPaused &&
        market.status !== MarketStatusEnum.CancelledConfirmed;

    const showNumberOfOpenDisputes = !market.canUsersClaim && market.status !== MarketStatusEnum.CancelledConfirmed;

    const handlePause = async () => {
        const { signer } = networkConnector;
        if (signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsPausing(true);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const tx = await marketContractWithSigner.setPaused(true, {
                    gasLimit: MAX_GAS_LIMIT,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchMarketData(market.address, walletAddress);
                    toast.update(id, getSuccessToastOptions(t('market.toast-messsage.pause-success')));
                    setIsPausing(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsPausing(false);
            }
        }
    };

    const twitterText = `${market.question}${t(
        `common.twitter-text-${market.question.length > 198 ? 'short' : 'long'}`
    )}`;

    return (
        <MarketContainer>
            <TopContainer>
                <MarketTitle fontSize={25} marginBottom={40}>
                    {market.question}
                </MarketTitle>
                <TwitterShareButton url={`${LINKS.ExoticMarkets}markets/${market.address}`} title={twitterText}>
                    <TwitterIcon />
                </TwitterShareButton>

                {market.isTicketType && market.status === MarketStatusEnum.Open && (
                    <PositioningPhaseTicket market={market} />
                )}
                {market.isTicketType && market.status !== MarketStatusEnum.Open && (
                    <MaturityPhaseTicket market={market} />
                )}

                {!market.isTicketType && market.status === MarketStatusEnum.Open && (
                    <PositioningPhaseOpenBid market={market} />
                )}
                {!market.isTicketType && market.status !== MarketStatusEnum.Open && (
                    <MaturityPhaseOpenBid market={market} />
                )}
                {showPause && (
                    <ButtonContainer>
                        <Button disabled={isPausing} onClick={handlePause}>
                            {!isPausing
                                ? t('market.button.pause-market-label')
                                : t('market.button.pause-progress-label')}
                        </Button>
                    </ButtonContainer>
                )}
                <MarketStatus market={market} fontSize={25} fontWeight={700} isClaimAvailable={isClaimAvailable} />
            </TopContainer>
            <BottomContainer>
                <Footer>
                    <Tags tags={market.tags} />
                    <FlexDivColumnCentered>
                        <PoolInfo>
                            <Info>
                                <InfoLabel>{t('market.total-pool-size-label')}:</InfoLabel>
                                <InfoContent>
                                    {formatCurrencyWithKey(
                                        PAYMENT_CURRENCY,
                                        market.poolSize,
                                        DEFAULT_CURRENCY_DECIMALS,
                                        true
                                    )}
                                </InfoContent>
                            </Info>
                            <Info>
                                <InfoLabel>{t('market.number-of-participants-label')}:</InfoLabel>
                                <InfoContent>{market.numberOfParticipants}</InfoContent>
                            </Info>
                        </PoolInfo>
                    </FlexDivColumnCentered>
                    <FooterRightContainer>
                        <DataSource dataSource={market.dataSource} />
                        <OpenDisputeContainer>
                            {showNumberOfOpenDisputes && (
                                <OpenDisputeInfo
                                    numberOfOpenDisputes={
                                        market.isMarketClosedForDisputes ? 0 : market.numberOfOpenDisputes
                                    }
                                >
                                    {t('market.open-disputes-label')}
                                </OpenDisputeInfo>
                            )}
                            {canOpenDispute && (
                                <SPAAnchor href={buildOpenDisputeLink(market.address)}>
                                    <OpenDisputeButton type="tertiary">
                                        {t(
                                            `market.button.${
                                                market.isOpen ? 'dispute-market-label' : 'dispute-resolution-label'
                                            }`
                                        )}
                                    </OpenDisputeButton>
                                </SPAAnchor>
                            )}
                        </OpenDisputeContainer>
                    </FooterRightContainer>
                </Footer>
            </BottomContainer>
        </MarketContainer>
    );
};

const MarketContainer = styled(FlexDivColumn)`
    margin-top: 20px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 25px;
    width: 100%;
    padding: 50px 0px 30px 0px;
    background: ${(props) => props.theme.background.tertiary};
    color: ${(props) => props.theme.textColor.tertiary};
    flex: initial;
    @media (max-width: 767px) {
        padding: 40px 0px 20px 0px;
    }
    position: relative;
`;

const TopContainer = styled(FlexDivColumnCentered)`
    padding: 0px 30px 20px 30px;
    align-items: center;
    width: 100%;
    border-bottom: 3px dashed ${(props) => props.theme.borderColor.tertiary};
    @media (max-width: 767px) {
        padding: 0px 20px 20px 20px;
    }
`;

const BottomContainer = styled(FlexDivColumnCentered)`
    padding: 10px 30px 0px 30px;
    width: 100%;
    @media (max-width: 767px) {
        padding: 20px 20px 0px 20px;
    }
`;

const Footer = styled(FlexDivRow)`
    margin-top: 10px;
    align-items: end;
    > div {
        width: 33%;
    }
    @media (max-width: 767px) {
        margin-top: 0;
        > div {
            width: 100%;
            justify-content: center;
            :not(:first-child) {
                margin-top: 10px;
            }
        }
        flex-direction: column;
    }
`;

const PoolInfo = styled(FlexDivColumnCentered)`
    padding: 10px 25px;
    border: 2px solid ${(props) => props.theme.borderColor.tertiary};
    border-radius: 15px;
    width: fit-content;
    align-self: center;
`;

const FooterRightContainer = styled(FlexDivColumnCentered)`
    align-items: end;
    @media (max-width: 767px) {
        align-items: center;
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

const ButtonContainer = styled(FlexDivColumn)`
    margin-bottom: 10px;
    align-items: center;
`;

const TwitterIcon = styled.i`
    position: absolute;
    top: 20px;
    right: 25px;
    font-size: 26px;
    &:before {
        font-family: ExoticIcons !important;
        content: '\\0050';
    }
    @media (max-width: 767px) {
        top: 15px;
        right: 20px;
    }
`;

export default MarketDetails;
