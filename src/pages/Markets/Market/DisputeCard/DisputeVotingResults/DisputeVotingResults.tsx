import { DisputeVotingOption, DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS } from 'constants/markets';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'styles/common';
import { DisputeVotingResultInfo, DisputeVotingResults as VotingResults } from 'types/markets';

type DisputeVotingResultsProps = {
    votingResults: VotingResults;
    positions: string[];
};

const DisputeVotingResults: React.FC<DisputeVotingResultsProps> = ({ votingResults, positions }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <Title>{t('market.dispute.results-label')}</Title>
            {votingResults.map((result: DisputeVotingResultInfo) => {
                return (
                    <Result key={`${result.votingOption}-${result.position}`}>
                        <VotingOption>
                            {`${t(DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS[result.votingOption])}${
                                result.votingOption === DisputeVotingOption.ACCEPT_RESULT && result.numberOfVotes > 0
                                    ? ` (${positions[result.position]})`
                                    : ''
                            }`}
                        </VotingOption>
                        <NumberOfVotes>{result.numberOfVotes}</NumberOfVotes>
                    </Result>
                );
            })}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    flex: initial;
    width: 280px;
`;

const Title = styled.span`
    font-weight: bold;
    font-size: 20px;
    line-height: 100%;
    margin-bottom: 10px;
`;

const Result = styled(FlexDivRow)`
    font-size: 15px;
    line-height: 20px;
    padding-bottom: 5px;
    align-items: center;
    margin-top: 5px;
    :not(:last-child) {
        border-bottom: 1px solid ${(props) => props.theme.borderColor.primary};
    }
`;

const VotingOption = styled.span``;

const NumberOfVotes = styled.span`
    font-size: 18px;
    font-weight: bold;
    margin-left: 10px;
`;

export default DisputeVotingResults;
