import React from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { getNetworkId } from 'redux/modules/wallet';
import UnsupportedNetwork from 'components/UnsupportedNetwork';
import { isNetworkSupported } from 'utils/network';
import { FlexDivColumn } from 'styles/common';
import DappHeader from './DappHeader';
import Loader from 'components/Loader';
import DappFooter from './DappFooter';

type DappLayoutProps = {
    hideFooter?: boolean;
};

const DappLayout: React.FC<DappLayoutProps> = ({ hideFooter, children }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));

    return (
        <>
            {isAppReady ? (
                networkId && !isNetworkSupported(networkId) ? (
                    <UnsupportedNetwork />
                ) : (
                    <Background>
                        <Wrapper>
                            <DappHeader />
                            {children}
                            {!hideFooter && <DappFooter />}
                        </Wrapper>
                    </Background>
                )
            ) : (
                <Loader />
            )}
        </>
    );
};

const Background = styled.section`
    min-height: 100vh;
    background: ${(props) => props.theme.background.primary};
    color: ${(props) => props.theme.textColor.primary};
`;

const Wrapper = styled(FlexDivColumn)`
    align-items: center;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding: 40px 0px;
    max-width: 1220px;
    min-height: 100vh;
    @media (max-width: 1024px) {
        padding: 40px 20px;
    }
    @media (max-width: 767px) {
        padding: 40px 10px;
    }
`;

export default DappLayout;
