import Button from 'components/Button';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow } from 'styles/common';

const Header: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Container>
            <Step>
                <Title>{t('market.create-market.header.step-title.deposit-bond')}</Title>
                <ProgressItem isCompleted={true} />
                <ButtonContainer>
                    <HeaderButton>{t('market.create-market.header.button.deposit-label')}</HeaderButton>
                </ButtonContainer>
                <InfoContainer>
                    <InfoLabel>{t('market.create-market.header.info.deposit-bond')}</InfoLabel>
                    <Info>100 THALES</Info>
                </InfoContainer>
            </Step>
            <Step>
                <Title>{t('market.create-market.header.step-title.create-market')}</Title>
                <ProgressItem />
            </Step>
            <Step>
                <Title>{t('market.create-market.header.step-title.launch-market')}</Title>
                <ProgressItem isLineHidden={true} />
                <ButtonContainer>
                    <HeaderButton>{t('market.create-market.header.button.start-label')}</HeaderButton>
                </ButtonContainer>
            </Step>
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    margin-bottom: 40px;
    width: 600px;
`;

const Step = styled(FlexDivColumn)``;

const Title = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 25px;
    line-height: 34px;
    color: ${(props) => props.theme.textColor.primary};
    text-align: center;
`;

const ProgressItem = styled(FlexDivCentered)<{ isLineHidden?: boolean; isCompleted?: boolean }>`
    position: relative;
    height: 34px;
    margin-top: 10px;
    &:before {
        content: '';
        position: absolute;
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 8px solid transparent;
        background: ${(props) => (props.isCompleted ? props.theme.textColor.secondary : props.theme.textColor.primary)};
        box-shadow: 0 0 0 2px
            ${(props) => (props.isCompleted ? props.theme.textColor.secondary : props.theme.textColor.primary)};
        background-clip: padding-box;
    }
    &:after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: 115px;
        top: 16px;
        width: 170px;
        height: 2px;
        background: ${(props) => (props.isCompleted ? props.theme.textColor.secondary : props.theme.textColor.primary)};
        display: ${(props) => (props.isLineHidden ? 'none' : 'block')};
    }
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin-top: 15px;
`;

const HeaderButton = styled(Button)`
    height: 32px;
`;

const InfoContainer = styled(FlexDivColumn)`
    font-style: normal;
    font-weight: normal;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    text-transform: uppercase;
    margin-top: 15px;
`;

const InfoLabel = styled.span``;

const Info = styled.span`
    font-weight: bold;
`;

export default Header;
