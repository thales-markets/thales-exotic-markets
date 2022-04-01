import GetUsd from 'components/GetUsd';
import Logo from 'components/Logo';
import WalletInfo from 'components/WalletInfo';
import React from 'react';
import styled from 'styled-components';
import { FlexDivRowCentered } from 'styles/common';

const DappHeader: React.FC = ({ children }) => {
    return (
        <Container>
            <Logo />
            <RightContainer>
                {children}
                <GetUsd />
                <WalletInfo />
            </RightContainer>
        </Container>
    );
};

const Container = styled(FlexDivRowCentered)`
    width: 100%;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const RightContainer = styled(FlexDivRowCentered)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
    > div {
        :not(:last-child) {
            margin-right: 10px;
            @media (max-width: 767px) {
                margin-right: 0px;
                margin-bottom: 10px;
            }
        }
    }
`;

export default DappHeader;
