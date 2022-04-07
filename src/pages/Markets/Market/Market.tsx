import SimpleLoader from 'components/SimpleLoader';
import ROUTES from 'constants/routes';
import useMarketQuery from 'queries/markets/useMarketQuery';
import useOracleCouncilMemberQuery from 'queries/oracleCouncil/useOracleCouncilMemberQuery';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { MarketData } from 'types/markets';
import { buildHref } from 'utils/routes';
import BackToLink from '../components/BackToLink';
import Disputes from './Disputes';
import MarketDetails from './MarketDetails';
import ResolveMarket from './ResolveMarket';

type MarketProps = RouteComponentProps<{
    marketAddress: string;
}>;

const Market: React.FC<MarketProps> = (props) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

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

    const oracleCouncilMemberQuery = useOracleCouncilMemberQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const isOracleCouncilMember: boolean = useMemo(() => {
        if (oracleCouncilMemberQuery.isSuccess) {
            return oracleCouncilMemberQuery.data as boolean;
        }
        return true;
    }, [oracleCouncilMemberQuery.isSuccess, oracleCouncilMemberQuery.data]);

    return (
        <Container>
            {market ? (
                <>
                    <BackToLink link={buildHref(ROUTES.Markets.Home)} text={t('market.back-to-markets')} />
                    <MarketDetails market={market} />
                    {market.canMarketBeResolved && !isOracleCouncilMember && !market.isPaused && (
                        <ResolveMarket market={market} />
                    )}
                    <Disputes
                        marketAddress={marketAddress}
                        positions={market.positions}
                        winningPosition={market.winningPosition}
                    />
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
    align-items: center;
`;

export default Market;
