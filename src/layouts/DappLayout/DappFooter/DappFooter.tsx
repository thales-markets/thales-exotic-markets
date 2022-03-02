import SPAAnchor from 'components/SPAAnchor';
import ROUTES from 'constants/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';
import { buildHref } from 'utils/routes';

const DappFooter: React.FC = () => {
    const { t } = useTranslation();

    return (
        <SPAAnchor href={buildHref(ROUTES.Markets.Home)}>
            <Container>
                <LeftIcon />
                {t('market.back-to-markets')}
            </Container>
        </SPAAnchor>
    );
};

const Container = styled(FlexDivCentered)`
    margin-top: 40px;
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 102.6%;
    letter-spacing: 0.035em;
    color: ${(props) => props.theme.textColor.primary};
    a {
        color: ${(props) => props.theme.textColor.primary};
    }
`;

const LeftIcon = styled.i`
    font-size: 24px;
    margin-right: 4px;
    &:before {
        font-family: HomepageIcons !important;
        content: '\\0048';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default DappFooter;
