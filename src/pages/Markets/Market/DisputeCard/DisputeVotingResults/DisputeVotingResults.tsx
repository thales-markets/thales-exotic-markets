import { DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS } from 'constants/markets';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'styles/common';
import { DisputeVotingResultInfo, DisputeVotingResults as VotingResults } from 'types/markets';

type DisputeVotingResultsProps = {
    votingResults: VotingResults;
};

const DisputeVotingResults: React.FC<DisputeVotingResultsProps> = ({ votingResults }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <Title>{t('market.dispute.results-label')}</Title>
            {votingResults.map((result: DisputeVotingResultInfo) => {
                return (
                    <Result key={result.votingOption}>
                        <VotingOption>{t(DISPUTE_VOTING_OPTIONS_TRANSLATION_KEYS[result.votingOption])} </VotingOption>
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
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 20px;
`;

const Result = styled(FlexDivRow)`
    font-size: 15px;
    line-height: 20px;
    margin-top: 10px;
    padding-bottom: 10px;
    align-items: center;
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
