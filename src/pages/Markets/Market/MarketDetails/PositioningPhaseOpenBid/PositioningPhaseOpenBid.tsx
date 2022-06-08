import Button from 'components/Button';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { MarketData, MarketsParameters } from 'types/markets';
import { formatCurrency, formatCurrencyWithKey, formatPercentage } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { checkAllowance } from 'utils/network';
import { BigNumber, BigNumberish, ethers } from 'ethers';
import networkConnector from 'utils/networkConnector';
import { MAX_GAS_LIMIT } from 'constants/network';
import ApprovalModal from 'components/ApprovalModal';
import marketContract from 'utils/contracts/exoticPositionalOpenBidMarketContract';
import usePaymentTokenBalanceQuery from 'queries/wallet/usePaymentTokenBalanceQuery';
import onboardConnector from 'utils/onboardConnector';
import useAccountMarketOpenBidDataQuery from 'queries/markets/useAccountMarketOpenBidDataQuery';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';
import { Info, InfoContent, InfoLabel, PositionOpenBidContainer, PositionLabel, Positions } from 'components/common';
import useMarketsParametersQuery from 'queries/markets/useMarketsParametersQuery';
import Tooltip from 'components/Tooltip';
import { refetchMarketData } from 'utils/queryConnector';
import BidInput from 'components/fields/BidInput';
import FieldValidationMessage from 'components/FieldValidationMessage';
import {
    MAXIMUM_PER_OPEN_BID_POSITION,
    MAXIMUM_WITHDRAW_PERCENTAGE,
    MINIMUM_TICKET_PRICE,
    WITHDRAW_PROTECTION_DURATION,
} from 'constants/markets';
import WithdrawalRulesModal from 'pages/Markets/components/WithdrawalRulesModal';

type PositioningPhaseOpenBidProps = {
    market: MarketData;
};

