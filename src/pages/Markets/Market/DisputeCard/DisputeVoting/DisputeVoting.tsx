import Button from 'components/Button';
import RadioButton from 'components/fields/RadioButton';
import WarningMessage from 'components/WarningMessage';
import { getErrorToastOptions, getSuccessToastOptions } from 'config/toast';
import {
    DisputeVotingOption,
    DISPUTE_VOTING_OPTIONS_MARKET_OPEN,
    DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED,
    DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS,
} from 'constants/markets';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { DisputeContractData, DisputeInfo } from 'types/markets';
import networkConnector from 'utils/networkConnector';

type DisputeVotingProps = {
    voteOnContract: number;
    disputeInfo: DisputeInfo;
    positions: string[];
    positionOnContract: number;
    disputeContractData: DisputeContractData;
};

const DisputeVoting: React.FC<DisputeVotingProps> = ({
    voteOnContract,
    disputeInfo,
    positions,
    positionOnContract,
    disputeContractData,
}) => {
    const { t } = useTranslation();
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [vote, setVote] = useState<number>(voteOnContract);
    const [selectedPosition, setSelectedPosition] = useState<number>(positionOnContract);
    const [currentVoteOnContract, setCurrentVoteOnContract] = useState<number>(voteOnContract);
    const [currentPositionOnContract, setCurrentPositionOnContract] = useState<number>(positionOnContract);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const disputeVotingOptions = disputeInfo.isInPositioningPhase
        ? DISPUTE_VOTING_OPTIONS_MARKET_OPEN
        : DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED;

    const showVoteButton = currentVoteOnContract === 0 && currentPositionOnContract === 0;
    const showChangeVoteButton = currentVoteOnContract !== vote || currentPositionOnContract !== selectedPosition;
    const isVoteSelected = vote > 0;
    const isPositionSelected =
        (vote === DisputeVotingOption.ACCEPT_RESULT && selectedPosition > 0) ||
        vote !== DisputeVotingOption.ACCEPT_RESULT;

    const isDisputeWinningPositionChoosen = disputeContractData.disputeWinningPositionChoosen > 0;
    const isFirstMemberThatChooseWinningPosition =
        walletAddress.toLowerCase() === disputeContractData.firstMemberThatChooseWinningPosition.toLowerCase();

    const showWinningPositionMismatchWarning =
        isDisputeWinningPositionChoosen &&
        !isFirstMemberThatChooseWinningPosition &&
        isPositionSelected &&
        vote === DisputeVotingOption.ACCEPT_RESULT &&
        disputeContractData.disputeWinningPositionChoosen !== selectedPosition;

    const showFirstMemberChangePositionWarning =
        isDisputeWinningPositionChoosen &&
        isFirstMemberThatChooseWinningPosition &&
        isPositionSelected &&
        vote === DisputeVotingOption.ACCEPT_RESULT &&
        disputeContractData.disputeWinningPositionChoosen !== selectedPosition &&
        disputeContractData.acceptResultVotesCount > 1;

    const isButtonDisabled =
        isSubmitting ||
        !isVoteSelected ||
        !isPositionSelected ||
        showWinningPositionMismatchWarning ||
        showFirstMemberChangePositionWarning;

    const handleVote = async () => {
        const { thalesOracleCouncilContract, signer } = networkConnector;
        if (thalesOracleCouncilContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);

            try {
                const thalesOracleCouncilContractWithSigner = thalesOracleCouncilContract.connect(signer);

                const tx = await thalesOracleCouncilContractWithSigner.voteForDispute(
                    disputeInfo.market,
                    disputeInfo.disputeNumber,
                    vote,
                    vote === DisputeVotingOption.ACCEPT_RESULT ? selectedPosition : 0
                );
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(id, getSuccessToastOptions(t('market.toast-messsage.vote-success')));
                    setIsSubmitting(false);
                    setCurrentVoteOnContract(vote);
                    setCurrentPositionOnContract(selectedPosition);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsSubmitting(false);
            }
        }
    };

    const getSubmitButton = () => {
        if (!isVoteSelected) {
            return (
                <VoteButton type="secondary" disabled={true}>
                    {t(`common.errors.select-vote`)}
                </VoteButton>
            );
        }
        if (!isPositionSelected) {
            return (
                <VoteButton type="secondary" disabled={true}>
                    {t(`common.errors.select-outcome`)}
                </VoteButton>
            );
        }

        if (showVoteButton) {
            return (
                <VoteButton type="secondary" disabled={isButtonDisabled} onClick={handleVote}>
                    {!isSubmitting
                        ? t('market.dispute.button.vote-label')
                        : t('market.dispute.button.vote-progress-label')}
                </VoteButton>
            );
        }
        return (
            <>
                {showChangeVoteButton && (
                    <VoteButton type="secondary" disabled={isButtonDisabled} onClick={handleVote}>
                        {!isSubmitting
                            ? t('market.dispute.button.change-vote-label')
                            : t('market.dispute.button.change-vote-progress-label')}
                    </VoteButton>
                )}
            </>
        );
    };

    return (
        <Container>
            <Title>{t('market.dispute.vote-label')}</Title>
            {disputeVotingOptions.map((votingOption) => {
                return (
                    <VoteOptionsContainer key={votingOption}>
                        <RadioButton
                            checked={votingOption === vote}
                            value={votingOption}
                            onChange={() => setVote(votingOption)}
                            label={t(DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS[votingOption])}
                        />
                        {votingOption === DisputeVotingOption.ACCEPT_RESULT &&
                            vote === DisputeVotingOption.ACCEPT_RESULT &&
                            positions.map((position: string, index: number) => {
                                return (
                                    <PositionsContainer key={position}>
                                        <RadioButton
                                            checked={index + 1 === selectedPosition}
                                            value={index + 1}
                                            onChange={() => setSelectedPosition(index + 1)}
                                            label={position}
                                        />
                                    </PositionsContainer>
                                );
                            })}
                    </VoteOptionsContainer>
                );
            })}
            {getSubmitButton()}
            <WarningContainer>
                {showWinningPositionMismatchWarning && (
                    <WarningMessage message={t('market.dispute.voting-warning-message.winning-position-mismatch')} />
                )}
                {showFirstMemberChangePositionWarning && (
                    <WarningMessage message={t('market.dispute.voting-warning-message.first-member-change-position')} />
                )}
            </WarningContainer>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    flex: initial;
    width: 280px;
`;

const Title = styled.span`
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 20px;
`;

const VoteOptionsContainer = styled.div`
    label {
        padding-left: 22px;
        font-size: 15px;
        line-height: 20px;
        margin-bottom: 6px;
        white-space: break-spaces;
    }
    span {
        :after {
            left: 2px;
            top: 2px;
            width: 6px;
            height: 6px;
        }
        height: 16px;
        width: 16px;
        border: 3px solid ${(props) => props.theme.borderColor.primary};
        margin-top: 1px;
    }
`;

const PositionsContainer = styled(VoteOptionsContainer)`
    margin-left: 22px;
`;

const VoteButton = styled(Button)`
    font-size: 15px;
    padding: 4px 10px;
    margin-top: 10px;
`;

const WarningContainer = styled(FlexDivColumn)`
    div {
        font-size: 13px;
    }
`;

export default DisputeVoting;
