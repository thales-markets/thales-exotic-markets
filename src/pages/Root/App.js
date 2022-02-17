import { loadProvider } from '@synthetixio/providers';
// import Loader from 'components/Loader';
import { initOnboard } from 'config/onboard';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useLocalStorage from 'hooks/useLocalStorage';
import React, { lazy, Suspense, useEffect } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Router, Switch } from 'react-router-dom';
import { getIsAppReady, setAppReady } from 'redux/modules/app';
import { getNetworkId, updateNetworkSettings, updateWallet } from 'redux/modules/wallet';
import { setTheme } from 'redux/modules/ui';
import { getDefaultNetworkId, isNetworkSupported } from 'utils/network';
import onboardConnector from 'utils/onboardConnector';
import queryConnector from 'utils/queryConnector';
import { history } from 'utils/routes';
import thalesConnector from 'utils/thalesConnector';
import localStore from 'utils/localStore';
import ROUTES from 'constants/routes';

const Home = lazy(() => import('../Home'));

const App = () => {
    const dispatch = useDispatch();
    const isAppReady = useSelector((state) => getIsAppReady(state));
    const [selectedWallet, setSelectedWallet] = useLocalStorage(LOCAL_STORAGE_KEYS.SELECTED_WALLET, '');
    const networkId = useSelector((state) => getNetworkId(state));

    queryConnector.setQueryClient();

    useEffect(() => {
        const init = async () => {
            const networkId = await getDefaultNetworkId();
            try {
                dispatch(updateNetworkSettings({ networkId }));
                if (!thalesConnector.initialized) {
                    const provider = loadProvider({
                        networkId,
                        infuraId: process.env.REACT_APP_INFURA_PROJECT_ID,
                        provider: window.ethereum,
                    });

                    thalesConnector.setNetworkSettings({ networkId, provider });
                }
                dispatch(setAppReady());
            } catch (e) {
                dispatch(setAppReady());
                console.log(e);
            }
        };

        init();
    }, []);

    useEffect(() => {
        // Init value of theme selected from the cookie
        if (isAppReady) {
            dispatch(setTheme(Number(localStore.get(LOCAL_STORAGE_KEYS.UI_THEME)) == 0 ? 0 : 1));
        }

        if (isAppReady && networkId) {
            const onboard = initOnboard(networkId, {
                address: (walletAddress) => {
                    dispatch(updateWallet({ walletAddress }));
                },
                network: (networkId) => {
                    if (networkId) {
                        if (isNetworkSupported(networkId)) {
                            if (onboardConnector.onboard.getState().wallet.provider) {
                                const provider = loadProvider({
                                    provider: onboardConnector.onboard.getState().wallet.provider,
                                });
                                const signer = provider.getSigner();

                                thalesConnector.setNetworkSettings({
                                    networkId,
                                    provider,
                                    signer,
                                });
                            } else {
                                thalesConnector.setNetworkSettings({ networkId });
                            }

                            onboardConnector.onboard.config({ networkId });
                        }
                        dispatch(updateNetworkSettings({ networkId }));
                    }
                },
                wallet: async (wallet) => {
                    if (wallet.provider) {
                        const provider = loadProvider({
                            provider: wallet.provider,
                        });
                        const signer = provider.getSigner();
                        const network = await provider.getNetwork();
                        const networkId = network.chainId;
                        thalesConnector.setNetworkSettings({
                            networkId,
                            provider,
                            signer,
                        });
                        setSelectedWallet(wallet.name);
                        dispatch(updateNetworkSettings({ networkId }));
                    } else {
                        setSelectedWallet(null);
                    }
                },
            });
            onboardConnector.setOnBoard(onboard);
        }
    }, [isAppReady]);

    // load previously saved wallet
    useEffect(() => {
        if (onboardConnector.onboard && selectedWallet) {
            onboardConnector.onboard.walletSelect(selectedWallet);
        }
    }, [isAppReady, onboardConnector.onboard, selectedWallet]);

    return (
        <QueryClientProvider client={queryConnector.queryClient}>
            <Suspense fallback={<div>Loading...</div>}>
                <Router history={history}>
                    <Switch>
                        <Route exact path={ROUTES.Home}>
                            <Home />
                        </Route>
                    </Switch>
                </Router>
                <ReactQueryDevtools initialIsOpen={false} />
            </Suspense>
        </QueryClientProvider>
    );
};

export default App;