const PositioningPhaseOpenBid: React.FC<PositioningPhaseOpenBidProps> = ({ market }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [isBidding, setIsBidding] = useState<boolean>(false);
    const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
    const [isCanceling, setIsCanceling] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | string>('');
    const [selectedPositions, setSelectedPositions] = useState<(number | string)[]>(
        new Array(market.positions.length).fill('0')
    );
    // we need two positionOnContract, one is set on success, the second one only from query
    const [currentPositionsOnContract, setCurrentPositionsOnContract] = useState<(number | string)[]>(
        new Array(market.positions.length).fill('0')
    );
    const [canWithdraw, setCanWithdraw] = useState<boolean>(false);
    const [marketsParameters, setMarketsParameters] = useState<MarketsParameters | undefined>(undefined);
    const [withdrawPosition, setWithdrawPosition] = useState<number>(-1);
    const [openWithdrawalRulesModal, setOpenWithdrawalRulesModal] = useState<boolean>(false);

    const accountMarketDataQuery = useAccountMarketOpenBidDataQuery(market.address, walletAddress, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (accountMarketDataQuery.isSuccess && accountMarketDataQuery.data) {
            setCurrentPositionsOnContract(accountMarketDataQuery.data.userPositions);
            setSelectedPositions(accountMarketDataQuery.data.userPositions);
            setCanWithdraw(accountMarketDataQuery.data.canWithdraw);
        }
    }, [accountMarketDataQuery.isSuccess, accountMarketDataQuery.data]);

    const paymentTokenBalanceQuery = usePaymentTokenBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (paymentTokenBalanceQuery.isSuccess && paymentTokenBalanceQuery.data !== undefined) {
            setPaymentTokenBalance(paymentTokenBalanceQuery.data);
        }
    }, [paymentTokenBalanceQuery.isSuccess, paymentTokenBalanceQuery.data]);

    const marketsParametersQuery = useMarketsParametersQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (marketsParametersQuery.isSuccess && marketsParametersQuery.data) {
            setMarketsParameters(marketsParametersQuery.data);
        }
    }, [marketsParametersQuery.isSuccess, marketsParametersQuery.data]);

    const creatorPercentage = marketsParameters ? marketsParameters.creatorPercentage : 0;
    const resolverPercentage = marketsParameters ? marketsParameters.resolverPercentage : 0;
    const safeBoxPercentage = marketsParameters ? marketsParameters.safeBoxPercentage : 0;
    const bidPercentage = creatorPercentage + resolverPercentage + safeBoxPercentage;
    const withdrawalPercentage = marketsParameters ? marketsParameters.withdrawalPercentage : 0;
    const minFixedTicketPrice = marketsParameters ? marketsParameters.minFixedTicketPrice : MINIMUM_TICKET_PRICE;
    const maxAmountForOpenBidPosition = marketsParameters
        ? marketsParameters.maxAmountForOpenBidPosition
        : MAXIMUM_PER_OPEN_BID_POSITION;

    const arePostionsChanged = selectedPositions.some(
        (position, index) => Number(currentPositionsOnContract[index]) !== Number(position)
    );
    const showBid =
        market.canUsersPlacePosition && currentPositionsOnContract.every((position) => Number(position) === 0);
    const showChangePosition = market.canUsersPlacePosition && !showBid && arePostionsChanged;
    const showWithdraw =
        market.canUsersPlacePosition &&
        canWithdraw &&
        currentPositionsOnContract.some((position) => Number(position) > 0);
    const showCancel = market.canCreatorCancelMarket && walletAddress.toLowerCase() === market.creator.toLowerCase();

    const selectedPositionsSum = selectedPositions.reduce((a, b) => Number(a) + Number(b), 0);
    const currentPositionsOnContractSum = currentPositionsOnContract.reduce((a, b) => Number(a) + Number(b), 0);
    const requiredFunds = Number(selectedPositionsSum) - Number(currentPositionsOnContractSum);
    const isNewAmountValid = Number(selectedPositionsSum) >= Number(currentPositionsOnContractSum);

    const isWithdrawProtectionDuration = Date.now() + WITHDRAW_PROTECTION_DURATION > market.endOfPositioning;
    const maxWithdrawAmount = (MAXIMUM_WITHDRAW_PERCENTAGE * Number(market.poolSize)) / 100;
    const hasMoreThanLimitInProtectionPeriod =
        isWithdrawProtectionDuration && Number(currentPositionsOnContractSum) > maxWithdrawAmount;

    const insufficientBalance =
        Number(paymentTokenBalance) < Number(requiredFunds) || Number(paymentTokenBalance) === 0;
    const isPositionSelected = selectedPositions.some((position) => Number(position) > 0);
    const areOpetBidAmountsValid = selectedPositions.every((position) => {
        return (
            (Number(position) >= minFixedTicketPrice && Number(position) <= maxAmountForOpenBidPosition) ||
            Number(position) === 0
        );
    });

    const isBidButtonDisabled =
        isBidding ||
        isWithdrawing ||
        isCanceling ||
        !isWalletConnected ||
        !hasAllowance ||
        insufficientBalance ||
        !isPositionSelected ||
        !isNewAmountValid ||
        !areOpetBidAmountsValid;
    const isChangePositionButtonDisabled =
        isBidding ||
        isWithdrawing ||
        isCanceling ||
        !isWalletConnected ||
        !isPositionSelected ||
        !isNewAmountValid ||
        !areOpetBidAmountsValid ||
        hasMoreThanLimitInProtectionPeriod;
    const areWithdrawButtonsDisabled = isBidding || isWithdrawing || isCanceling || !isWalletConnected;
    const isWithdrawAllButtonDisabled = areWithdrawButtonsDisabled || hasMoreThanLimitInProtectionPeriod;
    const isCancelButtonDisabled = isBidding || isWithdrawing || isCanceling || !isWalletConnected;
    const isPositionCardDisabled = isBidding || isWithdrawing || isCanceling;

    useEffect(() => {
        const { paymentTokenContract, thalesBondsContract, signer } = networkConnector;
        if (paymentTokenContract && thalesBondsContract && signer) {
            const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
            const addressToApprove = thalesBondsContract.address;
            const getAllowance = async () => {
                try {
                    const parsedRequiredFunds = ethers.utils.parseEther(Number(requiredFunds).toString());
                    const allowance = await checkAllowance(
                        parsedRequiredFunds,
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
    }, [walletAddress, isWalletConnected, hasAllowance, requiredFunds, isAllowing, isBidding, isWithdrawing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { paymentTokenContract, thalesBondsContract, signer } = networkConnector;
        if (paymentTokenContract && thalesBondsContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsAllowing(true);

            try {
                const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
                const addressToApprove = thalesBondsContract.address;

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

    const handleBid = async () => {
        const { signer } = networkConnector;
        if (signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsBidding(true);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const formattedPositions: number[] = [];
                const formattedAmounts: BigNumberish[] = [];

                selectedPositions.forEach((position, index) => {
                    formattedPositions.push(index + 1);
                    formattedAmounts.push(ethers.utils.parseEther(Number(position).toString()));
                });

                const tx = await marketContractWithSigner.takeOpenBidPositions(formattedPositions, formattedAmounts, {
                    gasLimit: MAX_GAS_LIMIT,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchMarketData(market.address, walletAddress);
                    toast.update(
                        id,
                        getSuccessToastOptions(
                            t(`market.toast-messsage.${showBid ? 'ticket-bid-success' : 'change-position-success'}`)
                        )
                    );
                    setIsBidding(false);
                    setCurrentPositionsOnContract(selectedPositions);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsBidding(false);
            }
        }
    };

    const handleWithdraw = async (position: number) => {
        const { signer } = networkConnector;
        if (signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsWithdrawing(true);
            setWithdrawPosition(position);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const tx = await marketContractWithSigner.withdraw(position, {
                    gasLimit: MAX_GAS_LIMIT,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchMarketData(market.address, walletAddress);
                    toast.update(id, getSuccessToastOptions(t('market.toast-messsage.withdraw-success')));
                    setIsWithdrawing(false);
                    setWithdrawPosition(-1);
                    if (position === 0) {
                        setSelectedPositions(new Array(market.positions.length).fill('0'));
                        setCurrentPositionsOnContract(new Array(market.positions.length).fill('0'));
                    } else {
                        const newPositions = [...selectedPositions];
                        newPositions[position - 1] = '0';
                        setSelectedPositions(newPositions);
                        setCurrentPositionsOnContract(newPositions);
                    }
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsWithdrawing(false);
                setWithdrawPosition(-1);
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

                const tx = await marketManagerContractWithSigner.cancelMarket(market.address, {
                    gasLimit: MAX_GAS_LIMIT,
                });
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    refetchMarketData(market.address, walletAddress);
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
                <MarketButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </MarketButton>
            );
        }
        if (insufficientBalance && (showBid || showChangePosition)) {
            return <MarketButton disabled={true}>{t(`common.errors.insufficient-balance`)}</MarketButton>;
        }
        if (!isPositionSelected) {
            return <MarketButton disabled={true}>{t(`common.errors.select-positions`)}</MarketButton>;
        }
        if (!hasAllowance) {
            return (
                <MarketButton disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: PAYMENT_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: PAYMENT_CURRENCY,
                          })}
                </MarketButton>
            );
        }
        if (showBid) {
            return (
                <MarketButton disabled={isBidButtonDisabled} onClick={handleBid}>
                    {!isBidding ? t('market.button.bid-label') : t('market.button.bid-progress-label')}
                </MarketButton>
            );
        }
        return (
            <>
                {showChangePosition && (
                    <MarketButton disabled={isChangePositionButtonDisabled} onClick={handleBid}>
                        {!isBidding
                            ? t('market.button.update-positions-label')
                            : t('market.button.update-positions-progress-label')}
                    </MarketButton>
                )}
                {showWithdraw && (
                    <MarketButton disabled={isWithdrawAllButtonDisabled} onClick={() => handleWithdraw(0)}>
                        {isWithdrawing && withdrawPosition === 0
                            ? t('market.button.withdraw-progress-label')
                            : t('market.button.withdraw-label')}
                    </MarketButton>
                )}
            </>
        );
    };

    return (
        <>
            <Positions>
                {market.positions.map((position: string, index: number) => (
                    <PositionOpenBidContainer key={position} className={`${isPositionCardDisabled ? 'disabled' : ''}`}>
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
                        <Info>
                            <InfoLabel>{t('market.current-roi-label')}:</InfoLabel>
                            <InfoContent>
                                {formatPercentage(
                                    market.openBidMarketData && market.openBidMarketData.roiPerPosition[index] > 0
                                        ? market.openBidMarketData.roiPerPosition[index]
                                        : 0
                                )}
                            </InfoContent>
                            <Tooltip overlay={<RoiOverlayContainer>{t('market.roi-tooltip')}</RoiOverlayContainer>} />
                        </Info>
                        <BidInput
                            value={selectedPositions[index]}
                            label={`${t('market.bid-amount-label')}:`}
                            onChange={(_, value) => {
                                const newSelectedPositions = [...selectedPositions];
                                newSelectedPositions[index] = value;
                                setSelectedPositions(newSelectedPositions);
                            }}
                            currencyLabel={PAYMENT_CURRENCY}
                            onWithdrawClick={() => handleWithdraw(index + 1)}
                            initialValue={currentPositionsOnContract[index]}
                            disabled={isPositionCardDisabled}
                            isWithdrawing={withdrawPosition === index + 1}
                            withdrawDisabled={
                                isWithdrawProtectionDuration &&
                                Number(currentPositionsOnContract[index]) > maxWithdrawAmount
                            }
                            simpleInput
                        />
                    </PositionOpenBidContainer>
                ))}
            </Positions>
            {market.canUsersPlacePosition && (
                <>
                    <Info>
                        <InfoLabel>{t('market.bid-fee-label')}:</InfoLabel>
                        <InfoContent>{bidPercentage}%</InfoContent>
                        <Tooltip
                            overlay={
                                <FeesOverlayContainer>
                                    <Trans
                                        i18nKey="market.bid-fee-tooltip"
                                        components={[<div key="1" />, <span key="2" />]}
                                        values={{
                                            bidPercentage,
                                            creatorPercentage,
                                            resolverPercentage,
                                            safeBoxPercentage,
                                        }}
                                    />
                                </FeesOverlayContainer>
                            }
                            darkInfoIcon
                        />
                    </Info>
                    {market.isWithdrawalAllowed ? (
                        <>
                            <Info>
                                <InfoLabel>{t('market.withdrawal-fee-label')}:</InfoLabel>
                                <InfoContent>{withdrawalPercentage}%</InfoContent>
                                <Tooltip
                                    overlay={
                                        <FeesOverlayContainer>
                                            <Trans
                                                i18nKey="market.withdrawal-fee-tooltip"
                                                components={[<div key="1" />, <span key="2" />]}
                                                values={{
                                                    withdrawalPercentage,
                                                    creatorPercentage: withdrawalPercentage / 2,
                                                    safeBoxPercentage: withdrawalPercentage / 2,
                                                }}
                                            />
                                        </FeesOverlayContainer>
                                    }
                                    darkInfoIcon
                                />
                            </Info>
                            <Info>
                                <InfoLabel>{t('market.withdrawal-allowed')}</InfoLabel>
                                <WithdrawalRulesComponent onClick={() => setOpenWithdrawalRulesModal(true)}>
                                    {t('market.withdrawal-rules-label')}
                                </WithdrawalRulesComponent>
                                .
                            </Info>
                        </>
                    ) : (
                        <Info>{t('market.withdrawal-not-allowed')}</Info>
                    )}
                </>
            )}
            <ButtonContainer>
                {showChangePosition && (
                    <Info fontSize={18}>
                        <InfoLabel>{t('market.your-previous-bid-amount-label')}:</InfoLabel>
                        <InfoContent>
                            {formatCurrencyWithKey(PAYMENT_CURRENCY, currentPositionsOnContractSum)}
                        </InfoContent>
                        <Tooltip
                            overlay={
                                <BidAmountOverlayContainer>
                                    <div>{t('market.your-previous-positions-label')}:</div>
                                    {market.positions.map((position: string, index: number) => (
                                        <span key={`previousBidAmount${index}`}>
                                            -{' '}
                                            {formatCurrencyWithKey(PAYMENT_CURRENCY, currentPositionsOnContract[index])}{' '}
                                            on {position}
                                        </span>
                                    ))}
                                </BidAmountOverlayContainer>
                            }
                            iconFontSize={20}
                            darkInfoIcon
                        />
                    </Info>
                )}
                {market.canUsersPlacePosition && (
                    <Info fontSize={18}>
                        <InfoLabel>
                            {showChangePosition
                                ? t('market.your-new-bid-amount-label')
                                : t('market.your-total-bid-amount-label')}
                            :
                        </InfoLabel>
                        <InfoContent>{formatCurrencyWithKey(PAYMENT_CURRENCY, selectedPositionsSum)}</InfoContent>
                        <Tooltip
                            overlay={
                                <BidAmountOverlayContainer>
                                    <div>
                                        {showChangePosition
                                            ? t('market.your-new-positions-label')
                                            : t('market.your-positions-label')}
                                        :
                                    </div>
                                    {market.positions.map((position: string, index: number) => (
                                        <span key={`newBidAmount${index}`}>
                                            - {formatCurrencyWithKey(PAYMENT_CURRENCY, selectedPositions[index])} on{' '}
                                            {position}
                                        </span>
                                    ))}
                                </BidAmountOverlayContainer>
                            }
                            iconFontSize={20}
                            darkInfoIcon
                        />
                    </Info>
                )}
                <ValidationContainer>
                    <FieldValidationMessage
                        showValidation={!isNewAmountValid}
                        message={t(`common.errors.invalid-new-open-bid-amounts`)}
                        hideArrow
                    />
                    <FieldValidationMessage
                        showValidation={!areOpetBidAmountsValid}
                        message={t(`common.errors.invalid-amounts-extended`, {
                            min: formatCurrencyWithKey(
                                PAYMENT_CURRENCY,
                                minFixedTicketPrice,
                                DEFAULT_CURRENCY_DECIMALS,
                                true
                            ),
                            max: formatCurrencyWithKey(
                                PAYMENT_CURRENCY,
                                maxAmountForOpenBidPosition,
                                DEFAULT_CURRENCY_DECIMALS,
                                true
                            ),
                        })}
                        hideArrow
                    />
                </ValidationContainer>
                {arePostionsChanged && (
                    <MarketButton
                        disabled={isPositionCardDisabled}
                        onClick={() => setSelectedPositions(currentPositionsOnContract)}
                    >
                        {t('market.button.reset-positions-label')}
                    </MarketButton>
                )}
                {getButtons()}
                {showCancel && (
                    <MarketButton disabled={isCancelButtonDisabled} onClick={handleCancel}>
                        {!isCanceling
                            ? t('market.button.cancel-market-label')
                            : t('market.button.cancel-progress-label')}
                    </MarketButton>
                )}
            </ButtonContainer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={requiredFunds}
                    tokenSymbol={PAYMENT_CURRENCY}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
            {openWithdrawalRulesModal && (
                <WithdrawalRulesModal
                    onClose={() => setOpenWithdrawalRulesModal(false)}
                    withdrawalPeriodInHours={formatCurrency(
                        (market.endOfPositioning - market.withdrawalPeriod) / 1000 / 60 / 60,
                        DEFAULT_CURRENCY_DECIMALS,
                        true
                    )}
                    isTicketType={false}
                />
            )}
        </>
    );
};

const ButtonContainer = styled(FlexDivColumn)`
    margin-top: 40px;
    margin-bottom: 40px;
    align-items: center;
`;

const MarketButton = styled(Button)`
    :not(button:last-of-type) {
        margin-bottom: 10px;
    }
`;

const FeesOverlayContainer = styled(FlexDivColumn)`
    text-align: start;
    div {
        margin-bottom: 5px;
    }
    span {
        :last-of-type {
            margin-bottom: 5px;
        }
    }
`;

const WithdrawalRulesComponent = styled.span`
    font-style: italic;
    font-weight: 700;
    cursor: pointer;
`;

const BidAmountOverlayContainer = styled(FlexDivColumn)`
    text-align: start;
    div {
        margin-bottom: 5px;
    }
`;

const RoiOverlayContainer = styled(FlexDivColumn)`
    text-align: justify;
`;

const ValidationContainer = styled(FlexDivColumn)`
    align-items: center;
    margin-bottom: 10px;
    > div {
        width: fit-content;
    }
`;

export default PositioningPhaseOpenBid;
