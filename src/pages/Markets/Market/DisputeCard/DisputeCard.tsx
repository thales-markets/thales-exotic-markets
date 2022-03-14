import Button from 'components/Button';
import RadioButton from 'components/fields/RadioButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'styles/common';
import { DisputeInfo } from 'types/markets';

type DisputeCardProps = {
    dispute: DisputeInfo;
    isMarketOpen: boolean;
};

const disputeVotingOptionsMarketOpen = [
    {
        code: 1,
        textKey: 'market.dispute.voting-option.market-open.accept-slash',
    },
    {
        code: 2,
        textKey: 'market.dispute.voting-option.market-open.accept-no-slash',
    },
    {
        code: 3,
        textKey: 'market.dispute.voting-option.market-open.refuse',
    },
];

const disputeVotingOptionsMarketResolved = [
    {
        code: 4,
        textKey: 'market.dispute.voting-option.market-resolved.accept-set-result',
    },
    {
        code: 5,
        textKey: 'market.dispute.voting-option.market-resolved.accept-reset',
    },
    {
        code: 6,
        textKey: 'market.dispute.voting-option.market-resolved.refuse',
    },
];

const DisputeCard: React.FC<DisputeCardProps> = ({ dispute, isMarketOpen }) => {
    const { t } = useTranslation();
    const [vote, setVote] = useState<number>(0);

    const votingOptions = isMarketOpen ? disputeVotingOptionsMarketOpen : disputeVotingOptionsMarketResolved;

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
            <VotingContainer>
                <VoteTitle>Vote</VoteTitle>
                <RadioButtonsContainer>
                    {votingOptions.map((option) => {
                        return (
                            <RadioButtonContainer key={option.textKey}>
                                <RadioButton
                                    checked={option.code === vote}
                                    value={option.code}
                                    onChange={() => setVote(option.code)}
                                    label={t(option.textKey)}
                                />
                            </RadioButtonContainer>
                        );
                    })}
                </RadioButtonsContainer>
                <ActionButton type="secondary">Vote</ActionButton>
            </VotingContainer>
            <Votes>
                <VoteTitle>Results</VoteTitle>
                <RadioButtonsContainer>
                    {votingOptions.map((option) => {
                        return <VoteInfo key={option.textKey}>{t(option.textKey)}</VoteInfo>;
                    })}
                </RadioButtonsContainer>
            </Votes>
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

const VoteTitle = styled.span`
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 20px;
`;

const VotingContainer = styled(FlexDivColumn)`
    flex: initial;
    width: 280px;
`;

const Votes = styled(FlexDivColumn)`
    flex: initial;
    padding-left: 40px;
    width: 280px;
`;

const VoteInfo = styled.span`
    font-size: 15px;
    line-height: 20px;
    margin-bottom: 10px;
`;

const RadioButtonsContainer = styled(FlexDivColumn)`
    flex: initial;
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

const ActionButton = styled(Button)`
    font-size: 15px;
    padding: 4px 10px;
    margin-top: 10px;
`;

export default DisputeCard;
