import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected } from 'redux/modules/wallet';
import onboardConnector from 'utils/onboardConnector';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered } from 'styles/common';
import Button from 'components/Button';
import Modal from 'components/Modal';
import { LINKS } from 'constants/links';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { DEFAULT_CURRENCY_DECIMALS, PAYMENT_CURRENCY } from 'constants/currency';

type CreateMarketModalProps = {
    isSubmitting: boolean;
    onClose: () => void;
    fixedBondAmount: number | string;
    onSubmit: () => void;
    isOnOpenModal: boolean;
};

export const CreateMarketModal: React.FC<CreateMarketModalProps> = ({
    isSubmitting,
    onClose,
    fixedBondAmount,
    onSubmit,
    isOnOpenModal,
}) => {
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
                    if (!isOnOpenModal) {
                        onSubmit();
                    }
                }}
            >
                {t('market.create-market.modal.button-label')}
            </ModalButton>
        );
    };

    return (
        <Modal
            title={t('market.create-market.modal.title')}
            onClose={onClose}
            shouldCloseOnOverlayClick={false}
            hideClose
        >
            <Container>
                <WarningMessage>
                    <WarningIcon />
                    {isOnOpenModal
                        ? t('market.create-market.modal.warning-open')
                        : t('market.create-market.modal.warning-submit')}
                </WarningMessage>
                <Trans
                    i18nKey={'market.create-market.modal.text'}
                    components={[
                        <p key="0">
                            <ModalLink href={LINKS.ThalesGithubGuidelines} text="Thales github" />
                        </p>,
                        <p key="1">
                            <ModalLink href={LINKS.ThalesDiscord} text="Thales discord" />
                        </p>,
                        <p key="2">
                            <ModalLink href={LINKS.ThalesTip28} text="TIP-28" />
                        </p>,
                        <p key="3" />,
                    ]}
                    values={{
                        amount: formatCurrencyWithKey(
                            PAYMENT_CURRENCY,
                            fixedBondAmount,
                            DEFAULT_CURRENCY_DECIMALS,
                            true
                        ),
                    }}
                />
                <ButtonContainer>
                    <ProceedMessage>
                        {isOnOpenModal
                            ? t('market.create-market.modal.proceed-open')
                            : t('market.create-market.modal.proceed-submit')}
                    </ProceedMessage>
                    {getSubmitButton()}
                </ButtonContainer>
            </Container>
        </Modal>
    );
};

const Container = styled(FlexDivColumnCentered)`
    color: ${(props) => props.theme.textColor.primary};
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 20px;
    text-align: justify;
    max-width: 600px;
    p {
        margin-bottom: 15px;
    }
`;

const WarningMessage = styled(FlexDivCentered)`
    color: #e53720;
    font-size: 24px;
    margin-bottom: 15px;
`;

const WarningIcon = styled.i`
    font-size: 28px;
    font-style: normal;
    margin-right: 4px;
    &:before {
        font-family: ExoticIcons !important;
        content: '\\004A';
        color: #e53720;
    }
`;

const ButtonContainer = styled(FlexDivColumnCentered)`
    margin: 20px 0 0 0;
    align-items: center;
    font-size: 20px;
`;

const ProceedMessage = styled(FlexDivCentered)`
    margin-bottom: 10px;
`;

const ModalButton = styled(Button)``;

const Link = styled.a`
    color: #f983a5;
    &:hover {
        text-decoration: underline;
    }
`;

type ModalLinkProps = {
    href: string;
    text: string;
};

const ModalLink: React.FC<ModalLinkProps> = ({ href, text }) => {
    return (
        <Link target="_blank" rel="noreferrer" href={href}>
            {text}
        </Link>
    );
};

export default CreateMarketModal;
