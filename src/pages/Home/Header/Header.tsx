import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import ExternalLink from '../components/ExternalLink';
import { FlexDivRow, FlexDivRowCentered } from 'styles/common';
import Logo from 'components/Logo';
import SPAAnchor from 'components/SPAAnchor';
import { useDispatch, useSelector } from 'react-redux';
import { Theme } from 'constants/ui';
import { RootState } from 'redux/rootReducer';
import { getTheme, setTheme } from 'redux/modules/ui';
import { buildHref } from 'utils/routes';

const Header: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const theme = useSelector((state: RootState) => getTheme(state));

    return (
        <Container>
            <FlexDivRowCentered>
                <Logo />
                <Links>
                    <ExternalLink href="https://discord.com/invite/rB3AWKwACM">
                        {t('header.links.community')}
                    </ExternalLink>
                    <ExternalLink href="https://thalesmarket.medium.com/">{t('header.links.blog')}</ExternalLink>
                </Links>
            </FlexDivRowCentered>
            <FlexDivRowCentered>
                <ToggleContainer
                    onClick={() => {
                        dispatch(setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT));
                    }}
                >
                    <ToggleIcon currentTheme={theme} />
                </ToggleContainer>
                <DappButtonContainer>
                    <SPAAnchor href={buildHref(ROUTES.Markets.Home)}>{t('common.dapp')}</SPAAnchor>
                    <RightIcon />
                </DappButtonContainer>
            </FlexDivRowCentered>
        </Container>
    );
};

const Container = styled(FlexDivRowCentered)`
    width: 100%;
    margin-bottom: 40px;
`;

const Links = styled(FlexDivRow)`
    margin-left: 80px;
`;

const ToggleContainer = styled(FlexDivRow)`
    cursor: pointer;
`;

const ToggleIcon = styled.i<{ currentTheme: Theme }>`
    font-size: 48px;
    &:before {
        font-family: HomepageIcons !important;
        content: ${(props) => (props.currentTheme === Theme.LIGHT ? "'\\0042'" : "'\\0041'")};
        color: ${(props) => props.theme.textColor.primary};
    }
`;

const DappButtonContainer = styled(FlexDivRow)`
    margin-left: 40px;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 102.6%;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    color: ${(props) => props.theme.textColor.primary};
    a {
        color: ${(props) => props.theme.textColor.primary};
    }
`;

const RightIcon = styled.i`
    font-size: 16px;
    &:before {
        font-family: HomepageIcons !important;
        content: '\\004a';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default Header;
