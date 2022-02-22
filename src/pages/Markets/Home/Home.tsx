import useMarketsQuery from 'queries/markets/useMarketsQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import MarketsGrid from './MarketsGrid';

const Home: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const marketsQuery = useMarketsQuery(networkId, { enabled: isAppReady });

    const markets = useMemo(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            return marketsQuery.data;
        }
        return [];
    }, [marketsQuery]);

    return (
        <Container>
            <MarketsGrid markets={markets} />
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)``;

export default Home;
