import React from 'react';
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
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const useCollateralQuery = useCollateralBalanceQuery(walletAddress, networkId, {
        enabled: true,
    });

    const balances = useCollateralQuery.isSuccess ? useCollateralQuery.data : { susd: 0, dai: 0, usdc: 0, usdt: 0 };

    return (
        <Wrapper>
            <CollateraWrapper>
                {AVAILABLE_COLLATERALS.map((token) => {
                    return (
                        <Row key={token.address} onClick={setCollateral.bind(this, token)}>
                            <FlexDivCentered style={{ opacity: collateral.address === token.address ? 1 : 0.2 }}>
                                <Img src={token.logoURI}></Img>
                                <Balance>
                                    {balances ? formatCurrencyWithSign('', balances[token.symbol.toLowerCase()], 2) : 0}
                                </Balance>
                            </FlexDivCentered>
                        </Row>
                    );
                })}
            </CollateraWrapper>
        </Wrapper>
    );
};

export default CollateralDropdown;

const Wrapper = styled.div`
    position: relative;
    top: -30px;
`;

const CollateraWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const Row = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 0 16px;
    cursor: pointer;
`;

const Img = styled.img`
    width: 36px;
    height: 36px;
    margin-right: 10px;
`;

// const Text = styled.p`
//     font-family: 'Nunito';
//     font-style: normal;
//     font-weight: 400;
//     font-size: 17px;
//     line-height: 23px;
//     text-align: center;
//     color: #715098;
//     &:after {
//         font-family: ExoticIcons !important;
//         content: '\\004D';
//         position: absolute;
//         font-size: 21.5px;
//         left: 200px;
//         top: 6px;
//     }
// `;

const Balance = styled.p`
    font-family: 'Nunito';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 251%;
    /* or 45px */

    color: #715098;
`;
