import React from 'react';
import styled from 'styled-components';
import { FlexDivStart } from 'styles/common';

type OpenDisputeButtonProps = {
    disabled?: boolean;
    onClick?: any;
    numberOfOpenDisputes: number;
};

const OpenDisputeButton: React.FC<OpenDisputeButtonProps> = ({ disabled, onClick, children, numberOfOpenDisputes }) => {
    return (
        <StyledButton disabled={disabled} onClick={onClick}>
            <Container>
                <Label>{children}</Label>
                {numberOfOpenDisputes > 0 && <OpenDisputesNumber>{numberOfOpenDisputes}</OpenDisputesNumber>}
            </Container>
        </StyledButton>
    );
};

const StyledButton = styled.button`
    background: ${(props) => props.theme.button.background.secondary};
    padding: 3px 15px 2px;
    border-radius: 30px;
    font-style: normal;
    font-weight: bold;
    font-size: 19.2px;
    line-height: 26px;
    color: ${(props) => props.theme.button.textColor.primary};
    text-align: center;
    border: none;
    outline: none;
    text-transform: none;
    cursor: pointer;
    white-space: break-spaces;
    height: 28px;
    width: fit-content;
    &:hover {
        opacity: 0.8;
    }
    &:disabled {
        opacity: 0.4;
        cursor: default;
    }
`;

const Container = styled(FlexDivStart)``;

const Label = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 10px;
    line-height: 80%;
    color: ${(props) => props.theme.button.textColor.primary};
    width: 50px;
`;

const OpenDisputesNumber = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 80%;
    color: ${(props) => props.theme.button.textColor.primary};
`;

export default OpenDisputeButton;
