import Button from 'components/Button';
import RadioButton from 'components/fields/RadioButton';
import {
    DISPUTE_VOTING_OPTIONS_MARKET_OPEN,
    DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED,
    DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS,
} from 'constants/markets';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';

type DisputeVotingProps = {
    isInPositioningPhase: boolean;
};

const DisputeVoting: React.FC<DisputeVotingProps> = ({ isInPositioningPhase }) => {
    const { t } = useTranslation();
    const [vote, setVote] = useState<number>(0);

    const disputeVotingOptions = isInPositioningPhase
        ? DISPUTE_VOTING_OPTIONS_MARKET_OPEN
        : DISPUTE_VOTING_OPTIONS_MARKET_RESOLVED;

    return (
        <Container>
            <Title>Vote</Title>
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
            <VoteButton type="secondary">Vote</VoteButton>
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
