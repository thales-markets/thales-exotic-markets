import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { DisputeInfo } from 'types/markets';

type DisputeOverviewProps = {
    disputeInfo: DisputeInfo;
    status: string;
};

const DisputeOverview: React.FC<DisputeOverviewProps> = ({ disputeInfo, status }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <Label>{t('market.dispute.disputer-label')}:</Label>
            <Content>{disputeInfo.disputer}</Content>
            <Label>{t('market.dispute.status-label')}:</Label>
            <Content>{t(`market.dispute.status.${status}`)}</Content>
            <Label>{t('market.dispute.reason-for-dispute-label')}:</Label>
            <Content>{disputeInfo.reasonForDispute}</Content>
        </Container>
    );
};

const Container = styled(FlexDivColumn)``;

const Label = styled.span`
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 10px;
`;

const Content = styled.span`
    font-size: 18px;
    line-height: 25px;
    text-align: justify;
    margin-bottom: 20px;
`;

export default DisputeOverview;
