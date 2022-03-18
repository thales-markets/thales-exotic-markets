import SimpleLoader from 'components/SimpleLoader';
import useMarketQuery from 'queries/markets/useMarketQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { MarketData } from 'types/markets';
import Disputes from './Disputes';
import MarketDetails from './MarketDetails';
import ResolveMarket from './ResolveMarket';

type MarketProps = RouteComponentProps<{
    marketAddress: string;
}>;

const Market: React.FC<MarketProps> = (props) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const { params } = props.match;
    const marketAddress = params && params.marketAddress ? params.marketAddress : '';

    const marketQuery = useMarketQuery(marketAddress, {
        enabled: isAppReady,
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
                    {market.canMarketBeResolved && (
                        <ResolveMarket
                            marketAddress={market.address}
                            marketCreator={market.creator}
                            positions={market.positions}
                        />
                    )}
                    <Disputes marketAddress={marketAddress} positions={market.positions} />
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
