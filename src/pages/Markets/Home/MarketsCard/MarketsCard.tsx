import TimeRemaining from 'components/TimeRemaining';
import React from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import { Market } from 'types/markets';

type MarketsCardProps = {
    market: Market;
};

const MarketsCard: React.FC<MarketsCardProps> = ({ market }) => {
    return (
        <Container>
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
        </Container>
    );
};

const Container = styled(FlexDivColumnCentered)`
    border: 1px solid ${(props) => props.theme.textColor};
    box-sizing: border-box;
    border-radius: 25px;
    width: 390px;
    padding: 20px;
    margin: 7.5px;
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

export default MarketsCard;
