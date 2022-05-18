import Button from 'components/Button';
import SimpleLoader from 'components/SimpleLoader';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import useMarketsQuery from 'queries/markets/useMarketsQuery';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn, FlexDivColumnCentered, FlexDivRow, FlexDivStart } from 'styles/common';
import {
    AccountPosition,
    AccountPositionsMap,
    MarketInfo,
    Markets,
    MarketsParameters,
    SortOptionType,
    TagInfo,
    Tags,
} from 'types/markets';
import GlobalFilter from '../components/GlobalFilter';
import TagButton from '../../../components/TagButton';
import { TagLabel } from '../components/Tags/Tags';
import MarketsGrid from './MarketsGrid';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { GlobalFilterEnum, SortDirection, DEFAULT_SORT_BY, MarketStatus } from 'constants/markets';
import SortOption from '../components/SortOption';
import useTagsQuery from 'queries/markets/useTagsQuery';
import useAccountPositionsQuery from 'queries/markets/useAccountPositionsQuery';
import useMarketsParametersQuery from 'queries/markets/useMarketsParametersQuery';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useLocalStorage from 'hooks/useLocalStorage';
import { isClaimAvailable, isPositionAvailable, isPositionAvailableForPositioning } from 'utils/markets';
import { getMarketSearch, setMarketSearch } from 'redux/modules/market';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const marketSearch = useSelector((state: RootState) => getMarketSearch(state));
    const [globalFilter, setGlobalFilter] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTER_GLOBAL, GlobalFilterEnum.Active);
    const [sortDirection, setSortDirection] = useLocalStorage(LOCAL_STORAGE_KEYS.SORT_DIRECTION, SortDirection.ASC);
    const [sortBy, setSortBy] = useLocalStorage(LOCAL_STORAGE_KEYS.SORT_BY, DEFAULT_SORT_BY);
    // const [showOpenMarkets, setShowOpenMarkets] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTER_SHOW_OPEN_MARKETS, true);
    const [lastValidMarkets, setLastValidMarkets] = useState<Markets>([]);
    const [accountPositions, setAccountPositions] = useState<AccountPositionsMap>({});
    const [marketsParameters, setMarketsParameters] = useState<MarketsParameters | undefined>(undefined);

    const sortOptions: SortOptionType[] = [
        { id: 1, title: t('market.time-remaining-label') },
        { id: 2, title: t('market.pool-size-label') },
        { id: 3, title: t('market.ticket-price-label') },
    ];

    const allTagsFilterItem: TagInfo = {
        id: 0,
        label: t('market.filter-label.all'),
    };

    const firstLevelFilters = [
        GlobalFilterEnum.Active,
        GlobalFilterEnum.ResolvePending,
        GlobalFilterEnum.RecentlyResolved,
        GlobalFilterEnum.Resolved,
        GlobalFilterEnum.Cancelled,
        GlobalFilterEnum.Paused,
        GlobalFilterEnum.Disputed,
    ];

    const secondLevelFilters = [
        GlobalFilterEnum.YourPositions,
        GlobalFilterEnum.Claim,
        GlobalFilterEnum.YourNotPositionedMarkets,
    ];

    const [tagFilter, setTagFilter] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTER_TAGS, allTagsFilterItem);
    const [availableTags, setAvailableTags] = useState<Tags>([allTagsFilterItem]);

    const marketsParametersQuery = useMarketsParametersQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (marketsParametersQuery.isSuccess && marketsParametersQuery.data) {
            setMarketsParameters(marketsParametersQuery.data);
        }
    }, [marketsParametersQuery.isSuccess, marketsParametersQuery.data]);

    const creationRestrictedToOwner = marketsParameters
        ? marketsParameters.creationRestrictedToOwner && marketsParameters.owner !== walletAddress
        : true;

    const marketsQuery = useMarketsQuery(networkId, { enabled: isAppReady });

    useEffect(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            setLastValidMarkets(marketsQuery.data);
        }
    }, [marketsQuery.isSuccess, marketsQuery.data]);

    const markets: Markets = useMemo(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            return marketsQuery.data as Markets;
        }
        return lastValidMarkets;
    }, [marketsQuery.isSuccess, marketsQuery.data]);

    const tagsQuery = useTagsQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (tagsQuery.isSuccess && tagsQuery.data) {
            setAvailableTags([allTagsFilterItem, ...(tagsQuery.data as Tags)]);
        }
    }, [tagsQuery.isSuccess, tagsQuery.data]);

    const accountPositionsQuery = useAccountPositionsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (accountPositionsQuery.isSuccess && accountPositionsQuery.data) {
            setAccountPositions(accountPositionsQuery.data);
        }
    }, [accountPositionsQuery.isSuccess, accountPositionsQuery.data]);

    const searchFilteredMarkets = useDebouncedMemo(
        () => {
            return marketSearch
                ? markets.filter((market: MarketInfo) =>
                      market.question.toLowerCase().includes(marketSearch.toLowerCase())
                  )
                : markets;
        },
        [markets, marketSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    const tagsFilteredMarkets = useMemo(() => {
        let filteredMarkets = marketSearch ? searchFilteredMarkets : markets;

        if (tagFilter.id !== allTagsFilterItem.id) {
            filteredMarkets = filteredMarkets.filter((market: MarketInfo) =>
                market.tags.map((tag) => Number(tag)).includes(tagFilter.id)
            );
        }

        return filteredMarkets;
    }, [markets, searchFilteredMarkets, tagFilter, marketSearch]);

    const acitveCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.Open).length;
    }, [tagsFilteredMarkets]);

    const resolvePendingCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.ResolvePending).length;
    }, [tagsFilteredMarkets]);

    const recentlyResolvedCount = useMemo(() => {
        return tagsFilteredMarkets.filter(
            (market: MarketInfo) =>
                market.status === MarketStatus.ResolvedPendingConfirmation ||
                market.status === MarketStatus.CancelledPendingConfirmation
        ).length;
    }, [tagsFilteredMarkets]);

    const resolvedCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.ResolvedConfirmed)
            .length;
    }, [tagsFilteredMarkets]);

    const cancelledCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.CancelledConfirmed)
            .length;
    }, [tagsFilteredMarkets]);

    const pausedCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.Paused).length;
    }, [tagsFilteredMarkets]);

    const disputedCount = useMemo(() => {
        return tagsFilteredMarkets.filter(
            (market: MarketInfo) => market.numberOfOpenDisputes > 0 && !market.isMarketClosedForDisputes
        ).length;
    }, [tagsFilteredMarkets]);

    const accountPositionsCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return isPositionAvailable(market, accountPosition);
        }).length;
    }, [tagsFilteredMarkets, accountPositions]);

    const accountClaimsCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return isClaimAvailable(market, accountPosition);
        }).length;
    }, [tagsFilteredMarkets, accountPositions]);

    const accountNotPositionedCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return isPositionAvailableForPositioning(market, accountPosition);
        }).length;
    }, [tagsFilteredMarkets, accountPositions]);

    const globalFilteredMarkets = useMemo(() => {
        let filteredMarkets = tagsFilteredMarkets;

        switch (globalFilter) {
            case GlobalFilterEnum.Active:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.Open);
                break;
            case GlobalFilterEnum.ResolvePending:
                filteredMarkets = filteredMarkets.filter(
                    (market: MarketInfo) => market.status === MarketStatus.ResolvePending
                );
                break;
            case GlobalFilterEnum.RecentlyResolved:
                filteredMarkets = filteredMarkets.filter(
                    (market: MarketInfo) =>
                        market.status === MarketStatus.ResolvedPendingConfirmation ||
                        market.status === MarketStatus.CancelledPendingConfirmation
                );
                break;
            case GlobalFilterEnum.Resolved:
                filteredMarkets = filteredMarkets.filter(
                    (market: MarketInfo) => market.status === MarketStatus.ResolvedConfirmed
                );
                break;
            case GlobalFilterEnum.Cancelled:
                filteredMarkets = filteredMarkets.filter(
                    (market: MarketInfo) => market.status === MarketStatus.CancelledConfirmed
                );
                break;
            case GlobalFilterEnum.Paused:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.Paused);
                break;
            case GlobalFilterEnum.Disputed:
                filteredMarkets = filteredMarkets.filter(
                    (market: MarketInfo) => market.numberOfOpenDisputes > 0 && !market.isMarketClosedForDisputes
                );
                break;
            case GlobalFilterEnum.YourPositions:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => {
                    const accountPosition: AccountPosition = accountPositions[market.address];
                    return isPositionAvailable(market, accountPosition);
                });
                break;
            case GlobalFilterEnum.Claim:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => {
                    const accountPosition: AccountPosition = accountPositions[market.address];
                    return isClaimAvailable(market, accountPosition);
                });
                break;
            case GlobalFilterEnum.YourNotPositionedMarkets:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => {
                    const accountPosition: AccountPosition = accountPositions[market.address];
                    return isPositionAvailableForPositioning(market, accountPosition);
                });
                break;
            default:
                break;
        }

        return filteredMarkets.sort((a, b) => {
            switch (sortBy) {
                case 1:
                    return sortByField(a, b, sortDirection, 'endOfPositioning');
                case 2:
                    return sortByField(a, b, sortDirection, 'poolSize');
                case 3:
                    return sortByField(a, b, sortDirection, 'ticketPrice');
                default:
                    return 0;
            }
        });
    }, [tagsFilteredMarkets, sortBy, sortDirection, globalFilter, accountPositions]);

    const setSort = (sortOption: SortOptionType) => {
        if (sortBy === sortOption.id) {
            switch (sortDirection) {
                case SortDirection.NONE:
                    setSortDirection(SortDirection.DESC);
                    break;
                case SortDirection.DESC:
                    setSortDirection(SortDirection.ASC);
                    break;
                case SortDirection.ASC:
                    setSortDirection(SortDirection.DESC);
                    setSortBy(DEFAULT_SORT_BY);
                    break;
            }
        } else {
            setSortBy(sortOption.id);
            setSortDirection(SortDirection.DESC);
        }
    };

    const resetFilters = () => {
        setGlobalFilter(GlobalFilterEnum.Active);
        setTagFilter(allTagsFilterItem);
        dispatch(setMarketSearch(''));
    };

    const getCount = (filter: GlobalFilterEnum) => {
        switch (filter) {
            case GlobalFilterEnum.Active:
                return acitveCount;
            case GlobalFilterEnum.ResolvePending:
                return resolvePendingCount;
            case GlobalFilterEnum.RecentlyResolved:
                return recentlyResolvedCount;
            case GlobalFilterEnum.Resolved:
                return resolvedCount;
            case GlobalFilterEnum.Cancelled:
                return cancelledCount;
            case GlobalFilterEnum.Paused:
                return pausedCount;
            case GlobalFilterEnum.Disputed:
                return disputedCount;
            case GlobalFilterEnum.YourPositions:
                return accountPositionsCount;
            case GlobalFilterEnum.Claim:
                return accountClaimsCount;
            case GlobalFilterEnum.YourNotPositionedMarkets:
                return accountNotPositionedCount;
            default:
                return undefined;
        }
    };

    const marketsList = globalFilteredMarkets;

    return (
        <Container>
            <FiltersContainer>
                <GlobalFiltersContainer>
                    {Object.values(GlobalFilterEnum)
                        .filter((filterItem) => firstLevelFilters.includes(filterItem))
                        .map((filterItem) => {
                            return (
                                <GlobalFilter
                                    disabled={false}
                                    selected={globalFilter === filterItem}
                                    onClick={() => setGlobalFilter(filterItem)}
                                    key={filterItem}
                                    count={getCount(filterItem)}
                                >
                                    {t(`market.filter-label.global.${filterItem.toLowerCase()}`)}
                                </GlobalFilter>
                            );
                        })}
                </GlobalFiltersContainer>
            </FiltersContainer>
            <FiltersContainer>
                <GlobalFiltersContainer>
                    {Object.values(GlobalFilterEnum)
                        .filter((filterItem) => secondLevelFilters.includes(filterItem))
                        .map((filterItem) => {
                            return (
                                <GlobalFilter
                                    disabled={false}
                                    selected={globalFilter === filterItem}
                                    onClick={() => setGlobalFilter(filterItem)}
                                    key={filterItem}
                                    count={getCount(filterItem)}
                                >
                                    {t(`market.filter-label.global.${filterItem.toLowerCase()}`)}
                                </GlobalFilter>
                            );
                        })}
                </GlobalFiltersContainer>
            </FiltersContainer>
            <FiltersContainer>
                <GlobalFiltersContainer>
                    {sortOptions.map((sortOption) => {
                        return (
                            <SortOption
                                disabled={false}
                                selected={sortOption.id === sortBy}
                                sortDirection={sortDirection}
                                onClick={() => setSort(sortOption)}
                                key={sortOption.title}
                            >
                                {sortOption.title}
                            </SortOption>
                        );
                    })}
                </GlobalFiltersContainer>
                {!creationRestrictedToOwner && (
                    <ButtonsContainer>
                        <Button
                            onClick={() => {
                                navigateTo(ROUTES.Markets.CreateMarket);
                            }}
                        >
                            {t('market.button.create-market-label')}
                        </Button>
                    </ButtonsContainer>
                )}
            </FiltersContainer>
            <FiltersContainer>
                <TagsContainer>
                    <TagLabel>{t('market.tags-label')}:</TagLabel>
                    {availableTags.map((tag: TagInfo) => {
                        return (
                            <TagButton
                                disabled={false}
                                selected={tagFilter.id === tag.id}
                                onClick={() => setTagFilter(tagFilter.id === tag.id ? allTagsFilterItem : tag)}
                                key={tag.label}
                            >
                                {tag.label}
                            </TagButton>
                        );
                    })}
                </TagsContainer>
            </FiltersContainer>
            {marketsQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : marketsList.length === 0 ? (
                <NoMarketsContainer>
                    <NoMarketsLabel>{t('market.no-markets-found')}</NoMarketsLabel>
                    <Button onClick={resetFilters}>{t('market.view-all-markets')}</Button>
                </NoMarketsContainer>
            ) : (
                <MarketsGrid markets={marketsList} accountPositions={accountPositions} />
            )}
        </Container>
    );
};

