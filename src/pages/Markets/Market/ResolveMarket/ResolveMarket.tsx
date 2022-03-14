import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';
import Button from 'components/Button';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { MarketsParameters } from 'types/markets';
import useMarketsParametersQuery from 'queries/markets/useMarketsParametersQuery';
import networkConnector from 'utils/networkConnector';
import { BigNumber, ethers } from 'ethers';
import { checkAllowance } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import { PAYMENT_CURRENCY } from 'constants/currency';
import ValidationMessage from 'components/ValidationMessage';
import ApprovalModal from 'components/ApprovalModal';
import usePaymentTokenBalanceQuery from 'queries/wallet/usePaymentTokenBalanceQuery';
import { MAX_GAS_LIMIT } from 'constants/network';
import RadioButton from 'components/fields/RadioButton';

type ResolveMarketProps = {
    marketAddress: string;
    positions: string[];
    marketCreator: string;
};

const ResolveMarket: React.FC<ResolveMarketProps> = ({ marketAddress, positions, marketCreator }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [outcomePosition, setOutcomePosition] = useState<number>(-1);
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | string>('');
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);

    const outcomePositions = [...positions, t('common.cancel')];

    const marketsParametersQuery = useMarketsParametersQuery(networkId, {
        enabled: isAppReady,
    });

    const marketsParameters: MarketsParameters | undefined = useMemo(() => {
        if (marketsParametersQuery.isSuccess && marketsParametersQuery.data) {
            return marketsParametersQuery.data as MarketsParameters;
        }
        return undefined;
    }, [marketsParametersQuery.isSuccess, marketsParametersQuery.data]);

    const paymentTokenBalanceQuery = usePaymentTokenBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (paymentTokenBalanceQuery.isSuccess && paymentTokenBalanceQuery.data) {
            setPaymentTokenBalance(Number(paymentTokenBalanceQuery.data));
        }
    }, [paymentTokenBalanceQuery.isSuccess, paymentTokenBalanceQuery.data]);

    const fixedBondAmount = marketsParameters ? marketsParameters.fixedBondAmount : 0;

    const isOutcomePositionSelected = outcomePosition >= 0;
    const insufficientBalance =
        Number(paymentTokenBalance) < Number(fixedBondAmount) || Number(paymentTokenBalance) === 0;
    const isMarketCreator = marketCreator === walletAddress;

    const isButtonDisabled =
        isSubmitting || !isWalletConnected || !hasAllowance || !isOutcomePositionSelected || insufficientBalance;

    useEffect(() => {
        const { paymentTokenContract, thalesBondsContract, signer } = networkConnector;
        if (paymentTokenContract && thalesBondsContract && signer) {
            const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
            const addressToApprove = thalesBondsContract.address;
            const getAllowance = async () => {
                try {
                    const parsedAmount = ethers.utils.parseEther(Number(fixedBondAmount).toString());
                    const allowance = await checkAllowance(
                        parsedAmount,
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
    }, [walletAddress, isWalletConnected, hasAllowance, fixedBondAmount, isAllowing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { paymentTokenContract, thalesBondsContract, signer } = networkConnector;
        if (paymentTokenContract && thalesBondsContract && signer) {
            const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
            const addressToApprove = thalesBondsContract.address;
            try {
                setIsAllowing(true);
                const tx = (await paymentTokenContractWithSigner.approve(addressToApprove, approveAmount, {
                    gasLimit: MAX_GAS_LIMIT,
                })) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsAllowing(false);
            }
        }
    };

    const handleSubmit = async () => {
        const { marketManagerContract, signer } = networkConnector;
        if (marketManagerContract && signer) {
            setTxErrorMessage(null);
            setIsSubmitting(true);

            try {
                const marketManagerContractWithSigner = marketManagerContract.connect(signer);

                const tx = await marketManagerContractWithSigner.resolveMarket(marketAddress, outcomePosition);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    // dispatchMarketNotification(t('migration.migrate-button.confirmation-message'));
                    setIsSubmitting(false);
                    // setAmount('');
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsSubmitting(false);
            }
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <MarketButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </MarketButton>
            );
        }
        if (insufficientBalance && !isMarketCreator) {
            return <MarketButton disabled={true}>{t(`common.errors.insufficient-balance`)}</MarketButton>;
        }
        if (!isOutcomePositionSelected) {
            return (
                <MarketButton type="secondary" disabled={true}>
                    {t(`common.errors.select-outcome`)}
                </MarketButton>
            );
        }
        if (!hasAllowance && !isMarketCreator) {
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
        return (
            <MarketButton disabled={isButtonDisabled} onClick={handleSubmit}>
                {!isSubmitting
                    ? t('market.button.resolve-market-label')
                    : t('market.button.resolve-market-progress-label')}
            </MarketButton>
        );
    };

    return (
        <Container>
            <Title>{t('market.resolve-market.title')}</Title>
            <Positions>
                {outcomePositions.map((position: string, index: number) => {
                    const positionIndex = (index + 1) % outcomePositions.length;
                    console.log(positionIndex);
                    return (
                        <RadioButton
                            checked={positionIndex === outcomePosition}
                            value={positionIndex}
                            onChange={() => setOutcomePosition(positionIndex)}
                            label={position}
                            disabled={isSubmitting}
                            key={position}
                        />
                    );
                })}
            </Positions>
            <ButtonContainer>{getSubmitButton()}</ButtonContainer>
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={fixedBondAmount}
                    tokenSymbol={PAYMENT_CURRENCY}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 40px;
    align-items: center;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 25px;
    flex: initial;
    padding: 30px 20px 40px 20px;
    width: 100%;
`;

const Title = styled(FlexDivColumn)`
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 40px;
`;

const Positions = styled(FlexDivColumn)`
    label {
        align-self: start;
    }
`;

const MarketButton = styled(Button)`
    height: 32px;
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 40px 0 0px 0;
`;

export default ResolveMarket;
