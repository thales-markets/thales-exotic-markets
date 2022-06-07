import useTagsQuery from 'queries/markets/useTagsQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivStart, TagColors } from 'styles/common';
import { Tags as TagList } from 'types/markets';

type TagsProps = {
    tags: number[];
    labelFontSize?: number;
    hideLabel?: boolean;
    paintTags?: boolean;
    color?: string;
};

const Tags: React.FC<TagsProps> = ({ tags, labelFontSize, hideLabel, paintTags, color }) => {
    const { t } = useTranslation();
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const [availableTags, setAvailableTags] = useState<TagList>([]);

    const tagsQuery = useTagsQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (tagsQuery.isSuccess && tagsQuery.data) {
            setAvailableTags(tagsQuery.data);
        }
    }, [tagsQuery.isSuccess, tagsQuery.data]);

    return (
        <Container>
            {!hideLabel && <TagLabel labelFontSize={labelFontSize}>{t('market.tags-label')}:</TagLabel>}
            {tags.map((tag: number) => {
                const findTagItem = availableTags.find((t) => t.id == tag);
                const tagIndex = availableTags.findIndex((t) => t.id == tag);

                const colorAvailable = !!paintTags && tagIndex < TagColors.length;
                const tagColor = colorAvailable ? TagColors[tagIndex] : 'transparent';
                return findTagItem ? (
                    <Tag
                        key={findTagItem.label}
                        tagColor={tagColor}
                        colorAvailable={colorAvailable}
                        color={color}
                        className="tag"
                        hideLabel={hideLabel}
                    >
                        {findTagItem.label}
                    </Tag>
                ) : null;
            })}
        </Container>
    );
};

const Container = styled(FlexDivStart)`
    flex-wrap: wrap;
    align-items: center;
`;

export const TagLabel = styled.span<{ labelFontSize?: number }>`
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.labelFontSize || 15}px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 4px;
`;

const Tag = styled(FlexDivCentered)<{ tagColor: string; colorAvailable: boolean; color?: string; hideLabel?: boolean }>`
    border: 1px solid
        ${(props) =>
            props.colorAvailable ? props.tagColor : props.color ? props.color : props.theme.borderColor.tertiary};
    color: ${(props) =>
        props.colorAvailable
            ? props.theme.textColor.primary
            : props.color
            ? props.color
            : props.theme.textColor.tertiary};
    border-radius: 30px;
    font-style: normal;
    font-weight: normal;
    font-size: ${(props) => (props.hideLabel ? 13 : 15)}px;
    line-height: 20px;
    padding: 2px 8px;
    margin-left: 6px;
    :first-child {
        margin-left: ${(props) => (props.hideLabel ? 0 : 6)}px;
    }
    height: ${(props) => (props.hideLabel ? 24 : 28)}px;
    margin-bottom: 4px;
    background: ${(props) => props.tagColor};
`;

export default Tags;
