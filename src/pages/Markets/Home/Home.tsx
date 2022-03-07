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
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivStart } from 'styles/common';
import { MarketInfo, Markets, SortOptionType } from 'types/markets';
import GlobalFilter from '../components/GlobalFilter';
import TagFilter from '../components/TagFilter';
import { TagLabel } from '../components/Tags/Tags';
import MarketsGrid from './MarketsGrid';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';
import { TagFilterEnum, GlobalFilterEnum, SortDirection, DEFAULT_SORT_BY } from 'constants/markets';
import SortOption from '../components/SortOption';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [globalFilter, setGlobalFilter] = useState<GlobalFilterEnum>(GlobalFilterEnum.All);
    const [tagFilter, setTagFilter] = useState<TagFilterEnum>(TagFilterEnum.All);
    const [sortDirection, setSortDirection] = useState(SortDirection.DESC);
    const [sortBy, setSortBy] = useState(DEFAULT_SORT_BY);
    const [marketSearch, setMarketSearch] = useState<string>('');

    const sortOptions: SortOptionType[] = [
        { id: 1, title: t('market.time-remaining-label') },
        { id: 2, title: t('market.title-label') },
    ];

    const marketsQuery = useMarketsQuery(networkId, { enabled: isAppReady });

    const markets: Markets = useMemo(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            return marketsQuery.data as Markets;
        }
        return [];
    }, [marketsQuery.isSuccess, marketsQuery.data]);

    const filteredMarkets = useMemo(() => {
        let filteredMarkets = markets;

        if (tagFilter !== TagFilterEnum.All) {
            filteredMarkets = filteredMarkets.filter((market: MarketInfo) => market.tags.includes(tagFilter));
        }
        switch (globalFilter) {
            case GlobalFilterEnum.Disputed:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => market.numberOfOpenedDisputes > 0);
                break;
            case GlobalFilterEnum.YourPositions:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => market.hasPosition);
                break;
            case GlobalFilterEnum.Claim:
                filteredMarkets = filteredMarkets.filter((market: MarketInfo) => market.isClaimAvailable);
                break;
        }

        return filteredMarkets.sort((a, b) => {
            switch (sortBy) {
                case 1:
                    return sortByField(a, b, sortDirection, 'maturityDate');
                case 2:
                    return sortByField(a, b, sortDirection, 'title');
                default:
                    return 0;
            }
        });
    }, [markets, sortBy, sortDirection, tagFilter, globalFilter]);

    const searchFilteredMarkets = useDebouncedMemo(
        () => {
            return marketSearch
                ? filteredMarkets.filter((market: MarketInfo) =>
                      market.title.toLowerCase().includes(marketSearch.toLowerCase())
                  )
                : filteredMarkets;
        },
        [filteredMarkets, marketSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

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

    return (
        <Container>
            <SearchContainer>
                <Search text={marketSearch} handleChange={setMarketSearch} />
            </SearchContainer>
            <FiltersContainer>
                <GlobalFiltersContainer>
                    {Object.values(GlobalFilterEnum).map((filterItem) => {
                        return (
                            <GlobalFilter
                                disabled={false}
                                selected={globalFilter === filterItem}
                                onClick={() => setGlobalFilter(filterItem)}
                                key={filterItem}
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
                <ButtonsContainer>
                    <Button
                        onClick={() => {
                            navigateTo(ROUTES.Markets.CreateMarket);
                        }}
                    >
                        {t('market.button.create-market-label')}
                    </Button>
                </ButtonsContainer>
            </FiltersContainer>
            <TagsContainer>
                <TagLabel>{t('market.tags-label')}:</TagLabel>
                {Object.values(TagFilterEnum).map((filterItem) => {
                    return (
                        <TagFilter
                            disabled={false}
                            selected={tagFilter === filterItem}
                            onClick={() => setTagFilter(tagFilter === filterItem ? TagFilterEnum.All : filterItem)}
                            key={filterItem}
                        >
                            {t(`market.filter-label.tag.${filterItem.toLowerCase()}`)}
                        </TagFilter>
                    );
                })}
            </TagsContainer>
            {marketsQuery.isLoading ? (
                <SimpleLoader />
            ) : (
                <MarketsGrid markets={marketSearch ? searchFilteredMarkets : filteredMarkets} />
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
    margin: 30px 0;
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

export default Home;
