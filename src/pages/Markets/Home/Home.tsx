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
    SortOptionType,
    TagInfo,
    Tags,
} from 'types/markets';
import GlobalFilter from '../components/GlobalFilter';
import TagButton from '../../../components/TagButton';
import MarketsGrid from './MarketsGrid';
import { GlobalFilterEnum, SortDirection, DEFAULT_SORT_BY, MarketStatus } from 'constants/markets';
import SortOption from '../components/SortOption';
import useTagsQuery from 'queries/markets/useTagsQuery';
import useAccountPositionsQuery from 'queries/markets/useAccountPositionsQuery';
import { LOCAL_STORAGE_KEYS } from 'constants/storage';
import useLocalStorage from 'hooks/useLocalStorage';
import { isClaimAvailable, isPositionAvailable, isPositionAvailableForPositioning } from 'utils/markets';
import { getMarketSearch, setMarketSearch } from 'redux/modules/market';
import { ReactComponent as FiltersIcon } from 'assets/images/filters-icon.svg';
import { ReactComponent as SortingsIcon } from 'assets/images/sortings-icon.svg';
import { ReactComponent as TagsIcon } from 'assets/images/tags-icon.svg';
import OutsideClickHandler from 'react-outside-click-handler';
import Toggle from 'components/fields/Toggle';

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
    const [showTicketMarkets, setShowTicketMarkets] = useLocalStorage(
        LOCAL_STORAGE_KEYS.FILTER_SHOW_TICKET_MARKETS,
        true
    );
    const [lastValidMarkets, setLastValidMarkets] = useState<Markets>([]);
    const [accountPositions, setAccountPositions] = useState<AccountPositionsMap>({});
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [showSortings, setShowSortings] = useState<boolean>(false);
    const [showTags, setShowTags] = useState<boolean>(false);

    const sortOptions: SortOptionType[] = [
        { id: 1, title: t('market.time-remaining-label') },
        { id: 2, title: t('market.pool-size-label') },
        { id: 3, title: t('market.ticket-price-label') },
    ];

    const allTagsFilterItem: TagInfo = {
        id: 0,
        label: t('market.filter-label.all-tags'),
    };

    const [tagFilter, setTagFilter] = useLocalStorage(LOCAL_STORAGE_KEYS.FILTER_TAGS, allTagsFilterItem);
    const [availableTags, setAvailableTags] = useState<Tags>([allTagsFilterItem]);

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

    const typeFilteredMarkets = useMemo(
        () => tagsFilteredMarkets.filter((market: MarketInfo) => market.isTicketType === showTicketMarkets),
        [tagsFilteredMarkets, showTicketMarkets]
    );

    const acitveCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.Open).length;
    }, [typeFilteredMarkets]);

    const resolvePendingCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.ResolvePending).length;
    }, [typeFilteredMarkets]);

    const recentlyResolvedCount = useMemo(() => {
        return typeFilteredMarkets.filter(
            (market: MarketInfo) =>
                market.status === MarketStatus.ResolvedPendingConfirmation ||
                market.status === MarketStatus.CancelledPendingConfirmation
        ).length;
    }, [typeFilteredMarkets]);

    const resolvedCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.ResolvedConfirmed)
            .length;
    }, [typeFilteredMarkets]);

    const cancelledCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.CancelledConfirmed)
            .length;
    }, [typeFilteredMarkets]);

    const pausedCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => market.status === MarketStatus.Paused).length;
    }, [typeFilteredMarkets]);

    const disputedCount = useMemo(() => {
        return typeFilteredMarkets.filter(
            (market: MarketInfo) => market.numberOfOpenDisputes > 0 && !market.isMarketClosedForDisputes
        ).length;
    }, [typeFilteredMarkets]);

    const accountPositionsCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return isPositionAvailable(market, accountPosition);
        }).length;
    }, [typeFilteredMarkets, accountPositions]);

    const accountClaimsCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return isClaimAvailable(market, accountPosition);
        }).length;
    }, [typeFilteredMarkets, accountPositions]);

    const accountNotPositionedCount = useMemo(() => {
        return typeFilteredMarkets.filter((market: MarketInfo) => {
            const accountPosition: AccountPosition = accountPositions[market.address];
            return isPositionAvailableForPositioning(market, accountPosition);
        }).length;
    }, [typeFilteredMarkets, accountPositions]);

    const globalFilteredMarkets = useMemo(() => {
        let filteredMarkets = typeFilteredMarkets;

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
    }, [typeFilteredMarkets, sortBy, sortDirection, globalFilter, accountPositions]);

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
            <ActionsContainer>
                <FiltersContainer>
                    <FilterItemContainer>
                        <FilterItem>
                            <StyledFiltersIcon onClick={() => setShowFilters(true)} />
                            {globalFilter !== GlobalFilterEnum.YourPositions &&
                                globalFilter !== GlobalFilterEnum.Claim && (
                                    <GlobalFilter selected={true} count={getCount(globalFilter)} readOnly>
                                        {t(`market.filter-label.global.${globalFilter.toLowerCase()}`)}
                                    </GlobalFilter>
                                )}
                            <GlobalFilter
                                selected={globalFilter === GlobalFilterEnum.YourPositions}
                                onClick={() => setGlobalFilter(GlobalFilterEnum.YourPositions)}
                                count={getCount(GlobalFilterEnum.YourPositions)}
                                readOnly
                            >
                                {t(`market.filter-label.global.${GlobalFilterEnum.YourPositions.toLowerCase()}`)}
                            </GlobalFilter>
                            <GlobalFilter
                                selected={globalFilter === GlobalFilterEnum.Claim}
                                onClick={() => setGlobalFilter(GlobalFilterEnum.Claim)}
                                count={getCount(GlobalFilterEnum.Claim)}
                                readOnly
                            >
                                {t(`market.filter-label.global.${GlobalFilterEnum.Claim.toLowerCase()}`)}
                            </GlobalFilter>
                        </FilterItem>
                        {showFilters && (
                            <OutsideClickHandler onOutsideClick={() => setShowFilters(false)}>
                                <Filters>
                                    <CloseIconContainer>
                                        <CloseIcon onClick={() => setShowFilters(false)} />
                                    </CloseIconContainer>
                                    {Object.values(GlobalFilterEnum).map((filterItem) => {
                                        return (
                                            <GlobalFilter
                                                disabled={false}
                                                onClick={() => {
                                                    setGlobalFilter(filterItem);
                                                    setShowFilters(false);
                                                }}
                                                key={filterItem}
                                                count={getCount(filterItem)}
                                            >
                                                {t(`market.filter-label.global.${filterItem.toLowerCase()}`)}
                                            </GlobalFilter>
                                        );
                                    })}
                                </Filters>
                            </OutsideClickHandler>
                        )}
                    </FilterItemContainer>
                    <FilterItemContainer>
                        <FilterItem onClick={() => setShowSortings(true)}>
                            <StyledSortingsIcon />
                            <SortOption selected={true} sortDirection={sortDirection} readOnly>
                                {sortOptions.find((sortOption) => sortOption.id === sortBy)?.title}
                            </SortOption>
                        </FilterItem>
                        {showSortings && (
                            <OutsideClickHandler onOutsideClick={() => setShowSortings(false)}>
                                <Filters>
                                    <CloseIconContainer>
                                        <CloseIcon onClick={() => setShowSortings(false)} />
                                    </CloseIconContainer>
                                    {sortOptions.map((sortOption) => {
                                        return (
                                            <SortOption
                                                selected={sortOption.id === sortBy}
                                                sortDirection={sortDirection}
                                                onClick={() => {
                                                    setSort(sortOption);
                                                    setShowSortings(false);
                                                }}
                                                key={sortOption.title}
                                            >
                                                {sortOption.title}
                                            </SortOption>
                                        );
                                    })}
                                </Filters>
                            </OutsideClickHandler>
                        )}
                    </FilterItemContainer>
                    <FilterItemContainer>
                        <FilterItem onClick={() => setShowTags(true)}>
                            <StyledTagsIcon />
                            <TagButton className="read-only" readOnly>
                                {tagFilter.label}
                            </TagButton>
                        </FilterItem>
                        {showTags && (
                            <OutsideClickHandler onOutsideClick={() => setShowTags(false)}>
                                <Filters>
                                    <CloseIconContainer>
                                        <CloseIcon onClick={() => setShowTags(false)} />
                                    </CloseIconContainer>
                                    {availableTags.map((tag: TagInfo) => {
                                        return (
                                            <TagButton
                                                selected={tagFilter.id === tag.id}
                                                onClick={() => {
                                                    setTagFilter(tagFilter.id === tag.id ? allTagsFilterItem : tag);
                                                    setShowTags(false);
                                                }}
                                                key={tag.label}
                                                invertedColors
                                            >
                                                {tag.label}
                                            </TagButton>
                                        );
                                    })}
                                </Filters>
                            </OutsideClickHandler>
                        )}
                    </FilterItemContainer>
                    <ToggleContainer>
                        <Toggle
                            isLeftOptionSelected={showTicketMarkets}
                            onClick={() => {
                                setShowTicketMarkets(!showTicketMarkets);
                            }}
                            leftText={t('market.fixed-ticket-label')}
                            rightText={t('market.open-bid-label')}
                        />
                    </ToggleContainer>
                </FiltersContainer>
            </ActionsContainer>
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

