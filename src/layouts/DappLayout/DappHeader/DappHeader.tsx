import Button from 'components/Button';
import GetUsd from 'components/GetUsd';
import Logo from 'components/Logo';
import Search from 'components/Search';
import WalletInfo from 'components/WalletInfo';
import ROUTES from 'constants/routes';
import useMarketsParametersQuery from 'queries/markets/useMarketsParametersQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getMarketSearch, setMarketSearch } from 'redux/modules/market';
import { getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivRowCentered } from 'styles/common';
import { MarketsParameters } from 'types/markets';
import { navigateTo } from 'utils/routes';

type DappHeaderProps = {
    showSearch?: boolean;
};

const DappHeader: React.FC<DappHeaderProps> = ({ showSearch }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const marketSearch = useSelector((state: RootState) => getMarketSearch(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const [marketsParameters, setMarketsParameters] = useState<MarketsParameters | undefined>(undefined);

    const marketsParametersQuery = useMarketsParametersQuery(networkId, {
        enabled: isAppReady && showSearch,
    });

    useEffect(() => {
        if (marketsParametersQuery.isSuccess && marketsParametersQuery.data) {
            setMarketsParameters(marketsParametersQuery.data);
        }
    }, [marketsParametersQuery.isSuccess, marketsParametersQuery.data]);

    const creationRestrictedToOwner = marketsParameters
        ? marketsParameters.creationRestrictedToOwner && marketsParameters.owner !== walletAddress
        : true;

    return (
        <Container>
            <Logo />
            <RightContainer>
                {showSearch && (
                    <>
                        {!creationRestrictedToOwner && (
                            <ButtonsContainer>
                                <Button
                                    onClick={() => {
                                        navigateTo(ROUTES.Markets.CreateMarket);
                                    }}
                                    fontSize={15}
                                >
                                    {t('market.button.create-market-label')}
                                </Button>
                            </ButtonsContainer>
                        )}
                        <Search text={marketSearch} handleChange={(value) => dispatch(setMarketSearch(value))} />
                    </>
                )}
                <GetUsd />
                <WalletInfo />
            </RightContainer>
        </Container>
    );
};

const Container = styled(FlexDivRowCentered)`
    width: 100%;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const RightContainer = styled(FlexDivRowCentered)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
    > div {
        :not(:last-child) {
            margin-right: 20px;
            @media (max-width: 767px) {
                margin-right: 0px;
                margin-bottom: 10px;
            }
        }
    }
    @media (max-width: 500px) {
        padding: 0px 4px;
        width: 100%;
    }
`;

const ButtonsContainer = styled(FlexDivRowCentered)`
    @media (max-width: 500px) {
        width: 100%;
        button {
            width: 100%;
        }
    }
`;

export default DappHeader;
