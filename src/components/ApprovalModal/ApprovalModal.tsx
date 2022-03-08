import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import { BigNumber, ethers } from 'ethers';
import { bigNumberFormatter } from 'utils/formatters/ethers';
import ValidationMessage from 'components/ValidationMessage';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';
import { FlexDiv, FlexDivCentered, FlexDivColumnCentered, FlexDivRow } from 'styles/common';
import Checkbox from 'components/fields/Checkbox';
import NumericInput from 'components/fields/NumericInput';
import Modal from 'react-modal';
import Button from 'components/Button';

type ApprovalModalProps = {
    defaultAmount: number | string;
    tokenSymbol: string;
    isAllowing: boolean;
    onSubmit: (approveAmount: BigNumber) => void;
    onClose: () => void;
};

Modal.setAppElement('#root');

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
    defaultAmount,
    tokenSymbol,
    isAllowing,
    onSubmit,
    onClose,
}) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [amount, setAmount] = useState<number | string>(defaultAmount);
    const [approveAll, setApproveAll] = useState<boolean>(true);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isAmountValid, setIsAmountValid] = useState<boolean>(true);

    const maxApproveAmount = bigNumberFormatter(ethers.constants.MaxUint256);
    const isAmountEntered = Number(amount) > 0;
    const isButtonDisabled = !isWalletConnected || isAllowing || (!approveAll && (!isAmountEntered || !isAmountValid));

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <ModalButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </ModalButton>
            );
        }
        if (!approveAll && !isAmountEntered) {
            return <ModalButton disabled={true}>{t(`common.errors.enter-amount`)}</ModalButton>;
        }
        return (
            <ModalButton
                disabled={isButtonDisabled}
                onClick={() =>
                    onSubmit(
                        approveAll ? ethers.constants.MaxUint256 : ethers.utils.parseEther(Number(amount).toString())
                    )
                }
            >
                {!isAllowing
                    ? t('common.enable-wallet-access.approve-label', { currencyKey: tokenSymbol })
                    : t('common.enable-wallet-access.approve-progress-label', {
                          currencyKey: tokenSymbol,
                      })}
            </ModalButton>
        );
    };

    useEffect(() => {
        setIsAmountValid(Number(amount) === 0 || (Number(amount) > 0 && Number(amount) <= maxApproveAmount));
    }, [amount]);

    return (
        <Modal
            isOpen
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                    padding: '0px',
                    maxWidth: '500px',
                    top: 'calc(50% - 250px)',
                    left: 'calc(50% - 250px)',
                    height: 'fit-content',
                    border: 'none',
                    background: 'transparent',
                },
            }}
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        {t('common.enable-wallet-access.approve-label', { currencyKey: tokenSymbol })}
                    </ModalTitle>
                    <FlexDivRow>{<CloseIcon onClick={onClose} />}</FlexDivRow>
                </ModalHeader>
                <FlexDivColumnCentered>
                    <CheckboxContainer>
                        <Checkbox
                            disabled={isAllowing}
                            checked={approveAll}
                            value={approveAll.toString()}
                            onChange={(e: any) => setApproveAll(e.target.checked || false)}
                            label={t('common.enable-wallet-access.approve-all-label')}
                        />
                    </CheckboxContainer>
                    <OrText>{t('common.or')}</OrText>
                    <NumericInput
                        value={amount}
                        onChange={(_, value) => setAmount(value)}
                        disabled={approveAll || isAllowing}
                        label={t('common.enable-wallet-access.custom-amount-label')}
                        currencyLabel={tokenSymbol}
                        showValidation={!approveAll && !isAmountValid}
                        validationMessage={t('common.errors.invalid-amount-max', { max: maxApproveAmount })}
                    />
                </FlexDivColumnCentered>
                <ModalButtonContainer>{getSubmitButton()}</ModalButtonContainer>
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </ModalContainer>
        </Modal>
    );
};

const ModalContainer = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    background: ${(props) => props.theme.background.primary};
    padding: 25px 30px 35px 30px;
    overflow: auto;
    border-radius: 23px;
    @media (max-width: 512px) {
        padding: 10px;
    }
`;

const ModalHeader = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

const ModalTitle = styled(FlexDiv)`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

const ModalButtonContainer = styled(FlexDivCentered)`
    margin: 30px 0 10px 0;
`;

const ModalButton = styled(Button)`
    height: 32px;
`;

const CloseIcon = styled.i`
    font-size: 20px;
    cursor: pointer;
    &:before {
        font-family: Icons !important;
        content: '\\0076';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export const CheckboxContainer = styled(FlexDivCentered)`
    margin: 40px 0 5px 0;
    label {
        font-size: 25px;
        line-height: 52px;
        padding-left: 32px;
    }
    span {
        :after {
            height: 14px;
            width: 5px;
            left: 5px;
            top: -1px;
            border-width: 0 3px 3px 0;
        }
        height: 25px;
        width: 25px;
    }
`;

const OrText = styled(FlexDivCentered)`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 20px;
`;

export default ApprovalModal;
