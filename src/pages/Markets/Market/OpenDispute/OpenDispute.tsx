import TextAreaInput from 'components/fields/TextAreaInput';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';
import Button from 'components/Button';
import { MAXIMUM_INPUT_CHARACTERS } from 'constants/markets';

const OpenDispute: React.FC = () => {
    const { t } = useTranslation();
    const [reasonForDispute, setReasonForDispute] = useState<string>('');

    return (
        <Container>
            <Form>
                <Title>Open dispute for Will Thales be the best?</Title>
                <TextAreaInput
                    value={reasonForDispute}
                    onChange={setReasonForDispute}
                    label={t('market.dispute.reason-for-dispute-label')}
                    note={t('common.input-characters-note', {
                        entered: reasonForDispute.length,
                        max: MAXIMUM_INPUT_CHARACTERS,
                    })}
                    maximumCharacters={MAXIMUM_INPUT_CHARACTERS}
                />
                <ButtonContainer>
                    <DisputeButton>{t('market.dispute.button.open-dispute-label')}</DisputeButton>
                </ButtonContainer>
            </Form>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 50px;
    align-items: center;
    width: 690px;
    flex: initial;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const Title = styled(FlexDivColumn)`
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 80px;
`;

const Form = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 25px;
    padding: 30px 20px 40px 20px;
    width: 100%;
`;

const DisputeButton = styled(Button)`
    height: 32px;
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 20px 0 0 0;
`;

export default OpenDispute;
