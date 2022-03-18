import React from 'react';
import styled from 'styled-components';
import ROUTES from 'constants/routes';
import { ReactComponent as LogoIcon } from 'assets/images/logo.svg';
import SPAAnchor from 'components/SPAAnchor';
import { buildHref } from 'utils/routes';

const Logo: React.FC = () => (
    <Container>
        <SPAAnchor href={buildHref(ROUTES.Home)}>
            <StyledLogo />
        </SPAAnchor>
    </Container>
);

const Container = styled.div``;

const StyledLogo = styled(LogoIcon)`
    fill: ${(props) => props.theme.textColor.primary};
    height: 35px;
`;

export default Logo;
