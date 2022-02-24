import Button from 'components/Button';
import Loader from 'components/Loader';
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
import { Market, Markets } from 'types/markets';
import GlobalFilter from '../components/GlobalFilter';
import TagFilter from '../components/TagFilter';
import { TagLabel } from '../components/Tags/Tags';
import MarketsGrid from './MarketsGrid';
import { navigateTo } from 'utils/routes';
import ROUTES from 'constants/routes';

export enum TagFilterEnum {
    All = 'All',
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

export enum GlobalFilterEnum {
    All = 'All',
    Disputed = 'Disputed',
    YourPositions = 'YourPositions',
    Claim = 'Claim',
    History = 'History',
}

export enum OrderDirection {
    NONE,
    ASC,
    DESC,
}

const DEFAULT_ORDER_BY = 1;

const Home: React.FC = () => {
    const { t } = useTranslation();

    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [globalFilter, setGlobalFilter] = useState<GlobalFilterEnum>(GlobalFilterEnum.All);
    const [tagFilter, setTagFilter] = useState<TagFilterEnum>(TagFilterEnum.All);
    const [orderDirection] = useState(OrderDirection.DESC);
    const [orderBy] = useState(DEFAULT_ORDER_BY);
    const [marketSearch, setMarketSearch] = useState<string>('');

    const marketsQuery = useMarketsQuery(networkId, { enabled: isAppReady });

    const markets: Markets = useMemo(() => {
        if (marketsQuery.isSuccess && marketsQuery.data) {
            return marketsQuery.data;
        }
        return [];
    }, [marketsQuery.isSuccess, marketsQuery.data]);

    const filteredMarkets = useMemo(() => {
        let filteredMarkets = markets;

        if (tagFilter !== TagFilterEnum.All) {
            filteredMarkets = filteredMarkets.filter((market: Market) => market.tags.includes(tagFilter));
        }
        switch (globalFilter) {
            case GlobalFilterEnum.Disputed:
                filteredMarkets = filteredMarkets.filter((market: Market) => market.numberOfOpenedDisputes > 0);
                break;
            case GlobalFilterEnum.YourPositions:
                filteredMarkets = filteredMarkets.filter((market: Market) => market.hasPosition);
                break;
            case GlobalFilterEnum.Claim:
                filteredMarkets = filteredMarkets.filter((market: Market) => market.isClaimAvailable);
                break;
        }

        return filteredMarkets.sort((a, b) => {
            switch (orderBy) {
                case 1:
                    return sortByField(a, b, orderDirection, 'maturityDate');
                default:
                    return 0;
            }
        });
    }, [markets, orderBy, orderDirection, tagFilter, globalFilter]);

    const searchFilteredMarkets = useDebouncedMemo(
        () => {
            return marketSearch
                ? filteredMarkets.filter((market: Market) =>
                      market.title.toLowerCase().includes(marketSearch.toLowerCase())
                  )
                : filteredMarkets;
        },
        [filteredMarkets, marketSearch],
        DEFAULT_SEARCH_DEBOUNCE_MS
    );

    return marketsQuery.isLoading ? (
        <Loader />
    ) : (
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
            <MarketsGrid markets={marketSearch ? searchFilteredMarkets : filteredMarkets} />
        </Container>
    );
};

const sortByField = (a: Market, b: Market, direction: OrderDirection, field: keyof Market) => {
    if (direction === OrderDirection.ASC) {
        return (a[field] as any) > (b[field] as any) ? 1 : -1;
    }
    if (direction === OrderDirection.DESC) {
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
