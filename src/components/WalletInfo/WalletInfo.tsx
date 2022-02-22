import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getIsWalletConnected, getWalletAddress } from 'redux/modules/wallet';
import { FlexDivRowCentered } from 'styles/common';
import { useTranslation } from 'react-i18next';
import { truncateAddress } from 'utils/formatters/string';
import onboardConnector from 'utils/onboardConnector';

const WalletInfo: React.FC = () => {
    const { t } = useTranslation();
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    return (
        <Container
            isWalletConnected={isWalletConnected}
            onClick={() => {
                if (!isWalletConnected) {
                    onboardConnector.connectWallet();
                }
            }}
        >
            {isWalletConnected ? (
                <>
                    <WalletIcon />
                    <Info>{truncateAddress(walletAddress)}</Info>
                </>
            ) : (
                <Info>{t('common.wallet.connect-your-wallet')}</Info>
            )}
        </Container>
    );
};

const Container = styled(FlexDivRowCentered)<{ isWalletConnected: boolean }>`
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 30px;
    height: 28px;
    padding: 0 20px;
    cursor: ${(props) => (props.isWalletConnected ? 'default' : 'pointer')};
`;

const Info = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 12.5px;
    line-height: 17px;
    color: ${(props) => props.theme.textColor};
`;

const WalletIcon = styled.i`
    font-size: 16px;
    margin-top: 2px;
    padding-right: 5px;
    &:before {
        font-family: SidebarIcons !important;
        content: '\\0063';
        color: ${(props) => props.theme.textColor};
    }
`;

export default WalletInfo;
