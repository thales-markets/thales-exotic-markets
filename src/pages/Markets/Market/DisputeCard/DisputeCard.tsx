import { DisputeStatus } from 'constants/markets';
import useDisputeQuery from 'queries/markets/useDisputeQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivRow } from 'styles/common';
import { DisputeInfo, DisputeData } from 'types/markets';
import DisputeOverview from './DisputeOverview';
import DisputeVoting from './DisputeVoting';
import DisputeVotingResults from './DisputeVotingResults';

type DisputeCardProps = {
    disputeInfo: DisputeInfo;
    isOracleCouncilMember: boolean;
    positions: string[];
};

const DisputeCard: React.FC<DisputeCardProps> = ({ disputeInfo, isOracleCouncilMember, positions }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const disputeQuery = useDisputeQuery(disputeInfo.market, disputeInfo.disputeNumber, networkId, {
        enabled: isAppReady,
    });

    const disputeData: DisputeData | undefined = useMemo(() => {
        if (disputeQuery.isSuccess && disputeQuery.data) {
            return disputeQuery.data as DisputeData | undefined;
        }
        return undefined;
    }, [disputeQuery.isSuccess, disputeQuery.data]);

    const { voteOnContract, positionOnContract } = useMemo(() => {
        if (isOracleCouncilMember && disputeData && isWalletConnected) {
            const walletVote = disputeData.disputeVotes.find(
                (vote) => vote.voter.toLowerCase() === walletAddress.toLowerCase()
            );
            if (walletVote) {
                return {
                    voteOnContract: walletVote.vote,
                    positionOnContract: walletVote.vote,
                };
            }
        }
        return {
            voteOnContract: 0,
            positionOnContract: 0,
        };
    }, [isOracleCouncilMember, disputeData, isWalletConnected]);

    return (
        <Container>
            <DisputeOverview disputeInfo={disputeInfo} status={disputeData ? disputeData.status : ''} />
            {isOracleCouncilMember && disputeData && disputeData.isOpenForVoting && (
                <DisputeVoting
                    voteOnContract={voteOnContract}
                    disputeInfo={disputeInfo}
                    positions={positions}
                    positionOnContract={positionOnContract}
                />
            )}
            {disputeData && disputeData.status !== DisputeStatus.Cancelled && (
                <DisputeVotingResults votingResults={disputeData.disputeVotingResults} />
            )}
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

export default DisputeCard;
