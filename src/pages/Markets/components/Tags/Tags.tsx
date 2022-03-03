import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivStart } from 'styles/common';

type TagsProps = {
    tags: string[];
    labelFontSize?: number;
};

const Tags: React.FC<TagsProps> = ({ tags, labelFontSize }) => {
    const { t } = useTranslation();

    return (
        <Container>
            <TagLabel labelFontSize={labelFontSize}>{t('market.tags-label')}:</TagLabel>
            {tags.map((tag: string) => (
                <Tag key={tag}>{tag}</Tag>
            ))}
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
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 4px;
`;

const Tag = styled(FlexDivCentered)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 30px;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 20px;
    padding: 4px 8px;
    margin-left: 6px;
    height: 28px;
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 4px;
`;

export default Tags;
