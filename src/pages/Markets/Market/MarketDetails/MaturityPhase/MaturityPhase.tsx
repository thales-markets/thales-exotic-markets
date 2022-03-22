import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRowCentered } from 'styles/common';
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

    const canClaim = accountMarketData && accountMarketData.canClaim;
    const claimAmount = accountMarketData ? accountMarketData.claimAmount : 0;
    const nothingToClaim = market.canUsersClaim && claimAmount === 0;

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
            return <MarketButton disabled={true}>{t('market.nothing-to-claim-label')}</MarketButton>;
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

    return (
        <>
            <Positions>
                {market.positions.map((position: string, index: number) => {
                    const selectedPosition = accountMarketData ? accountMarketData.position : 0;
                    const winningAmount = accountMarketData ? accountMarketData.winningAmount : 0;

                    return (
                        <PositionContainer
                            key={position}
                            className={market.winningPosition === index + 1 ? '' : 'disabled'}
                        >
                            <Position>
                                {selectedPosition === index + 1 && <Checkmark />}
                                <PositionLabel hasPaddingLeft={selectedPosition === index + 1}>
                                    {position}
                                </PositionLabel>
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
                            <Info>
                                <InfoLabel>{t('market.roi-label')}:</InfoLabel>
                                <InfoContent>
                                    {formatPercentage(
                                        getRoi(
                                            market.ticketPrice,
                                            selectedPosition === 0
                                                ? market.winningAmountsNewUser[index]
                                                : selectedPosition === index + 1
                                                ? winningAmount
                                                : market.winningAmountsNoPosition[index]
                                        )
                                    )}
                                </InfoContent>
                            </Info>
                        </PositionContainer>
                    );
                })}
            </Positions>
            {canClaim && (
                <MainInfo>
                    {t(
                        `market.${
                            market.status === MarketStatus.CancelledConfirmed
                                ? 'claim-refund-label'
                                : 'claim-winnings-label'
                        }`
                    )}{' '}
                    {formatCurrencyWithKey(PAYMENT_CURRENCY, claimAmount)}
                </MainInfo>
            )}
            <ButtonContainer>{getButtons()}</ButtonContainer>
        </>
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
const Position = styled.label`
    align-self: center;
    display: block;
    position: relative;
`;

const PositionLabel = styled.span<{ hasPaddingLeft: boolean }>`
    font-style: normal;
    font-weight: normal;
    font-size: 40px;
    line-height: 55px;
    text-align: center;
    padding-left: ${(props) => (props.hasPaddingLeft ? 35 : 0)}px;
    color: ${(props) => props.theme.textColor.primary};
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

const MainInfo = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 55px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

const ButtonContainer = styled(FlexDivColumn)`
    margin-top: 40px;
    margin-bottom: 40px;
    align-items: center;
`;

const MarketButton = styled(Button)`
    height: 32px;
    font-size: 22px;
    padding-top: 2px;
    :not(button:last-of-type) {
        margin-bottom: 10px;
    }
`;

export default MaturityPhase;
