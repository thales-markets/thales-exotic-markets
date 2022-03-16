import Button from 'components/Button';
import RadioButton from 'components/fields/RadioButton';
import ValidationMessage from 'components/ValidationMessage';
import {
    DISPUTE_VOTING_OPTIONS_MARKET_OPEN,
    DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED,
    DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS,
} from 'constants/markets';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { DisputeInfo } from 'types/markets';
import networkConnector from 'utils/networkConnector';

type DisputeVotingProps = {
    voteOnContract: number;
    disputeInfo: DisputeInfo;
    // myPosition: boolean;
};

const DisputeVoting: React.FC<DisputeVotingProps> = ({ voteOnContract, disputeInfo }) => {
    const { t } = useTranslation();
    const [vote, setVote] = useState<number>(voteOnContract);
    const [currentVoteOnContract, setCurrentVoteOnContract] = useState<number>(voteOnContract);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const disputeVotingOptions = disputeInfo.isInPositioningPhase
        ? DISPUTE_VOTING_OPTIONS_MARKET_OPEN
        : DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED;

    const showVoteButton = currentVoteOnContract === 0;
    const showChangeVoteButton = currentVoteOnContract !== vote;
    const isVoteSelected = vote > 0;
    const isButtonDisabled = isSubmitting || !isVoteSelected;

    const handleVote = async () => {
        const { thalesOracleCouncilContract, signer } = networkConnector;
        if (thalesOracleCouncilContract && signer) {
            setTxErrorMessage(null);
            setIsSubmitting(true);

            try {
                const thalesOracleCouncilContractWithSigner = thalesOracleCouncilContract.connect(signer);

                const tx = await thalesOracleCouncilContractWithSigner.voteForDispute(
                    disputeInfo.market,
                    disputeInfo.disputeNumber,
                    vote,
                    0
                );
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    // dispatchMarketNotification(t('migration.migrate-button.confirmation-message'));
                    setIsSubmitting(false);
                    setCurrentVoteOnContract(vote);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
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
                    <RadioButtonContainer key={votingOption}>
                        <RadioButton
                            checked={votingOption === vote}
                            value={votingOption}
                            onChange={() => setVote(votingOption)}
                            label={t(DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS[votingOption])}
                        />
                    </RadioButtonContainer>
                );
            })}
            {getSubmitButton()}
            <ValidationMessage
                showValidation={txErrorMessage !== null}
                message={txErrorMessage}
                onDismiss={() => setTxErrorMessage(null)}
            />
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

const RadioButtonContainer = styled.div`
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

const VoteButton = styled(Button)`
    font-size: 15px;
    padding: 4px 10px;
    margin-top: 10px;
`;

export default DisputeVoting;
