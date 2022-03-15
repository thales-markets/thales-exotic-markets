import useDisputeVotingInfoQuery from 'queries/markets/useDisputeVotingInfoQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'styles/common';
import { DisputeInfo, DisputeVotingInfo } from 'types/markets';
import DisputeVoting from './DisputeVoting';
import DisputeVotingResults from './DisputeVotingResults';

type DisputeCardProps = {
    dispute: DisputeInfo;
    isMarketOpen: boolean;
    isOracleCouncilMember: boolean;
};

const DisputeCard: React.FC<DisputeCardProps> = ({ dispute, isMarketOpen, isOracleCouncilMember }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    const disputeVotingInfoQuery = useDisputeVotingInfoQuery(
        dispute.market,
        dispute.disputeNumber,
        isMarketOpen,
        networkId,
        {
            enabled: isAppReady,
        }
    );

    const disputeVotingInfo: DisputeVotingInfo | undefined = useMemo(() => {
        if (disputeVotingInfoQuery.isSuccess && disputeVotingInfoQuery.data) {
            return disputeVotingInfoQuery.data as DisputeVotingInfo;
        }
        return undefined;
    }, [disputeVotingInfoQuery.isSuccess, disputeVotingInfoQuery.data]);

    console.log(disputeVotingInfo);

    return (
        <Container>
            <Info>
                <InfoLabel>{t('market.dispute.disputer-label')}:</InfoLabel>
                <InfoConent>{dispute.disputor}</InfoConent>
                <InfoLabel>{t('market.dispute.status-label')}:</InfoLabel>
                <InfoConent>{'Open'}</InfoConent>
                <InfoLabel>{t('market.dispute.reason-for-dispute-label')}:</InfoLabel>
                <InfoConent>{dispute.reasonForDispute}</InfoConent>
            </Info>
            {isOracleCouncilMember && disputeVotingInfo && <DisputeVoting isInPositioningPhase={isMarketOpen} />}
            {disputeVotingInfo && <DisputeVotingResults votingResults={disputeVotingInfo.disputeVotingResults} />}
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 15px;
    font-style: normal;
    font-weight: normal;
    padding: 30px 10px;
    margin-bottom: 30px;
    color: ${(props) => props.theme.textColor.primary};
    > div {
        padding-right: 20px;
        padding-left: 20px;
        :not(:last-child) {
            border-right: 2px solid ${(props) => props.theme.borderColor.primary};
        }
    }
`;

const Info = styled(FlexDivColumn)``;

const InfoLabel = styled.span`
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 10px;
`;

const InfoConent = styled.span`
    font-size: 18px;
    line-height: 25px;
    text-align: justify;
    margin-bottom: 20px;
`;

export default DisputeCard;
