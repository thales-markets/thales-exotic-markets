import Loader from 'components/Loader';
import useMarketQuery from 'queries/markets/useMarketQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';

type MarketProps = RouteComponentProps<{
    marketAddress: string;
}>;

const Market: React.FC<MarketProps> = (props) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const { params } = props.match;
    const address = params && params.marketAddress ? params.marketAddress : '';

    const marketQuery = useMarketQuery(address, {
        enabled: isAppReady && address !== '',
    });

    const market = useMemo(() => {
        if (marketQuery.isSuccess && marketQuery.data) {
            return marketQuery.data;
        }
        return undefined;
    }, [marketQuery.isSuccess, marketQuery.data]);

    return market ? (
        <Container>
            <Title>{market.title}</Title>
            <Options>
                {market.options.map((option: string) => (
                    <Option key={option}>{option}</Option>
                ))}
            </Options>
        </Container>
    ) : (
        <Loader />
    );
};

const Container = styled(FlexDivColumnCentered)`
    margin-top: 40px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 25px;
    width: 1220px;
    padding: 100px 40px;
    background: ${(props) => props.theme.background.secondary};
`;

const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor};
    margin-bottom: 25px;
`;

const Options = styled(FlexDivColumnCentered)`
    margin-bottom: 25px;
`;

const Option = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 40px;
    text-align: center;
    color: ${(props) => props.theme.textColor};
`;

export default Market;
