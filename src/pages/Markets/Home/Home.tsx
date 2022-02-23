import Loader from 'components/Loader';
import Search from 'components/Search';
import useMarketsQuery from 'queries/markets/useMarketsQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import Tags from '../components/Tags';
import MarketsGrid from './MarketsGrid';

export enum TagFilterEnum {
    Sports = 'Sports',
    NFL = 'NFL',
    NBA = 'NBA',
    Football = 'Football',
    Dummy = 'Dummy',
    Test = 'Test',
    Crypto = 'Crypto',
    DeFi = 'DeFi',
    Basketball = 'Basketball',
    ETH = 'ETH',
    OP = 'OP',
    Thales = 'Thales',
}

export enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const Home: React.FC = () => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const marketsQuery = useMarketsQuery(networkId, { enabled: isAppReady });

    const markets = useMemo(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            return marketsQuery.data;
        }
        return [];
    }, [marketsQuery.isSuccess, marketsQuery.data]);

    return marketsQuery.isLoading ? (
        <Loader />
    ) : (
        <Container>
            <Search text={'test'} handleChange={() => {}} />
            <Tags tags={Object.values(TagFilterEnum).map((filterItem) => filterItem)} />
            <MarketsGrid markets={markets} />
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    align-items: center;
`;

export default Home;
