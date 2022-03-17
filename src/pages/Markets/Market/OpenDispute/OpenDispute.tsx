import TextAreaInput from 'components/fields/TextAreaInput';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';
import Button from 'components/Button';
import { MAXIMUM_INPUT_CHARACTERS } from 'constants/markets';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import useMarketQuery from 'queries/markets/useMarketQuery';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { RouteComponentProps } from 'react-router-dom';
import { MarketData, MarketsParameters } from 'types/markets';
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
import { buildMarketLink, navigateTo } from 'utils/routes';
import useOracleCouncilMemberQuery from 'queries/oracleCouncil/useOracleCouncilMemberQuery';
import SimpleLoader from 'components/SimpleLoader';
import WarningMessage from 'components/WarningMessage';

type OpenDisputeProps = RouteComponentProps<{
    marketAddress: string;
}>;

const OpenDispute: React.FC<OpenDisputeProps> = (props) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [reasonForDispute, setReasonForDispute] = useState<string>('');
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | string>('');
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);

    const { params } = props.match;
    const marketAddress = params && params.marketAddress ? params.marketAddress : '';

    const marketQuery = useMarketQuery(marketAddress, {
        enabled: isAppReady,
    });

    const market: MarketData | undefined = useMemo(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            return marketQuery.data as MarketData;
        }
        return undefined;
    }, [marketQuery.isSuccess, marketQuery.data]);

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

    const oracleCouncilMemberQuery = useOracleCouncilMemberQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const isOracleCouncilMember: boolean = useMemo(() => {
        if (oracleCouncilMemberQuery.isSuccess && oracleCouncilMemberQuery.data) {
            return oracleCouncilMemberQuery.data as boolean;
        }
        return false;
    }, [oracleCouncilMemberQuery.isSuccess, oracleCouncilMemberQuery.data]);

    const canOpenDispute =
        market &&
        !market.isMarketClosedForDisputes &&
        !isOracleCouncilMember &&
        walletAddress.toLowerCase() !== market.creator.toLowerCase();

    const disputePrice = marketsParameters ? marketsParameters.disputePrice : 0;

    const isReasonForDisputeEntered = reasonForDispute.trim() !== '';
    const insufficientBalance = Number(paymentTokenBalance) < Number(disputePrice) || Number(paymentTokenBalance) === 0;

    const isButtonDisabled =
        isSubmitting ||
        !isWalletConnected ||
        !hasAllowance ||
        !isReasonForDisputeEntered ||
        insufficientBalance ||
        !canOpenDispute;

    useEffect(() => {
        const { paymentTokenContract, thalesBondsContract, signer } = networkConnector;
        if (paymentTokenContract && thalesBondsContract && signer) {
            const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
            const addressToApprove = thalesBondsContract.address;
            const getAllowance = async () => {
                try {
                    const parsedAmount = ethers.utils.parseEther(Number(disputePrice).toString());
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
    }, [walletAddress, isWalletConnected, hasAllowance, disputePrice, isAllowing]);

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
        const { thalesOracleCouncilContract, signer } = networkConnector;
        if (thalesOracleCouncilContract && signer) {
            setTxErrorMessage(null);
            setIsSubmitting(true);

            try {
                const thalesOracleCouncilContractWithSigner = thalesOracleCouncilContract.connect(signer);

                const tx = await thalesOracleCouncilContractWithSigner.openDispute(marketAddress, reasonForDispute);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    // dispatchMarketNotification(t('migration.migrate-button.confirmation-message'));
                    setIsSubmitting(false);
                    navigateTo(buildMarketLink(marketAddress));
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
                <DisputeButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </DisputeButton>
            );
        }
        if (!canOpenDispute) {
            return <DisputeButton disabled={true}>{t(`market.dispute.button.open-dispute-label`)}</DisputeButton>;
        }
        if (insufficientBalance) {
            return <DisputeButton disabled={true}>{t(`common.errors.insufficient-balance`)}</DisputeButton>;
        }
        if (!isReasonForDisputeEntered) {
            return <DisputeButton disabled={true}>{t(`common.errors.enter-reason-for-dispute`)}</DisputeButton>;
        }
        if (!hasAllowance) {
            return (
                <DisputeButton disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: PAYMENT_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: PAYMENT_CURRENCY,
                          })}
                </DisputeButton>
            );
        }
        return (
            <DisputeButton disabled={isButtonDisabled} onClick={handleSubmit}>
                {!isSubmitting
                    ? t('market.dispute.button.open-dispute-label')
                    : t('market.dispute.button.open-dispute-progress-label')}
            </DisputeButton>
        );
    };

    const getDisputesDisabledMessage = () => {
        if (market && market.isMarketClosedForDisputes) {
            return t('market.dispute.disputes-disabled-message.market-closed');
        }
        if (isOracleCouncilMember) {
            return t('market.dispute.disputes-disabled-message.council-members');
        }
        if (market && walletAddress.toLowerCase() === market.creator.toLowerCase()) {
            return t('market.dispute.disputes-disabled-message.creator');
        }
        return '';
    };

    return (
        <Container>
            {market ? (
                <>
                    <Form>
                        <Title>{t('market.dispute.open-dispute-title', { question: market.question })}</Title>
                        <TextAreaInput
                            value={reasonForDispute}
                            onChange={setReasonForDispute}
                            label={t('market.dispute.reason-for-dispute-label')}
                            note={t('common.input-characters-note', {
                                entered: reasonForDispute.length,
                                max: MAXIMUM_INPUT_CHARACTERS,
                            })}
                            maximumCharacters={MAXIMUM_INPUT_CHARACTERS}
                            disabled={isSubmitting || !canOpenDispute}
                        />
                        <ButtonContainer>{getSubmitButton()}</ButtonContainer>
                        <ValidationMessage
                            showValidation={txErrorMessage !== null}
                            message={txErrorMessage}
                            onDismiss={() => setTxErrorMessage(null)}
                        />
                        {!canOpenDispute && <WarningMessage message={getDisputesDisabledMessage()} />}
                    </Form>
                    {openApprovalModal && (
                        <ApprovalModal
                            defaultAmount={disputePrice}
                            tokenSymbol={PAYMENT_CURRENCY}
                            isAllowing={isAllowing}
                            onSubmit={handleAllowance}
                            onClose={() => setOpenApprovalModal(false)}
                        />
                    )}
                </>
            ) : (
                <SimpleLoader />
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 50px;
    align-items: center;
    width: 690px;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const Title = styled(FlexDivColumn)`
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 80px;
`;

const Form = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 25px;
    flex: initial;
    padding: 30px 20px 40px 20px;
    width: 100%;
`;

const DisputeButton = styled(Button)`
    height: 32px;
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 20px 0 0 0;
`;

export default OpenDispute;
