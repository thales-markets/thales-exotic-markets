import Button from 'components/Button';
import { FieldLabel } from 'components/fields/common';
import DatetimePicker from 'components/fields/DatetimePicker';
import TextInput from 'components/fields/TextInput';
import Toggle from 'components/fields/Toggle';
import { MarketType, TagFilterEnum } from 'constants/markets';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow } from 'styles/common';
import PositionInput from '../components/PositionInput';
import { Tag } from 'react-tag-autocomplete';
import TagsInput from 'components/fields/TagsInput';

const roundMinutes = (date: Date) => {
    date.setUTCHours(12, 0, 0, 0);
    return date;
};

const CreateMarket: React.FC = () => {
    const { t } = useTranslation();
    const [question, setQuestion] = useState<string>('');
    const [dataSource, setDataSource] = useState<string>('');
    const [marketType, setMarketType] = useState<MarketType>(MarketType.TICKET);
    const [isWithdrawEnabled, setIsWithdrawEnabled] = useState<boolean>(true);
    const [positions, setPositions] = useState<string[]>(new Array(2).fill(''));
    const [positioningEndDateTime, setPositioningEndDateTime] = useState<Date>(
        roundMinutes(new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000))
    );
    const [tags, setTags] = useState<Tag[]>([]);

    const enableRemovePosition = positions.length > 2;
    const enableAddPosition = positions.length < 5;

    const addPosition = () => {
        const newPostions = [...positions];
        newPostions.push('');
        setPositions(newPostions);
    };

    const removePosition = (i: number) => {
        const newPostions = [...positions];
        newPostions.splice(i, 1);
        setPositions(newPostions);
    };

    const setPositionText = (i: number, text: string) => {
        const newPostions = [...positions];
        newPostions[i] = text;
        setPositions(newPostions);
    };

    const Today: Date = new Date();

    const datePickerMinDate: Date = new Date();

    const datePickerMaxDate: Date = new Date();

    datePickerMaxDate.setFullYear(datePickerMaxDate.getFullYear() + 2);

    const handleDelete = (i: number) => {
        setTags(tags.filter((_, index) => index !== i));
    };

    const handleAddition = (tag: Tag) => {
        setTags([...tags, tag]);
    };

    const suggestions: Tag[] = Object.values(TagFilterEnum).map((filterItem, index) => ({
        id: index + 1,
        name: t(`market.filter-label.tag.${filterItem.toLowerCase()}`),
    }));

    return (
        <Container>
            <Header>
                <HeaderColumn>
                    <HeaderTitle>Deposit Bond</HeaderTitle>
                    <ProgressItem isCompleted={true} />
                    <HeaderButtonContainer>
                        <Button>Deposit</Button>
                    </HeaderButtonContainer>
                    <InfoContainer>
                        <InfoLabel>Bond deposit</InfoLabel>
                        <Info>100 THALES</Info>
                    </InfoContainer>
                </HeaderColumn>
                <HeaderColumn>
                    <HeaderTitle>Create Market</HeaderTitle>
                    <ProgressItem />
                </HeaderColumn>
                <HeaderColumn>
                    <HeaderTitle>Launch Market</HeaderTitle>
                    <ProgressItem isLineHidden={true} />
                    <HeaderButtonContainer>
                        <Button>Start</Button>
                    </HeaderButtonContainer>
                </HeaderColumn>
            </Header>
            <ContentWrapper>
                <Form>
                    <TextInput
                        value={question}
                        onChange={setQuestion}
                        label={t('market.create-market.question-label')}
                    />
                    <TextInput
                        value={dataSource}
                        onChange={setDataSource}
                        label={t('market.create-market.data-source-label')}
                    />
                    <FlexDivColumn style={{ marginBottom: 15, flex: 'initial' }}>
                        <FieldLabel>{t('market.create-market.positions-label')}:</FieldLabel>
                        {positions.map((postiton: string, i: number) => {
                            return (
                                <PositionInput
                                    key={`position${i}`}
                                    value={postiton}
                                    onChange={(text: string) => setPositionText(i, text)}
                                    onRemove={() => removePosition(i)}
                                    showRemoveButton={enableRemovePosition}
                                />
                            );
                        })}
                        {enableAddPosition && <Button onClick={addPosition}>Add position</Button>}
                    </FlexDivColumn>
                    <FlexDivColumn style={{ marginBottom: 15, flex: 'initial' }}>
                        <FieldLabel>{t('market.create-market.positioning-end-label')}:</FieldLabel>
                        <DatetimePicker
                            className="maturity-date"
                            dateFormat="MMM d, yyyy | HH:mm"
                            timeFormat="HH:mm"
                            minDate={datePickerMinDate}
                            maxDate={datePickerMaxDate}
                            startDate={Today}
                            selected={positioningEndDateTime}
                            endDate={positioningEndDateTime}
                            // onFocus={(e) => {
                            //     document.body.clientWidth < 600
                            //         ? ((e.target.readOnly = true), e.target.scrollIntoView({ behavior: 'smooth' }))
                            //         : (e.target.readOnly = false);
                            // }}
                            onChange={(d: Date) => setPositioningEndDateTime(d)}
                            // readOnly={isCreatingMarket || isMarketCreated}
                            popperPlacement="bottom-start"
                            showTimeSelect
                            // popperModifiers={{
                            //     flip: {
                            //         behavior: ['bottom'],
                            //     },
                            //     preventOverflow: {
                            //         enabled: false,
                            //     },
                            //     hide: {
                            //         enabled: false,
                            //     },
                            // }}
                        />
                    </FlexDivColumn>
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
                        onDelete={handleDelete}
                        onAddition={handleAddition}
                        suggestions={suggestions}
                        tags={tags}
                        label={t('market.create-market.tags-label')}
                    />
                </Form>
                <Description>
                    <DescriptionTitle>Guidelines</DescriptionTitle>
                    <DescriptionText>
                        <Trans i18nKey="market.create-market.description-text" components={[<p key="0" />]} />
                    </DescriptionText>
                </Description>
            </ContentWrapper>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 50px;
    align-items: center;
`;

const Header = styled(FlexDivRow)`
    margin-bottom: 40px;
    width: 600px;
`;

const HeaderColumn = styled(FlexDivColumn)``;

const HeaderTitle = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 25px;
    line-height: 34px;
    color: ${(props) => props.theme.textColor.primary};
    text-align: center;
`;

const ProgressItem = styled(FlexDivCentered)<{ isLineHidden?: boolean; isCompleted?: boolean }>`
    position: relative;
    height: 34px;
    margin-top: 10px;
    &:before {
        content: '';
        position: absolute;
        box-sizing: border-box;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 8px solid #612a70;
        background: ${(props) => (props.isCompleted ? props.theme.textColor.secondary : props.theme.textColor.primary)};
        box-shadow: 0 0 0 2px
            ${(props) => (props.isCompleted ? props.theme.textColor.secondary : props.theme.textColor.primary)};
    }
    &:after {
        content: '';
        position: absolute;
        box-sizing: border-box;
        left: 115px;
        top: 16px;
        width: 200px;
        height: 2px;
        background: ${(props) => (props.isCompleted ? props.theme.textColor.secondary : props.theme.textColor.primary)};
        display: ${(props) => (props.isLineHidden ? 'none' : 'block')};
    }
`;

const HeaderButtonContainer = styled(FlexDivCentered)`
    margin-top: 15px;
`;

const InfoContainer = styled(FlexDivColumn)`
    font-style: normal;
    font-weight: normal;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    text-transform: uppercase;
    margin-top: 15px;
`;

const InfoLabel = styled.span``;

const Info = styled.span`
    font-weight: bold;
`;

const ContentWrapper = styled(FlexDivRow)``;

const Form = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    filter: drop-shadow(0px 10px 30px rgba(0, 0, 0, 0.5));
    border-radius: 25px;
    padding: 20px;
`;

const Description = styled(FlexDivColumn)`
    margin: 40px 0 40px 40px;
`;

const DescriptionTitle = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 34px;
    margin-bottom: 30px;
`;

const DescriptionText = styled(FlexDivColumn)`
    p {
        font-style: normal;
        font-weight: 600;
        font-size: 18px;
        line-height: 25px;
        text-align: justify;
        margin-bottom: 20px;
    }
`;

export default CreateMarket;
