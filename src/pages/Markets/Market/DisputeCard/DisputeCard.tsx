import Button from 'components/Button';
import RadioButton from 'components/fields/RadioButton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivRow } from 'styles/common';
import { DisputeInfo } from 'types/markets';

type DisputeCardProps = {
    dispute: DisputeInfo;
};

const DisputeCard: React.FC<DisputeCardProps> = ({ dispute }) => {
    const { t } = useTranslation();
    const [slashCreator, setSlashCreator] = useState<boolean>(true);

    return (
        <Container>
            <Info>
                <Disputor>{dispute.disputor}</Disputor>
                <ReasonForDisputeLabel>{t('market.dispute.reason-for-dispute-label')}:</ReasonForDisputeLabel>
                <ReasonForDispute>{dispute.reasonForDispute}</ReasonForDispute>
            </Info>
            <Status>
                <RefuseContainer>
                    <RefuseText>Refuse the dispute and slash the wallet that raised it</RefuseText>
                    <ActionButton type="secondary">Refuse</ActionButton>
                </RefuseContainer>
                <AcceptContainer>
                    <RadioButtonsContainer>
                        <RadioButtonContainer>
                            <RadioButton
                                checked={slashCreator}
                                value={'true'}
                                onChange={() => setSlashCreator(true)}
                                label={'Slash the creator'}
                            />
                        </RadioButtonContainer>
                        <RadioButtonContainer>
                            <RadioButton
                                checked={!slashCreator}
                                value={'false'}
                                onChange={() => setSlashCreator(false)}
                                label={'Do not slash the creator'}
                            />
                        </RadioButtonContainer>
                    </RadioButtonsContainer>
                    <ActionButton type="secondary">Accept the dispute</ActionButton>
                </AcceptContainer>
            </Status>
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 15px;
    font-style: normal;
    font-weight: normal;
    padding: 30px 30px;
    margin-bottom: 30px;
    color: ${(props) => props.theme.textColor.primary};
`;

const Info = styled(FlexDivColumn)`
    padding-right: 40px;
    border-right: 2px solid ${(props) => props.theme.borderColor.primary};
`;

const Disputor = styled.span`
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 20px;
`;

const ReasonForDisputeLabel = styled.span`
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    margin-bottom: 10px;
`;

const ReasonForDispute = styled.span`
    font-size: 18px;
    line-height: 25px;
    text-align: justify;
`;

const Status = styled(FlexDivColumn)`
    flex: initial;
    padding-left: 40px;
    width: 280px;
`;

const RefuseContainer = styled(FlexDivColumn)`
    flex: initial;
    padding-bottom: 10px;
`;

const RefuseText = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 20px;
    margin: 0 0 6px 4px;
`;

const AcceptContainer = styled(FlexDivColumn)`
    flex: initial;
    padding-top: 10px;
`;

const RadioButtonsContainer = styled(FlexDivColumn)`
    margin: 0 0 6px 4px;
`;

const RadioButtonContainer = styled.div`
    label {
        padding-left: 22px;
        font-size: 15px;
        line-height: 20px;
        margin-bottom: 6px;
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
`;

export default DisputeCard;
