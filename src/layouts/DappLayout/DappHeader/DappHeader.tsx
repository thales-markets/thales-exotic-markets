import GetUsd from 'components/GetUsd';
import Logo from 'components/Logo';
import WalletInfo from 'components/WalletInfo';
import React from 'react';
import styled from 'styled-components';
import { FlexDivRowCentered } from 'styles/common';

const DappHeader: React.FC = () => {
    return (
        <Container>
            <Logo />
            <GetUsd />
            <WalletInfo />
        </Container>
    );
};

const Container = styled(FlexDivRowCentered)`
    width: 100%;
    @media (max-width: 767px) {
        flex-direction: column;
    }
    > div {
        width: 33%;
        @media (max-width: 767px) {
            width: auto;
        }
    }
`;

export default DappHeader;
