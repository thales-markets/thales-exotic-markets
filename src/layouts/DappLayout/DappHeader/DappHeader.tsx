import Logo from 'components/Logo';
import WalletInfo from 'components/WalletInfo';
import React from 'react';
import styled from 'styled-components';
import { FlexDivRowCentered } from 'styles/common';

const DappHeader: React.FC = () => {
    return (
        <Container>
            <Logo />
            <WalletInfo />
        </Container>
    );
};

const Container = styled(FlexDivRowCentered)`
    width: 100%;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

export default DappHeader;
