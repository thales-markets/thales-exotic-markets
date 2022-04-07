import useTagsQuery from 'queries/markets/useTagsQuery';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { Tags, TagInfo } from 'types/markets';

const Description: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));

    const tagsQuery = useTagsQuery(networkId, {
        enabled: isAppReady,
    });

    const availableTags: Tags = useMemo(() => {
        if (tagsQuery.isSuccess && tagsQuery.data) {
            return tagsQuery.data as Tags;
        }
        return [];
    }, [tagsQuery.isSuccess, tagsQuery.data]);

    const getTagList = () => (
        <ul>
            {availableTags.map((tag: TagInfo) => (
                <li key={tag.label}>{tag.label}</li>
            ))}
        </ul>
    );

    return (
        <Container>
            <Title>{t('market.create-market.description.title')}</Title>
            <Text>
                <Trans
                    i18nKey="market.create-market.description.text"
                    components={[
                        <p key="0" />,
                        <ul key="1">
                            <li key="0" />
                        </ul>,
                        <h2 key="2" />,
                    ]}
                />
                {getTagList()}
            </Text>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin: 20px 0 20px 40px;
    @media (max-width: 767px) {
        margin-left: 0px;
    }
`;

const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 34px;
    margin-bottom: 30px;
`;

const Text = styled(FlexDivColumn)`
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    text-align: justify;
    p {
        margin-bottom: 15px;
    }
    ul {
        list-style: initial;
        margin-left: 30px;
        margin-bottom: 15px;
    }
    h2 {
        margin-top: 15px;
        margin-bottom: 15px;
        font-size: 20px;
        font-weight: bold;
    }
`;

export default Description;
