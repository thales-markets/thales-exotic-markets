import { DisputeStatus } from 'constants/markets';
import useDisputeQuery from 'queries/markets/useDisputeQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivRow } from 'styles/common';
import { DisputeInfo, DisputeData, AccountDisputeData } from 'types/markets';
import DisputeOverview from './DisputeOverview';
import DisputeVoting from './DisputeVoting';
import DisputeVotingResults from './DisputeVotingResults';
import DisputeHeader from './DisputeHeader';
import useAccountDisputeDataQuery from 'queries/markets/useAccountDisputeDataQuery';

type DisputeCardProps = {
    disputeInfo: DisputeInfo;
    isOracleCouncilMember: boolean;
    positions: string[];
    winningPosition: number;
};

const DisputeCard: React.FC<DisputeCardProps> = ({
    disputeInfo,
    isOracleCouncilMember,
    positions,
    winningPosition,
}) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [isActive, setIsActive] = useState<boolean>(disputeInfo.status === DisputeStatus.Open);
    const [disputeData, setDisputeData] = useState<DisputeData | undefined>(undefined);
    const [
        canDisputorClaimbackBondFromUnclosedDispute,
        setCanDisputorClaimbackBondFromUnclosedDispute,
    ] = useState<boolean>(false);

    const outcomePositions = [t('common.cancel'), ...positions];

    const disputeQuery = useDisputeQuery(disputeInfo.market, disputeInfo.disputeNumber, outcomePositions, networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (disputeQuery.isSuccess && disputeQuery.data) {
            setDisputeData(disputeQuery.data);
        }
    }, [disputeQuery.isSuccess, disputeQuery.data]);

    const { voteOnContract, positionOnContract } = useMemo(() => {
        if (isOracleCouncilMember && disputeData && isWalletConnected) {
            const walletVote = disputeData.disputeVotes.find(
                (vote) => vote.voter.toLowerCase() === walletAddress.toLowerCase()
            );
            if (walletVote) {
                return {
                    voteOnContract: walletVote.vote,
                    positionOnContract: walletVote.position,
                };
            }
        }
        return {
            voteOnContract: -1,
            positionOnContract: -1,
        };
    }, [isOracleCouncilMember, disputeData, isWalletConnected]);

    const accountDisputeDataQuery = useAccountDisputeDataQuery(
        disputeInfo.market,
        disputeInfo.disputeNumber,
        walletAddress,
        {
            enabled: isAppReady && isWalletConnected,
        }
    );

    useEffect(() => {
        if (accountDisputeDataQuery.isSuccess && accountDisputeDataQuery.data) {
            setCanDisputorClaimbackBondFromUnclosedDispute(
                (accountDisputeDataQuery.data as AccountDisputeData).canDisputorClaimbackBondFromUnclosedDispute
            );
        }
    }, [accountDisputeDataQuery.isSuccess, accountDisputeDataQuery.data]);

    const showDisputeVoting = isOracleCouncilMember && disputeData && disputeData.isOpenForVoting;
    const showDisputeVotingResults = disputeData && disputeData.status !== DisputeStatus.Cancelled;
    const showDisputeVotingData = showDisputeVoting || showDisputeVotingResults;

    const disabled =
        !!disputeData &&
        ((disputeData.status === DisputeStatus.Cancelled && !canDisputorClaimbackBondFromUnclosedDispute) ||
            disputeData.status === DisputeStatus.RefusedOnPositioning ||
            disputeData.status === DisputeStatus.RefusedMature);

    return (
        <>
            {isActive ? (
                <Container className={disabled ? 'disabled' : ''}>
                    <DisputeOverview
                        disputeInfo={disputeInfo}
                        status={disputeData ? disputeData.status : undefined}
                        canDisputorClaimbackBondFromUnclosedDispute={canDisputorClaimbackBondFromUnclosedDispute}
                    />
                    {showDisputeVotingData && (
                        <VotingContainer>
                            {showDisputeVoting && (
                                <DisputeVoting
                                    voteOnContract={voteOnContract}
                                    disputeInfo={disputeInfo}
                                    positions={positions}
                                    positionOnContract={positionOnContract}
                                    winningPosition={winningPosition}
                                />
                            )}
                            {showDisputeVotingResults && (
                                <DisputeVotingResults
                                    votingResults={disputeData.disputeVotingResults}
                                    positions={outcomePositions}
                                />
                            )}
                        </VotingContainer>
                    )}
                    <ArrowUpIcon onClick={() => setIsActive(false)} />
                </Container>
            ) : (
                <DisputeHeader
                    disputeInfo={disputeInfo}
                    status={disputeData ? disputeData.status : undefined}
                    onClick={() => setIsActive(true)}
                    canDisputorClaimbackBondFromUnclosedDispute={canDisputorClaimbackBondFromUnclosedDispute}
                    disabled={disabled}
                />
            )}
        </>
    );
};

const Container = styled(FlexDivRow)`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 15px;
    font-style: normal;
    font-weight: normal;
    padding: 20px 10px 20px 10px;
    margin-bottom: 30px;
    color: ${(props) => props.theme.textColor.primary};
    position: relative;
    @media (max-width: 991px) {
        flex-direction: column;
    }
    @media (max-width: 575px) {
        padding: 20px 0px;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const ArrowUpIcon = styled.i`
    font-size: 25px;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    margin: 24px 30px 0 0;
    &:before {
        font-family: ExoticIcons !important;
        content: '\\004C';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

// const StyledArrowUp = styled(ArrowUpIcon)`
//     position: absolute;
//     top: 0;
//     right: 0;
//     margin: 18px 30px 0 0;
//     cursor: pointer;
//     height: 25px;
//     width: 25px;
// `;

const VotingContainer = styled(FlexDivRow)`
    margin-right: 20px;
    margin-left: 20px;
    @media (max-width: 991px) {
        border-top: 2px solid ${(props) => props.theme.borderColor.primary};
        padding-top: 20px;
    }
    > div {
        border-left: 2px solid ${(props) => props.theme.borderColor.primary};
        padding-left: 20px;
        :not(:last-child) {
            padding-right: 20px;
        }
        @media (max-width: 991px) {
            flex-direction: column;
            width: 100%;
            :first-child {
                border: none;
            }
            padding-left: 0px;
            :first-child:not(:last-child) {
                padding-right: 20px;
            }
            :last-child:not(:first-child) {
                padding-left: 20px;
            }
        }
    }
`;

export default DisputeCard;
