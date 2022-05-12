import TextAreaInput from 'components/fields/TextAreaInput';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivStart } from 'styles/common';
import Button from 'components/Button';
import { MarketStatus, MAXIMUM_INPUT_CHARACTERS } from 'constants/markets';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import useMarketQuery from 'queries/markets/useMarketQuery';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { RouteComponentProps } from 'react-router-dom';
import { MarketData, MarketsParameters } from 'types/markets';
import networkConnector from 'utils/networkConnector';
import { BigNumber, ethers } from 'ethers';
import { checkAllowance } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import { DEFAULT_CURRENCY_DECIMALS, PAYMENT_CURRENCY } from 'constants/currency';
import ApprovalModal from 'components/ApprovalModal';
import usePaymentTokenBalanceQuery from 'queries/wallet/usePaymentTokenBalanceQuery';
import { MAX_GAS_LIMIT } from 'constants/network';
import { buildMarketLink, navigateTo } from 'utils/routes';
import useOracleCouncilMemberQuery from 'queries/oracleCouncil/useOracleCouncilMemberQuery';
import SimpleLoader from 'components/SimpleLoader';
import WarningMessage from 'components/WarningMessage';
import { toast } from 'react-toastify';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { BondInfo, InfoContent, InfoLabel } from 'components/common';
import BackToLink from 'pages/Markets/components/BackToLink';
import useMarketsParametersQuery from 'queries/markets/useMarketsParametersQuery';
import GuidelinesModal from 'pages/Markets/components/GuidelinesModal';

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
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [reasonForDispute, setReasonForDispute] = useState<string>('');
    const [paymentTokenBalance, setPaymentTokenBalance] = useState<number | string>('');
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [openGuidelinesModal, setOpenGuidelinesModal] = useState<boolean>(false);
    const [market, setMarket] = useState<MarketData | undefined>(undefined);
    const [isOracleCouncilMember, setIsOracleCouncilMember] = useState<boolean>(false);
    const [marketsParameters, setMarketsParameters] = useState<MarketsParameters | undefined>(undefined);

    const { params } = props.match;
    const marketAddress = params && params.marketAddress ? params.marketAddress : '';

    const marketQuery = useMarketQuery(marketAddress, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            setMarket(marketQuery.data);
        }
    }, [marketQuery.isSuccess, marketQuery.data]);

    const paymentTokenBalanceQuery = usePaymentTokenBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (paymentTokenBalanceQuery.isSuccess && paymentTokenBalanceQuery.data !== undefined) {
            setPaymentTokenBalance(Number(paymentTokenBalanceQuery.data));
        }
    }, [paymentTokenBalanceQuery.isSuccess, paymentTokenBalanceQuery.data]);

    const oracleCouncilMemberQuery = useOracleCouncilMemberQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (oracleCouncilMemberQuery.isSuccess && oracleCouncilMemberQuery.data !== undefined) {
            setIsOracleCouncilMember(oracleCouncilMemberQuery.data);
        }
    }, [oracleCouncilMemberQuery.isSuccess, oracleCouncilMemberQuery.data]);

    const marketsParametersQuery = useMarketsParametersQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (marketsParametersQuery.isSuccess && marketsParametersQuery.data) {
            setMarketsParameters(marketsParametersQuery.data);
        }
    }, [marketsParametersQuery.isSuccess, marketsParametersQuery.data]);

    const disputeStringLengthLimit = marketsParameters
        ? marketsParameters.disputeStringLengthLimit
        : MAXIMUM_INPUT_CHARACTERS;

    const canOpenDispute =
        market &&
        !market.isMarketClosedForDisputes &&
        !isOracleCouncilMember &&
        walletAddress.toLowerCase() !== market.creator.toLowerCase() &&
        !market.isPaused &&
        market.status !== MarketStatus.CancelledConfirmed;

    const disputePrice = market ? market.disputePrice : 0;
    const arbitraryRewardForDisputor = market ? market.arbitraryRewardForDisputor : 0;

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

    const handleSubmit = async () => {
        const { thalesOracleCouncilContract, signer } = networkConnector;
        if (thalesOracleCouncilContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);

            try {
                const thalesOracleCouncilContractWithSigner = thalesOracleCouncilContract.connect(signer);

                const tx = await thalesOracleCouncilContractWithSigner.openDispute(marketAddress, reasonForDispute);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t('market.toast-messsage.open-dispute-success')));
                    setIsSubmitting(false);
                    navigateTo(buildMarketLink(marketAddress, true));
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
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
        if (market && market.isPaused) {
            return t('market.dispute.disputes-disabled-message.market-paused');
        }
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
                    <BackToLink link={buildMarketLink(marketAddress)} text={t('market.back-to-market')} />
                    <Form>
                        <Title>
                            {t(
                                market.isResolved
                                    ? 'market.dispute.open-dispute-maturity-title'
                                    : 'market.dispute.open-dispute-title',
                                { question: market.question }
                            )}
                        </Title>
                        {market.isResolved && (
                            <CurrentResultInfo>
                                <InfoLabel>{t('market.dispute.current-result-label')}:</InfoLabel>
                                <CurrentResultContent>
                                    {market.positions[market.winningPosition - 1]}
                                </CurrentResultContent>
                            </CurrentResultInfo>
                        )}
                        {!market.isResolved && (
                            <OpenDisputeNote>
                                {t('market.dispute.open-dispute-note-label')}{' '}
                                <GuidelinesNote onClick={() => setOpenGuidelinesModal(true)}>
                                    {t('common.guidelines')}.
                                </GuidelinesNote>
                            </OpenDisputeNote>
                        )}
                        <TextAreaInput
                            value={reasonForDispute}
                            onChange={setReasonForDispute}
                            label={t('market.dispute.reason-for-dispute-label')}
                            note={t('common.input-characters-note', {
                                entered: reasonForDispute.length,
                                max: disputeStringLengthLimit,
                            })}
                            maximumCharacters={disputeStringLengthLimit}
                            disabled={isSubmitting || !canOpenDispute}
                        />
                        <ButtonContainer>
                            <BondInfo>
                                <Trans
                                    i18nKey={'market.dispute.open-dispute-bond-info'}
                                    components={[
                                        <ul key="1">
                                            <li key="0" />
                                        </ul>,
                                    ]}
                                    values={{
                                        amount: formatCurrencyWithKey(
                                            PAYMENT_CURRENCY,
                                            disputePrice,
                                            DEFAULT_CURRENCY_DECIMALS,
                                            true
                                        ),
                                        minReward: formatCurrencyWithKey(
                                            PAYMENT_CURRENCY,
                                            arbitraryRewardForDisputor,
                                            DEFAULT_CURRENCY_DECIMALS,
                                            true
                                        ),
                                        maxReward: formatCurrencyWithKey(
                                            PAYMENT_CURRENCY,
                                            disputePrice,
                                            DEFAULT_CURRENCY_DECIMALS,
                                            true
                                        ),
                                    }}
                                />
                            </BondInfo>
                            {getSubmitButton()}
                        </ButtonContainer>
                        {!canOpenDispute && <WarningMessage>{getDisputesDisabledMessage()}</WarningMessage>}
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
                    {openGuidelinesModal && <GuidelinesModal onClose={() => setOpenGuidelinesModal(false)} />}
                </>
            ) : (
                <SimpleLoader />
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
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
    margin-bottom: 60px;
`;

const CurrentResultInfo = styled(FlexDivStart)`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 20px;
`;

const CurrentResultContent = styled(InfoContent)`
    color: ${(props) => props.theme.textColor.secondary};
    font-style: italic;
`;

const OpenDisputeNote = styled(FlexDivStart)`
    font-style: normal;
    font-size: 18px;
    line-height: 20px;
    margin-bottom: 20px;
    display: inline;
    text-align: justify;
`;

const GuidelinesNote = styled.span`
    font-style: italic;
    font-weight: bold;
    cursor: pointer;
`;

const Form = styled(FlexDivColumn)`
    margin-top: 20px;
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 25px;
    flex: initial;
    padding: 30px 20px 40px 20px;
    width: 100%;
`;

const DisputeButton = styled(Button)``;

const ButtonContainer = styled(FlexDivColumn)`
    margin: 20px 0 0 0;
    align-items: center;
`;

export default OpenDispute;
