import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import Button from 'components/Button';
import Modal from 'components/Modal';

type CreateMarketModalProps = {
    isSubmitting: boolean;
    onSubmit: () => void;
    onClose: () => void;
};

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({ isSubmitting, onSubmit, onClose }) => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const isButtonDisabled = !isWalletConnected || isSubmitting;

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <ModalButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </ModalButton>
            );
        }
        return (
            <ModalButton
                disabled={isButtonDisabled}
                onClick={() => {
                    onClose();
                    onSubmit();
                }}
            >
                {t('market.create-market.modal.button-label')}
            </ModalButton>
        );
    };

    return (
        <Modal title={t('market.create-market.modal.title')} onClose={onClose} shouldCloseOnOverlayClick={false}>
            <Container>
                {t('market.create-market.modal.text')}
                <ButtonContainer>{getSubmitButton()}</ButtonContainer>
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    color: ${(props) => props.theme.textColor.primary};
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 18px;
    text-align: justify;
    max-width: 500px;
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 30px 0 0 0;
`;

const ModalButton = styled(Button)``;

export default CreateMarketModal;
