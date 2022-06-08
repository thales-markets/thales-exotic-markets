import React from 'react';
import styled from 'styled-components';
import { FlexDivStart, FlexDivCentered } from 'styles/common';

type OpenDisputeInfoProps = {
    numberOfOpenDisputes: number;
    labelFontSize?: number;
};

const OpenDisputeInfo: React.FC<OpenDisputeInfoProps> = ({ children, numberOfOpenDisputes, labelFontSize }) => {
    return (
        <Container>
            <Label labelFontSize={labelFontSize}>{children}:</Label>
            <OpenDisputesNumber>{numberOfOpenDisputes}</OpenDisputesNumber>
        </Container>
    );
};

const Container = styled(FlexDivStart)`
    align-items: center;
    margin-left: 10px;
`;

const Label = styled.span<{ labelFontSize?: number }>`
    font-style: normal;
    font-weight: bold;
    font-size: ${(props) => props.labelFontSize || 15}px;
    line-height: 100%;
    text-align: center;
    margin-bottom: 4px;
`;

const OpenDisputesNumber = styled(FlexDivCentered)`
    font-size: 18px;
    font-weight: bold;
    margin-left: 4px;
    min-width: 28px;
    height: 28px;
    background: ${(props) => props.theme.button.background.tertiary};
    color: ${(props) => props.theme.button.textColor.secondary};
    border-radius: 15px;
    margin-bottom: 4px;
    padding-left: 4px;
    padding-right: 4px;
`;

export default OpenDisputeInfo;
