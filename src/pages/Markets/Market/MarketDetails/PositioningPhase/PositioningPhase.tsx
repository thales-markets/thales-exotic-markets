import Button from 'components/Button';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRowCentered } from 'styles/common';
import { AccountMarketData, MarketData } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { checkAllowance } from 'utils/network';
import { BigNumber, ethers } from 'ethers';
import networkConnector from 'utils/networkConnector';
import { MAX_GAS_LIMIT } from 'constants/network';
import ApprovalModal from 'components/ApprovalModal';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import usePaymentTokenBalanceQuery from 'queries/wallet/usePaymentTokenBalanceQuery';
import onboardConnector from 'utils/onboardConnector';
import RadioButton from 'components/fields/RadioButton';
import useAccountMarketDataQuery from 'queries/markets/useAccountMarketDataQuery';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';

type PositioningPhaseProps = {
    market: MarketData;
};

const PositioningPhase: React.FC<PositioningPhaseProps> = ({ market }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [isBuying, setIsBuying] = useState<boolean>(false);
    const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | string>('');
    const [currentPositionOnContract, setCurrentPositionOnContract] = useState<number>(0);
    const [selectedPosition, setSelectedPosition] = useState<number>(0);

    const accountMarketDataQuery = useAccountMarketDataQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (accountMarketDataQuery.isSuccess && accountMarketDataQuery.data) {
            setCurrentPositionOnContract((accountMarketDataQuery.data as AccountMarketData).position);
        }
    }, [accountMarketDataQuery.isSuccess, accountMarketDataQuery.data]);

    // set only on the first load, that is why isSuccess is the only dependency
    useEffect(() => {
        if (accountMarketDataQuery.isSuccess && accountMarketDataQuery.data) {
            setSelectedPosition((accountMarketDataQuery.data as AccountMarketData).position);
        }
    }, [accountMarketDataQuery.isSuccess]);

    const paymentTokenBalanceQuery = usePaymentTokenBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (paymentTokenBalanceQuery.isSuccess && paymentTokenBalanceQuery.data) {
            setPaymentTokenBalance(paymentTokenBalanceQuery.data);
        }
    }, [paymentTokenBalanceQuery.isSuccess, paymentTokenBalanceQuery.data]);

    const showTicketInfo = market.isTicketType && market.canUsersPlacePosition;
    const showTicketBuy = showTicketInfo && currentPositionOnContract === 0;
    const showTicketChangePosition = showTicketInfo && currentPositionOnContract !== selectedPosition;
    const showTicketWithdraw = showTicketInfo && market.isWithdrawalAllowed && currentPositionOnContract > 0;
    const showCancel = market.canCreatorCancelMarket && walletAddress.toLowerCase() === market.creator.toLowerCase();

    const insufficientBalance =
        Number(paymentTokenBalance) < Number(market.ticketPrice) || Number(paymentTokenBalance) === 0;
    const isPositionSelected = selectedPosition > 0;

    const isBuyButtonDisabled =
        isBuying ||
        isWithdrawing ||
        isCanceling ||
        !isWalletConnected ||
        !hasAllowance ||
        insufficientBalance ||
        !isPositionSelected;
    const isChangePositionButtonDisabled =
        isBuying || isWithdrawing || isCanceling || !isWalletConnected || !isPositionSelected;
    const isWithdrawButtonDisabled = isBuying || isWithdrawing || isCanceling || !isWalletConnected;
    const isCancelButtonDisabled = isBuying || isWithdrawing || isCanceling || !isWalletConnected;

    useEffect(() => {
        const { paymentTokenContract, signer } = networkConnector;
        if (paymentTokenContract && signer) {
            const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
            const addressToApprove = market.address;
            const getAllowance = async () => {
                try {
                    const parsedTicketPrice = ethers.utils.parseEther(Number(market.ticketPrice).toString());
                    const allowance = await checkAllowance(
                        parsedTicketPrice,
                        paymentTokenContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasAllowance, market.ticketPrice, isAllowing, isBuying, isWithdrawing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { paymentTokenContract, signer } = networkConnector;
        if (paymentTokenContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsAllowing(true);

            try {
                const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
                const addressToApprove = market.address;

                const tx = (await paymentTokenContractWithSigner.approve(addressToApprove, approveAmount, {
                    gasLimit: MAX_GAS_LIMIT,
                })) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t('market.toast-messsage.approve-success', { token: PAYMENT_CURRENCY }))
                    );
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsAllowing(false);
            }
        }
    };

    const handleBuy = async () => {
        const { signer } = networkConnector;
        if (signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsBuying(true);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const tx = await marketContractWithSigner.takeAPosition(selectedPosition);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t(
                                `market.toast-messsage.${
                                    showTicketBuy ? 'ticket-buy-success' : 'change-position-success'
                                }`
                            )
                        )
                    );
                    setIsBuying(false);
                    setCurrentPositionOnContract(selectedPosition);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsBuying(false);
            }
        }
    };

    const handleWithdraw = async () => {
        const { signer } = networkConnector;
        if (signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsWithdrawing(true);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const tx = await marketContractWithSigner.withdraw();
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t('market.toast-messsage.withdraw-success')));
                    setIsWithdrawing(false);
                    setCurrentPositionOnContract(0);
                    setSelectedPosition(0);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsWithdrawing(false);
            }
        }
    };

    const handleCancel = async () => {
        const { marketManagerContract, signer } = networkConnector;
        if (marketManagerContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsCanceling(true);

            try {
                const marketManagerContractWithSigner = marketManagerContract.connect(signer);

                const tx = await marketManagerContractWithSigner.cancelMarket(market.address);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t('market.toast-messsage.cancel-market-success')));
                    setIsCanceling(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsCanceling(false);
            }
        }
    };

    const getButtons = () => {
        if (!isWalletConnected) {
            return (
                <MarketButton type="secondary" onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </MarketButton>
            );
        }
        if (insufficientBalance && showTicketBuy) {
            return (
                <MarketButton type="secondary" disabled={true}>
                    {t(`common.errors.insufficient-balance`)}
                </MarketButton>
            );
        }
        if (!isPositionSelected) {
            return (
                <MarketButton type="secondary" disabled={true}>
                    {t(`common.errors.select-position`)}
                </MarketButton>
            );
        }
        if (!hasAllowance && showTicketBuy) {
            return (
                <MarketButton type="secondary" disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: PAYMENT_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: PAYMENT_CURRENCY,
                          })}
                </MarketButton>
            );
        }
        if (showTicketBuy) {
            return (
                <MarketButton type="secondary" disabled={isBuyButtonDisabled} onClick={handleBuy}>
                    {!isBuying ? t('market.button.buy-label') : t('market.button.buy-progress-label')}
                </MarketButton>
            );
        }
        return (
            <>
                {showTicketChangePosition && (
                    <MarketButton type="secondary" disabled={isChangePositionButtonDisabled} onClick={handleBuy}>
                        {!isBuying
                            ? t('market.button.change-position-label')
                            : t('market.button.change-position-progress-label')}
                    </MarketButton>
                )}
                {showTicketWithdraw && (
                    <MarketButton type="secondary" disabled={isWithdrawButtonDisabled} onClick={handleWithdraw}>
                        {!isWithdrawing
                            ? t('market.button.withdraw-label')
                            : t('market.button.withdraw-progress-label')}
                    </MarketButton>
                )}
            </>
        );
    };

    return (
        <>
            <Positions>
                {market.positions.map((position: string, index: number) => (
                    <Position key={position}>
                        <RadioButton
                            checked={index + 1 === selectedPosition}
                            value={index + 1}
                            onChange={() => setSelectedPosition(index + 1)}
                            label={position}
                            disabled={isBuying || isWithdrawing}
                        />
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
                    </Position>
                ))}
            </Positions>
            {showTicketInfo && (
                <MainInfo>
                    {t('market.ticket-price-label')}{' '}
                    {formatCurrencyWithKey(PAYMENT_CURRENCY, market.ticketPrice, DEFAULT_CURRENCY_DECIMALS, true)}
                </MainInfo>
            )}
            <ButtonContainer>
                {getButtons()}
                {showCancel && (
                    <MarketButton type="secondary" disabled={isCancelButtonDisabled} onClick={handleCancel}>
                        {!isCanceling
                            ? t('market.button.cancel-market-label')
                            : t('market.button.cancel-progress-label')}
                    </MarketButton>
                )}
            </ButtonContainer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={market.ticketPrice}
                    tokenSymbol={PAYMENT_CURRENCY}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </>
    );
};

const Positions = styled(FlexDivRowCentered)`
    margin-top: 0px;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

const Position = styled(FlexDivColumn)`
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

export default PositioningPhase;
