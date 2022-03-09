import TextAreaInput from 'components/fields/TextAreaInput';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';
import Button from 'components/Button';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { CURRENCY_MAP, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import { MAXIMUM_INPUT_CHARACTERS } from 'constants/markets';

const TEMP_BOND_DEPOSIT = 100;

const OpenDispute: React.FC = () => {
    const { t } = useTranslation();
    const [reasonForDispute, setReasonForDispute] = useState<string>('');

    const formattedBondDepostiAmount = formatCurrencyWithKey(
        CURRENCY_MAP.THALES,
        TEMP_BOND_DEPOSIT,
        DEFAULT_CURRENCY_DECIMALS,
        true
    );

    return (
        <Container>
            <Form>
                <Header>
                    <Description>
                        {t('market.dispute.open-dispute-description', {
                            amount: formattedBondDepostiAmount,
                        })}
                    </Description>
                    <DisputeButton>{t('market.dispute.button.deposit-label')}</DisputeButton>
                    <Info>
                        <InfoLabel>{t('market.dispute.deposit-bond-label')}</InfoLabel>
                        <InfoContent>{formattedBondDepostiAmount}</InfoContent>
                    </Info>
                </Header>
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
`;

const Header = styled(FlexDivColumn)`
    align-items: center;
    margin-bottom: 50px;
`;

const Description = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 25px;
`;

const Info = styled(FlexDivColumn)`
    font-style: normal;
    font-weight: normal;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    text-transform: uppercase;
    margin-top: 20px;
`;

const InfoLabel = styled.span``;

const InfoContent = styled.span`
    font-weight: bold;
`;

const Form = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 25px;
    padding: 20px;
    width: 100%;
`;

const DisputeButton = styled(Button)`
    height: 32px;
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 40px 0 30px 0;
`;

export default OpenDispute;
