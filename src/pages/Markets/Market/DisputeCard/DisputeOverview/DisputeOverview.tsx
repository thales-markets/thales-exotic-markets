import Button from 'components/Button';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';
import useAccountDisputeDataQuery from 'queries/markets/useAccountDisputeDataQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { AccountDisputeData, DisputeInfo } from 'types/markets';
import networkConnector from 'utils/networkConnector';

type DisputeOverviewProps = {
    disputeInfo: DisputeInfo;
    status?: string;
};

const DisputeOverview: React.FC<DisputeOverviewProps> = ({ disputeInfo, status }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const accountDisputeDataQuery = useAccountDisputeDataQuery(
        disputeInfo.market,
        disputeInfo.disputeNumber,
        walletAddress,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );

    const canDisputorClaimbackBondFromUnclosedDispute: boolean = useMemo(() => {
        if (accountDisputeDataQuery.isSuccess && accountDisputeDataQuery.data) {
            return (accountDisputeDataQuery.data as AccountDisputeData).canDisputorClaimbackBondFromUnclosedDispute;
        }
        return false;
    }, [accountDisputeDataQuery.isSuccess, accountDisputeDataQuery.data]);

    const handleClaim = async () => {
        const { thalesOracleCouncilContract, signer } = networkConnector;
        if (thalesOracleCouncilContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);

            try {
                const thalesOracleCouncilContractWithSigner = thalesOracleCouncilContract.connect(signer);

                const tx = await thalesOracleCouncilContractWithSigner.claimUnclosedDisputeBonds(
                    disputeInfo.market,
                    disputeInfo.disputeNumber
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