const ActionsContainer = styled(FlexDivRow)`
    margin-bottom: 8px;
    :first-child {
        margin-top: 40px;
    }
    @media (max-width: 767px) {
        :first-child {
            margin-top: 55px;
        }
    }
`;

const FiltersContainer = styled(FlexDivStart)`
    flex-wrap: wrap;
    align-items: center;
    position: relative;
`;

const FilterItemContainer = styled(FlexDivStart)`
    align-items: center;
    position: relative;
`;

const FilterItem = styled(FlexDivStart)`
    align-items: center;
    cursor: pointer;
    flex-wrap: wrap;
`;

const Filters = styled(FlexDivColumn)`
    position: absolute;
    left: 0;
    top: 0;
    border-radius: 20px;
    z-index: 100;
    background: ${(props) => props.theme.background.tertiary};
    color: ${(props) => props.theme.textColor.tertiary};
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    padding: 15px 10px;
`;

const StyledFiltersIcon = styled(FiltersIcon)`
    height: 26px;
    margin-right: 4px;
`;

const StyledSortingsIcon = styled(SortingsIcon)`
    height: 24px;
`;

const StyledTagsIcon = styled(TagsIcon)`
    height: 24px;
`;

const ToggleContainer = styled(FlexDivColumn)`
    span {
        text-transform: uppercase;
    }
    > div {
        margin-bottom: 0px;
    }
    .toogle {
        font-size: 15px;
        line-height: 102.6%;
        height: 34px;
        align-items: center;
    }
    i {
        font-size: 50px;
        margin-top: -4px;
    }
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

const CloseIconContainer = styled(FlexDivStart)`
    align-items: center;
    width: fit-content;
    align-self: center;
    margin-bottom: 6px;
`;

const CloseIcon = styled.i`
    font-size: 18px;
    cursor: pointer;
    &:before {
        font-family: ExoticIcons !important;
        content: '\\004F';
        color: ${(props) => props.theme.button.textColor.primary};
    }
`;

export default Home;
