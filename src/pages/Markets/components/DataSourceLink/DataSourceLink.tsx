import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';

type DataSourceLinkProps = {
    link: string;
};

const DataSourceLink: React.FC<DataSourceLinkProps> = ({ link }) => {
    const { t } = useTranslation();
    return (
        <Container>
            <Link target="_blank" rel="noreferrer" href={link}>
                {t('market.data-source-label')}
            </Link>
        </Container>
    );
};

const Container = styled(FlexDivCentered)`
    @media (max-width: 767px) {
        margin-top: 20px;
    }
`;

const Link = styled.a`
    min-height: 28px;
    background: ${(props) => props.theme.button.background.secondary};
    padding: 5px 20px;
    border-radius: 30px;
    font-style: normal;
    font-weight: bold;
    font-size: 17px;
    color: ${(props) => props.theme.button.textColor.primary};
    text-align: center;
    border: none;
    outline: none;
    text-transform: none;
    cursor: pointer;
    min-height: 28px;
    width: 146px;
    &:hover {
        opacity: 0.8;
    }
`;

export default DataSourceLink;
