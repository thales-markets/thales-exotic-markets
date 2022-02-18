import { Theme } from 'constants/ui';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from 'redux/modules/ui';
import { getIsWalletConnected, getNetwork, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import onboardConnector from 'utils/onboardConnector';

const Home: React.FC = () => {
    const dispatch = useDispatch();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const network = useSelector((state: RootState) => getNetwork(state));

    return (
        <div>
            Thales: Exotic Positional Markets Homepage
            {!isWalletConnected && <button onClick={() => onboardConnector.connectWallet()}>Connect wallet</button>}
            {isWalletConnected && (
                <button onClick={() => onboardConnector.disconnectWallet()}>Disconnect wallet</button>
            )}
            {isWalletConnected && (
                <div>
                    <p>{walletAddress}</p>
                    <p>{network.networkName}</p>
                </div>
            )}
            <button onClick={() => dispatch(setTheme(Theme.LIGHT))}>LIGHT</button>
            <button onClick={() => dispatch(setTheme(Theme.DARK))}>DARK</button>
            <TestDiv></TestDiv>
        </div>
    );
};

const TestDiv = styled.div`
    width: 100px;
    height: 30px;
    background: ${(props) => props.theme.colors.background};
`;

export default Home;
