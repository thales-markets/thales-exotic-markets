import React from 'react';
import onboardConnector from 'utils/onboardConnector';

const Home: React.FC = () => {
    return (
        <div>
            Thales: Exotic Positional Markets Homepage
            <button onClick={() => onboardConnector.connectWallet()}>Connect wallet</button>
        </div>
    );
};

export default Home;
