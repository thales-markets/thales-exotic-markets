import DatetimePicker from 'components/fields/DatetimePicker';
import TextInput from 'components/fields/TextInput';
import TextAreaInput from 'components/fields/TextAreaInput';
import Toggle from 'components/fields/Toggle';
import {
    DEFAULT_POSITIONING_DURATION,
    MarketType,
    MAXIMUM_INPUT_CHARACTERS,
    MAXIMUM_TAGS,
    TagFilterEnum,
} from 'constants/markets';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow } from 'styles/common';
import { Tag } from 'react-tag-autocomplete';
import TagsInput from 'components/fields/TagsInput';
import Header from './Header';
import Description from './Description';
import { convertLocalToUTCDate, convertUTCToLocalDate, setDateTimeToUtcNoon } from 'utils/formatters/date';
import Positions from 'components/fields/Positions/Positions';
import Button from 'components/Button';

const CreateMarket: React.FC = () => {
    const { t } = useTranslation();
    const [question, setQuestion] = useState<string>('');
    const [dataSource, setDataSource] = useState<string>('');
    const [marketType, setMarketType] = useState<MarketType>(MarketType.TICKET);
    const [isWithdrawEnabled, setIsWithdrawEnabled] = useState<boolean>(true);
    const [positions, setPositions] = useState<string[]>(new Array(2).fill(''));
    const [positioningEndDateTime, setPositioningEndDateTime] = useState<Date>(
        setDateTimeToUtcNoon(new Date(new Date().getTime() + DEFAULT_POSITIONING_DURATION))
    );
    const [tags, setTags] = useState<Tag[]>([]);
    const [suggestions, setSuggestions] = useState<Tag[]>(
        Object.values(TagFilterEnum).map((filterItem, index) => ({
            id: index + 1,
            name: t(`market.filter-label.tag.${filterItem.toLowerCase()}`),
            disabled: false,
        }))
    );

    const addPosition = () => {
        setPositions([...positions, '']);
    };

    const removePosition = (index: number) => {
        const newPostions = [...positions];
        newPostions.splice(index, 1);
        setPositions(newPostions);
    };

    const setPositionText = (index: number, text: string) => {
        const newPostions = [...positions];
        newPostions[index] = text;
        setPositions(newPostions);
    };

    const addTag = (tag: Tag) => {
        const tagIndex = tags.findIndex((tagItem: Tag) => tag.id === tagItem.id);
        if (tagIndex === -1 && tags.length < MAXIMUM_TAGS) {
            const suggestionsTagIndex = suggestions.findIndex((tagItem: Tag) => tag.id === tagItem.id);
            const newSuggestions = [...suggestions];
            newSuggestions[suggestionsTagIndex].disabled = true;
            setSuggestions(suggestions);

            setTags([...tags, tag]);
        }
    };

    const removeTag = (index: number) => {
        const tagId = tags[index].id;
        const tagIndex = suggestions.findIndex((tagItem: Tag) => tagId === tagItem.id);
        const newSuggestions = [...suggestions];
        newSuggestions[tagIndex].disabled = false;
        setSuggestions(suggestions);

        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    return (
        <Container>
            <Header />
            <ContentWrapper>
                <Form>
                    <TextAreaInput
                        value={question}
                        onChange={setQuestion}
                        label={t('market.create-market.question-label')}
                        note={t('common.max-input-characters-note', { max: MAXIMUM_INPUT_CHARACTERS })}
                    />
                    <TextInput
                        value={dataSource}
                        onChange={setDataSource}
                        label={t('market.create-market.data-source-label')}
                        note={t('common.max-input-characters-note', { max: MAXIMUM_INPUT_CHARACTERS })}
                    />
                    <Positions
                        positions={positions}
                        onPositionAdd={addPosition}
                        onPositionRemove={removePosition}
                        onPositionChange={setPositionText}
                        label={t('market.create-market.positions-label')}
                    />
                    <DatetimePicker
                        selected={convertUTCToLocalDate(positioningEndDateTime)}
                        onChange={(date: Date) => setPositioningEndDateTime(convertLocalToUTCDate(date))}
                        label={t('market.create-market.positioning-end-label')}
                    />
                    <Toggle
                        isLeftOptionSelected={marketType === MarketType.TICKET}
                        onClick={() => {
                            setMarketType(marketType === MarketType.TICKET ? MarketType.OPEN_BID : MarketType.TICKET);
                        }}
                        label={t('market.create-market.type-label')}
                        leftText={t('market.create-market.type-options.ticket')}
                        rightText={t('market.create-market.type-options.open-bid')}
                    />
                    <Toggle
                        isLeftOptionSelected={isWithdrawEnabled}
                        onClick={() => {
                            setIsWithdrawEnabled(!isWithdrawEnabled);
                        }}
                        label={t('market.create-market.withdraw-label')}
                        leftText={t('market.create-market.withdraw-options.enabled')}
                        rightText={t('market.create-market.withdraw-options.disabled')}
                    />
                    <TagsInput
                        tags={tags}
                        suggestions={suggestions}
                        onTagAdd={addTag}
                        onTagRemove={removeTag}
                        label={t('market.create-market.tags-label', { max: MAXIMUM_TAGS })}
                    />
                    <ButtonContainer>
                        <CreateMarketButton>{t('market.create-market.button.create-market-label')}</CreateMarketButton>
                    </ButtonContainer>
                </Form>
                <Description />
            </ContentWrapper>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 50px;
    align-items: center;
`;

const ContentWrapper = styled(FlexDivRow)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const Form = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 25px;
    padding: 20px;
    height: fit-content;
`;

const CreateMarketButton = styled(Button)`
    height: 32px;
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 40px 0 30px 0;
`;

export default CreateMarket;