const sortByField = (a: MarketInfo, b: MarketInfo, direction: SortDirection, field: keyof MarketInfo) => {
    if (direction === SortDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === SortDirection.DESC) {
        return (a[field] as any) > (b[field] as any) ? -1 : 1;
    }

    return 0;
};

const Container = styled(FlexDivColumn)`
    width: 100%;
`;

const FiltersContainer = styled(FlexDivRow)`
    margin-bottom: 2px;
    :first-child {
        margin-top: 50px;
    }
    @media (max-width: 767px) {
        :first-child {
            margin-top: 60px;
        }
    }
`;

const GlobalFiltersContainer = styled(FlexDivStart)`
    flex-wrap: wrap;
    align-items: center;
`;

const ButtonsContainer = styled(FlexDivColumn)`
    align-items: end;
    margin-bottom: 14px;
`;

const TagsContainer = styled(FlexDivStart)`
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 10px;
    margin-right: 20px;
`;

const NoMarketsContainer = styled(FlexDivColumnCentered)`
    min-height: 200px;
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 28px;
    line-height: 100%;
    button {
        padding-top: 1px;
    }
`;

const NoMarketsLabel = styled.span`
    margin-bottom: 30px;
`;

const LoaderContainer = styled(FlexDivColumn)`
    position: relative;
    min-height: 300px;
`;

export default Home;
