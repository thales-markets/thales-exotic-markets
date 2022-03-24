import Button from 'components/Button';
import SimpleLoader from 'components/SimpleLoader';
import Search from 'components/Search';
import { DEFAULT_SEARCH_DEBOUNCE_MS } from 'constants/defaults';
import useDebouncedMemo from 'hooks/useDebouncedMemo';
import useMarketsQuery from 'queries/markets/useMarketsQuery';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivColumnCentered, FlexDivRow, FlexDivStart } from 'styles/common';
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
import Toggle from 'components/fields/Toggle';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useLocalStorage from 'hooks/useLocalStorage';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [globalFilter, setGlobalFilter] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTER_GLOBAL, GlobalFilterEnum.All);
    const [sortDirection, setSortDirection] = useLocalStorage(LOCAL_STORAGE_KEYS.SORT_DIRECTION, SortDirection.ASC);
    const [sortBy, setSortBy] = useLocalStorage(LOCAL_STORAGE_KEYS.SORT_BY, DEFAULT_SORT_BY);
    const [marketSearch, setMarketSearch] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTER_MARKET_SEARCH, '');
    const [showOpenMarkets, setShowOpenMarkets] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTER_SHOW_OPEN_MARKETS, true);

    const sortOptions: SortOptionType[] = [
        { id: 1, title: t('market.time-remaining-label') },
        // { id: 2, title: t('market.question-label') },
    ];

    const allTagsFilterItem: TagInfo = {
        id: 0,
        label: t('market.filter-label.all'),
    };
    const [tagFilter, setTagFilter] = useState<TagInfo>(allTagsFilterItem);

    const marketsParametersQuery = useMarketsParametersQuery(networkId, {
        enabled: isAppReady,
    });

    const marketsParameters: MarketsParameters | undefined = useMemo(() => {
        if (marketsParametersQuery.isSuccess && marketsParametersQuery.data) {
            return marketsParametersQuery.data as MarketsParameters;
        }
        return undefined;
    }, [marketsParametersQuery.isSuccess, marketsParametersQuery.data]);

    const creationRestrictedToOwner = marketsParameters
        ? marketsParameters.creationRestrictedToOwner && marketsParameters.owner !== walletAddress
        : true;

    const marketsQuery = useMarketsQuery(networkId, { enabled: isAppReady });

    const markets: Markets = useMemo(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            return marketsQuery.data as Markets;
        }
        return [];
    }, [marketsQuery.isSuccess, marketsQuery.data]);

    const tagsQuery = useTagsQuery(networkId, {
        enabled: isAppReady,
    });

    const availableTags: Tags = useMemo(() => {
        if (tagsQuery.isSuccess && tagsQuery.data) {
            return [allTagsFilterItem, ...(tagsQuery.data as Tags)];
        }
        return [allTagsFilterItem];
    }, [tagsQuery.isSuccess, tagsQuery.data]);

    const accountPositionsQuery = useAccountPositionsQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    const accountPositions: AccountPositionsMap = useMemo(() => {
        if (accountPositionsQuery.isSuccess && accountPositionsQuery.data) {
            return accountPositionsQuery.data as AccountPositionsMap;
        }
        return {};
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
        let filteredMarkets = searchFilteredMarkets;

        if (tagFilter.id !== allTagsFilterItem.id) {
            filteredMarkets = filteredMarkets.filter((market: MarketInfo) =>
                market.tags.map((tag) => Number(tag)).includes(tagFilter.id)
            );
        }

        return filteredMarkets;
    }, [searchFilteredMarkets, tagFilter]);

    const accountClaimsCount = useMemo(() => {
        return tagsFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return (
                !!accountPosition &&
                market.canUsersClaim &&
                accountPosition.position > 0 &&
                (accountPosition.position === market.winningPosition ||
                    market.status === MarketStatus.CancelledConfirmed)
            );
        }).length;
    }, [tagsFilteredMarkets, accountPositions]);

    const showOpenMarketsFilteredMarkets = useMemo(() => {
        let filteredMarkets = tagsFilteredMarkets;

        if (tagFilter.id !== allTagsFilterItem.id) {
            filteredMarkets = filteredMarkets.filter((market: MarketInfo) =>
                market.tags.map((tag) => Number(tag)).includes(tagFilter.id)
            );
        }

        filteredMarkets = filteredMarkets.filter((market: MarketInfo) => market.isResolved !== showOpenMarkets);

        return filteredMarkets;
    }, [tagsFilteredMarkets, tagFilter, showOpenMarkets]);

    const totalCount = showOpenMarketsFilteredMarkets.length;

    const disputedCount = useMemo(() => {
        return showOpenMarketsFilteredMarkets.filter((market: MarketInfo) => {
            return market.numberOfOpenDisputes > 0 && !market.isMarketClosedForDisputes;
        }).length;
    }, [showOpenMarketsFilteredMarkets]);

    const accountPositionsCount = useMemo(() => {
        return showOpenMarketsFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return !!accountPosition && accountPosition.position > 0;
        }).length;
    }, [showOpenMarketsFilteredMarkets, accountPositions]);

    const secondLevelFilteredMarkets = useMemo(() => {
        let filteredMarkets = showOpenMarketsFilteredMarkets;

        switch (globalFilter) {
            case GlobalFilterEnum.Disputed:
                filteredMarkets = filteredMarkets.filter(
                    (market: MarketInfo) => market.numberOfOpenDisputes > 0 && !market.isMarketClosedForDisputes
                );
                break;
            case GlobalFilterEnum.YourPositions:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => {
                    const accountPosition: AccountPosition = accountPositions[market.address];
                    return !!accountPosition && accountPosition.position > 0;
                });
                break;
            case GlobalFilterEnum.Claim:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => {
                    const accountPosition: AccountPosition = accountPositions[market.address];
                    return (
                        !!accountPosition &&
                        market.canUsersClaim &&
                        accountPosition.position > 0 &&
                        (accountPosition.position === market.winningPosition ||
                            market.status === MarketStatus.CancelledConfirmed)
                    );
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
                    return sortByField(a, b, sortDirection, 'question');
                default:
                    return 0;
            }
        });
    }, [showOpenMarketsFilteredMarkets, sortBy, sortDirection, globalFilter, accountPositions]);

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
        setGlobalFilter(GlobalFilterEnum.All);
        setTagFilter(allTagsFilterItem);
        setMarketSearch('');
        setShowOpenMarkets(true);
    };

    const marketsList = secondLevelFilteredMarkets;

    return (
        <Container>
            <SearchContainer>
                <Search text={marketSearch} handleChange={setMarketSearch} />
            </SearchContainer>
            <ToggleContainer>
                <Toggle
                    isLeftOptionSelected={showOpenMarkets}
                    onClick={() => {
                        setShowOpenMarkets(!showOpenMarkets);
                    }}
                    leftText={t('market.open-markets-label')}
                    rightText={t('market.resolved-markets-label')}
                    isCentered
                />
            </ToggleContainer>
            <FiltersContainer>
                <GlobalFiltersContainer>
                    {Object.values(GlobalFilterEnum).map((filterItem) => {
                        const count =
                            filterItem === GlobalFilterEnum.All
                                ? totalCount
                                : filterItem === GlobalFilterEnum.Disputed
                                ? disputedCount
                                : filterItem === GlobalFilterEnum.YourPositions
                                ? accountPositionsCount
                                : filterItem === GlobalFilterEnum.Claim
                                ? accountClaimsCount
                                : undefined;

                        return (
                            <GlobalFilter
                                disabled={false}
                                selected={globalFilter === filterItem}
                                onClick={() => {
                                    if (filterItem === GlobalFilterEnum.Claim) {
                                        setShowOpenMarkets(false);
                                    }
                                    setGlobalFilter(filterItem);
                                }}
                                key={filterItem}
                                count={count}
                            >
                                {t(`market.filter-label.global.${filterItem.toLowerCase()}`)}
                            </GlobalFilter>
                        );
                    })}
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
            {marketsQuery.isLoading ? (
                <SimpleLoader />
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

const SearchContainer = styled(FlexDivCentered)`
    margin-top: 30px;
`;

const ToggleContainer = styled(FlexDivCentered)`
    margin-top: 20px;
    margin-bottom: 10px;
    span {
        text-transform: uppercase;
    }
`;

const FiltersContainer = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

const GlobalFiltersContainer = styled(FlexDivStart)`
    flex-wrap: wrap;
    align-items: center;
`;

const ButtonsContainer = styled(FlexDivColumn)`
    align-items: end;
`;

const TagsContainer = styled(FlexDivStart)`
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 10px;
`;

const NoMarketsContainer = styled(FlexDivColumnCentered)`
    min-height: 200px;
    align-items: center;
    font-style: normal;
    font-weight: bold;
    font-size: 28px;
    line-height: 100%;
    button {
        height: 32px;
        padding-top: 1px;
    }
`;

const NoMarketsLabel = styled.span`
    margin-bottom: 30px;
`;

export default Home;
