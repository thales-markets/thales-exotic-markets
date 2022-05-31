import Button from 'components/Button';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';
import { MAX_GAS_LIMIT } from 'constants/network';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { DisputeInfo } from 'types/markets';
import networkConnector from 'utils/networkConnector';

type DisputeOverviewProps = {
    disputeInfo: DisputeInfo;
    status?: string;
    canDisputorClaimbackBondFromUnclosedDispute: boolean;
};

const DisputeOverview: React.FC<DisputeOverviewProps> = ({
    disputeInfo,
    status,
    canDisputorClaimbackBondFromUnclosedDispute,
}) => {
    const { t } = useTranslation();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleClaim = async () => {
        const { thalesOracleCouncilContract, signer } = networkConnector;
        if (thalesOracleCouncilContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);

            try {
                const thalesOracleCouncilContractWithSigner = thalesOracleCouncilContract.connect(signer);

                const tx = await thalesOracleCouncilContractWithSigner.claimUnclosedDisputeBonds(
                    disputeInfo.market,
                    disputeInfo.disputeNumber,
                    {
                        gasLimit: MAX_GAS_LIMIT,
                    }
                );
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t('market.toast-messsage.claim-refund-success')));
                    setIsSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Container>
            <Overview>
                <Label>{t('market.dispute.disputer-label')}:</Label>
                <Content>{disputeInfo.disputer}</Content>
                <Label>{t('market.dispute.status-label')}:</Label>
                <StatusContainer>
                    <Status>{status ? t(`market.dispute.status.${status}`) : ''}</Status>
                    {canDisputorClaimbackBondFromUnclosedDispute && (
                        <ClaimButton type="secondary" disabled={isSubmitting} onClick={handleClaim}>
                            {!isSubmitting
                                ? t('market.dispute.button.claim-refund-label')
                                : t('market.dispute.button.claim-refund-progress-label')}
                        </ClaimButton>
                    )}
                </StatusContainer>
                <Label>{t('market.dispute.reason-for-dispute-label')}:</Label>
                <Content>{disputeInfo.reasonForDispute}</Content>
            </Overview>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-left: 20px;
    width: 280px;
    @media (max-width: 991px) {
        :not(:last-child) {
            margin-bottom: 20px;
        }
        margin-right: 20px;
        width: auto;
    }
`;

const Overview = styled(FlexDivColumn)`
    flex: initial;
`;

const Label = styled.span`
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    margin-bottom: 10px;
`;

const Content = styled.span`
    font-size: 15px;
    line-height: 20px;
    text-align: justify;
    word-wrap: break-word;
    white-space: break-spaces;
    :not(:last-child) {
        margin-bottom: 15px;
    }
`;

const StatusContainer = styled(FlexDivColumn)`
    margin-bottom: 20px;
`;

const Status = styled(Content)`
    margin-bottom: 0px !important;
`;

const ClaimButton = styled(Button)`
    font-size: 15px;
    padding: 2px 10px;
    margin-top: 5px;
    min-height: 26px;
`;

export default DisputeOverview;
