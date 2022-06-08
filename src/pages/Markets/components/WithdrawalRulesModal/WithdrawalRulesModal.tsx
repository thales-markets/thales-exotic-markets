import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import Modal from 'components/Modal';

type WithdrawalRulesModalProps = {
    onClose: () => void;
    withdrawalPeriodInHours: string | number;
    isTicketType: boolean;
};

export const WithdrawalRulesModal: React.FC<WithdrawalRulesModalProps> = ({
    onClose,
    withdrawalPeriodInHours,
    isTicketType,
}) => {
    const { t } = useTranslation();

    return (
        <Modal title={t('market.withdrawal-rules-modal.title')} onClose={onClose}>
            <Container>
                <Trans
                    i18nKey={`market.withdrawal-rules-modal.${isTicketType ? 'ticket-text' : 'open-bid-text'}`}
                    components={[
                        <ul key="1">
                            <li key="0" />
                        </ul>,
                    ]}
                    values={{ withdrawalPeriodInHours }}
                />
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
    ul {
        list-style: initial;
        margin-left: 15px;
    }
    li {
        :not(:last-child) {
            margin-bottom: 10px;
        }
    }
    max-width: 500px;
`;

export default WithdrawalRulesModal;
