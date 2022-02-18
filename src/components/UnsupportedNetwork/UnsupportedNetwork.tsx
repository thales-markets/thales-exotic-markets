import React from 'react';
import styled from 'styled-components';
import angryThales from 'assets/images/angry_thales.gif';
import { useTranslation } from 'react-i18next';

const UnsupportedNetwork: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <WrongNetworkWrapper>
                <img style={{ width: 200, height: 200, margin: 'auto' }} src={angryThales}></img>
                <div className="pale-grey text-l ls25">{t(`common.unsupported-network.title`)}</div>

                <div>{t(`common.unsupported-network.description`)}</div>
                <div>
                    <button
                        style={{ alignSelf: 'flex-end', margin: '80px 0' }}
                        className="primary"
                        onClick={switchNetwork.bind(this, '0xA')}
                    >
                        {t(`common.unsupported-network.button.optimism`)}
                    </button>
                </div>
            </WrongNetworkWrapper>
        </Wrapper>
    );
};

const switchNetwork = async (networkId: any) => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            await (window.ethereum as any).request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: networkId }],
            });
            location.reload();
        } catch (switchError) {
            console.log(switchError);
        }
    }
};

const Wrapper = styled.div`
    position: fixed;
    height: 100%;
    width: 100%;
    background: #04045a;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const WrongNetworkWrapper = styled.div`
    background: #04045a;
    border-radius: 23px;
    display: flex;
    flex-direction: column;
    max-width: 600px;
    padding: 40px;
    text-align: center;
`;

export default UnsupportedNetwork;
