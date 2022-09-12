import React, { useState } from 'react';
import styled from 'styled-components';
// import Dai from 'assets/currencies/DAI.svg';
// import sUSD from 'assets/currencies/sUSD.svg';
// import USDT from 'assets/currencies/USDT.svg';
// import USDC from 'assets/currencies/USDC.svg';
import { AVAILABLE_COLLATERALS } from 'constants/tokens';
import useCollateralBalanceQuery from 'queries/wallet/useCollateralBalanceQuery';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { formatCurrencyWithSign } from 'utils/formatters/number';
import { FlexDivCentered } from 'styles/common';
// import { USD_SIGN } from 'constants/currency';

type CollateralProps = {
    collateral: {
        address: string;
        decimals: number;
        symbol: string;
        name: string;
        logoURI: string;
    };
    setCollateral: React.Dispatch<
        React.SetStateAction<{
            address: string;
            decimals: number;
            symbol: string;
            name: string;
            logoURI: string;
        }>
    >;
};

const CollateralDropdown: React.FC<CollateralProps> = ({ collateral, setCollateral }) => {
    const [dropdownOpen, setOpen] = useState(false);
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const useCollateralQuery = useCollateralBalanceQuery(walletAddress, networkId, {
        enabled: dropdownOpen,
    });

    const balances = useCollateralQuery.isSuccess ? useCollateralQuery.data : [];

    return (
        <Wrapper onClick={setOpen.bind(this, !dropdownOpen)}>
            {!dropdownOpen && <Text>{collateral.name}</Text>}
            {dropdownOpen && (
                <CollateraWrapper>
                    {AVAILABLE_COLLATERALS.map((token, index) => {
                        return (
                            <Row key={token.address} onClick={setCollateral.bind(this, token)}>
                                <FlexDivCentered>
                                    <Img src={token.logoURI}></Img>
                                    <Balance style={{ marginLeft: 10 }}>{token.symbol}</Balance>
                                </FlexDivCentered>

                                <Balance>{balances ? formatCurrencyWithSign('', balances[index], 2) : 0}</Balance>
                            </Row>
                        );
                    })}
                </CollateraWrapper>
            )}
        </Wrapper>
    );
};

export default CollateralDropdown;

const Wrapper = styled.div`
    position: absolute;
    width: 233px;
    min-height: 28px;
    left: 10px;
    top: 10px;
    cursor: pointer;
    border: 2px solid #715098;
    border-radius: 30px;
    background: white;
`;

const CollateraWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 192px;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }
    &:last-child {
        border-radius: 0 0 20px 20px;
    }
    &:first-child {
        border-radius: 20px 20px 0 0;
    }
`;

const Img = styled.img`
    width: 36px;
    height: 36px;
`;

const Text = styled.p`
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 400;
    font-size: 17px;
    line-height: 23px;
    text-align: center;
    color: #715098;
    &:after {
        font-family: ExoticIcons !important;
        content: '\\004D';
        position: absolute;
        font-size: 21.5px;
        left: 200px;
        top: 6px;
    }
`;

const Balance = styled.p`
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 251%;
    /* or 45px */

    color: #715098;
`;
