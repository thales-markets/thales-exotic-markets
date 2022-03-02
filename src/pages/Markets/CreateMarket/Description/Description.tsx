import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';

const Description: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <Title>{t('market.create-market.description.title')}</Title>
            <Text>
                <Trans i18nKey="market.create-market.description.text" components={[<p key="0" />]} />
            </Text>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin: 40px 0 40px 40px;
`;

const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 34px;
    margin-bottom: 30px;
`;

const Text = styled(FlexDivColumn)`
    p {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 25px;
        text-align: justify;
        margin-bottom: 20px;
    }
`;

export default Description;
