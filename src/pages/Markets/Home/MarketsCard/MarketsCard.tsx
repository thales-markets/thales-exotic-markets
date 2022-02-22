import TimeRemaining from 'components/TimeRemaining';
import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumnCentered, FlexDivRow, FlexDivStart } from 'styles/common';
import { Market } from 'types/markets';

type MarketsCardProps = {
    market: Market;
};

const MarketsCard: React.FC<MarketsCardProps> = ({ market }) => {
    return (
        <Container isOpen={market.isOpen}>
            <Title>{market.title}</Title>
            <Options>
                {market.options.map((option: string) => (
                    <Option key={option}>{option}</Option>
                ))}
            </Options>
            <TimeRemainingContainer>
                <TimeRemainingLabel>Time Remaining:</TimeRemainingLabel>
                <TimeRemaining end={market.maturityDate} fontSize={25} />
            </TimeRemainingContainer>
            <CardFooter>
                <Tags>
                    <TagsLabel>Tags:</TagsLabel>
                    {market.tags.map((tag: string) => (
                        <Tag key={tag}>{tag}</Tag>
                    ))}
                </Tags>
                <Button>Claim</Button>
            </CardFooter>
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)<{ isOpen: boolean }>`
    border: ${(props) => (props.isOpen ? 1 : 2)}px solid
        ${(props) => (props.isOpen ? props.theme.borderColor : props.theme.borderColorHighlight)};
    box-sizing: border-box;
    border-radius: 25px;
    width: 390px;
    padding: 20px;
    margin: 7.5px;
    &:hover {
        background: ${(props) => props.theme.backgroundHover};
    }
`;

const Title = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor};
    margin-bottom: 25px;
`;

const Options = styled(FlexDivColumnCentered)`
    margin-bottom: 25px;
`;

const Option = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 27px;
    text-align: center;
    color: ${(props) => props.theme.textColor};
`;

const TimeRemainingContainer = styled(FlexDivColumnCentered)``;

const TimeRemainingLabel = styled.span`
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor};
    margin-bottom: 4px;
`;

const CardFooter = styled(FlexDivRow)`
    margin-top: 25px;
`;

const Tags = styled(FlexDivStart)`
    flex-wrap: wrap;
    align-items: center;
`;

const TagsLabel = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 100%;
    text-align: center;
    margin-top: 4px;
    color: ${(props) => props.theme.textColor};
`;

const Tag = styled(FlexDivCentered)`
    border: 1px solid ${(props) => props.theme.borderColor};
    border-radius: 30px;
    font-style: normal;
    font-weight: normal;
    font-size: 15px;
    line-height: 20px;
    padding: 4px 8px;
    margin-left: 6px;
    height: 28px;
    margin-top: 4px;
    color: ${(props) => props.theme.textColor};
`;

const Button = styled.button`
    background: ${(props) => props.theme.button.background.primary};
    padding: 2px 15px;
    border-radius: 30px;
    font-style: normal;
    font-weight: bold;
    font-size: 19.2px;
    line-height: 26px;
    color: ${(props) => props.theme.button.textColor.primary};
    text-align: center;
    border: none;
    outline: none;
    text-transform: none !important;
    cursor: pointer;
    white-space: break-spaces;
    height: 28px;
    margin-top: 4px;
    &:hover {
        opacity: 0.8;
    }
`;

export default MarketsCard;
