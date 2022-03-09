import Logo from 'components/Logo';
import WalletInfo from 'components/WalletInfo';
import React from 'react';
import styled from 'styled-components';
import { FlexDivRow } from 'styles/common';

const DappHeader: React.FC = () => {
    return (
        <Container>
            <Logo />
            <WalletInfo />
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    width: 100%;
`;

export default DappHeader;
