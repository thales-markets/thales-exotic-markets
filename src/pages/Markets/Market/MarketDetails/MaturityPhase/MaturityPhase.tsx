import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';
import { AccountMarketData, MarketData } from 'types/markets';
import { formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import { RootState } from 'redux/rootReducer';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { useSelector } from 'react-redux';
import useAccountMarketDataQuery from 'queries/markets/useAccountMarketDataQuery';
import onboardConnector from 'utils/onboardConnector';
import networkConnector from 'utils/networkConnector';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import { ethers } from 'ethers';
import Button from 'components/Button';
import { MarketStatus } from 'constants/markets';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';
import { getRoi } from 'utils/markets';
import { Info, InfoContent, InfoLabel, MainInfo, PositionContainer, PositionLabel, Positions } from 'components/common';
import { refetchMarketData } from 'utils/queryConnector';
import Tooltip from 'components/Tooltip';

type MaturityPhaseProps = {
    market: MarketData;
};

const MaturityPhase: React.FC<MaturityPhaseProps> = ({ market }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [accountMarketData, setAccountMarketData] = useState<AccountMarketData | undefined>(undefined);
    const [isClaiming, setIsClaiming] = useState<boolean>(false);

    const accountMarketDataQuery = useAccountMarketDataQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (accountMarketDataQuery.isSuccess && accountMarketDataQuery.data) {
            setAccountMarketData(accountMarketDataQuery.data as AccountMarketData);
        }
    }, [accountMarketDataQuery.isSuccess, accountMarketDataQuery.data]);

    const canClaim = accountMarketData && accountMarketData.canClaim && !market.isPaused;
    const claimAmount = accountMarketData ? accountMarketData.claimAmount : 0;
    const nothingToClaim = market.canUsersClaim && claimAmount === 0 && !market.isPaused;

    const handleClaim = async () => {
        const { signer } = networkConnector;
        if (signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsClaiming(true);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const tx = await marketContractWithSigner.claimWinningTicket();
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchMarketData(market.address, walletAddress);
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t(
                                `market.toast-messsage.${
                                    market.status === MarketStatus.CancelledConfirmed
                                        ? 'claim-refund-success'
                                        : 'claim-winnings-success'
                                }`
                            )
                        )
                    );
                    setIsClaiming(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsClaiming(false);
            }
        }
    };

    const getButtons = () => {
        if (!isWalletConnected) {
            return (
                <MarketButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </MarketButton>
            );
        }

        if (nothingToClaim) {
            return <NothingToClaim>{t('market.nothing-to-claim-label')}</NothingToClaim>;
        }

        return (
            <>
                {canClaim && (
                    <MarketButton disabled={isClaiming} onClick={handleClaim}>
                        {!isClaiming ? t('market.button.claim-label') : t('market.button.claim-progress-label')}
                    </MarketButton>
                )}
            </>
        );
    };

    const selectedPosition = accountMarketData ? accountMarketData.position : 0;

    return (
        <>
            <Positions>
                {market.positions.map((position: string, index: number) => (
                    <PositionContainer
                        key={position}
                        className={`${market.winningPosition !== index + 1 ? 'disabled' : ''} ${
                            index + 1 === selectedPosition ? 'selected' : ''
                        } maturity`}
                    >
                        <PositionLabel>{position}</PositionLabel>
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
                        {(market.winningPosition === index + 1 || market.noWinners) && (
                            <Info>
                                <InfoLabel>
                                    {t(
                                        `market.${
                                            market.noWinners ? 'claim-amount-ticket-label' : 'winnings-per-ticket-label'
                                        }`
                                    )}
                                    :
                                </InfoLabel>
                                <InfoContent>
                                    {formatCurrencyWithKey(
                                        PAYMENT_CURRENCY,
                                        market.winningAmountPerTicket,
                                        DEFAULT_CURRENCY_DECIMALS,
                                        true
                                    )}
                                </InfoContent>
                            </Info>
                        )}
                        {(market.winningPosition === index + 1 || market.noWinners) && (
                            <Info>
                                <InfoLabel>{t('market.roi-label')}:</InfoLabel>
                                <InfoContent>
                                    {formatPercentage(
                                        getRoi(
                                            market.ticketPrice,
                                            market.winningAmountPerTicket,
                                            market.winningAmountPerTicket > 0
                                        )
                                    )}
                                </InfoContent>
                            </Info>
                        )}
                    </PositionContainer>
                ))}
            </Positions>
            <MainInfo>
                {t('market.ticket-price-label')}:{' '}
                {formatCurrencyWithKey(PAYMENT_CURRENCY, market.ticketPrice, DEFAULT_CURRENCY_DECIMALS, true)}
            </MainInfo>
            <ButtonContainer>
                {market.noWinners && (
                    <ClaimInfo>
                        {t(`market.no-winners-label`)}
                        <Tooltip
                            overlay={
                                <NoWinnersOverlayContainer>{t('market.no-winners-tooltip')}</NoWinnersOverlayContainer>
                            }
                            iconFontSize={20}
                            marginLeft={4}
                        />
                    </ClaimInfo>
                )}
                {canClaim && (
                    <ClaimInfo>
                        {t(
                            `market.${
                                market.status === MarketStatus.CancelledConfirmed
                                    ? 'your-refund-label'
                                    : market.noWinners
                                    ? 'your-claim-amount-label'
                                    : 'your-winnings-label'
                            }`
                        )}
                        : {formatCurrencyWithKey(PAYMENT_CURRENCY, claimAmount)}
                    </ClaimInfo>
                )}
                {getButtons()}
            </ButtonContainer>
        </>
    );
};

const ButtonContainer = styled(FlexDivColumn)`
    margin-top: 35px;
    margin-bottom: 35px;
    align-items: center;
`;

const ClaimInfo = styled(MainInfo)`
    margin-bottom: 15px;
    line-height: 100%;
`;

const MarketButton = styled(Button)``;

const NothingToClaim = styled(FlexDivCentered)`
    background: transparent;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 30px;
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    color: ${(props) => props.theme.textColor.primary};
    min-height: 28px;
    padding: 5px 20px;
`;

const NoWinnersOverlayContainer = styled(FlexDivColumn)`
    text-align: justify;
`;

export default MaturityPhase;
