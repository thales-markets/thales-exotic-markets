import SimpleLoader from 'components/SimpleLoader';
import useMarketQuery from 'queries/markets/useMarketQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { MarketDetails as MarketData } from 'types/markets';
import { getWalletAddress } from 'redux/modules/wallet';
import Disputes from './Disputes';
import MarketDetails from './MarketDetails';

type MarketProps = RouteComponentProps<{
    marketAddress: string;
}>;

const Market: React.FC<MarketProps> = (props) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';

    const { params } = props.match;
    const marketAddress = params && params.marketAddress ? params.marketAddress : '';

    const marketQuery = useMarketQuery(marketAddress, walletAddress, {
        enabled: isAppReady && marketAddress !== '',
    });

    const market: MarketData | undefined = useMemo(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            return marketQuery.data as MarketData;
        }
        return undefined;
    }, [marketQuery.isSuccess, marketQuery.data]);

    return (
        <Container>
            {market ? (
                <>
                    <MarketDetails market={market} />
                    <Disputes marketAddress={marketAddress} />
                </>
            ) : (
                <SimpleLoader />
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    width: 100%;
    position: relative;
`;

export default Market;
