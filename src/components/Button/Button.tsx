import React from 'react';
import styled from 'styled-components';

type ButtonType = 'primary' | 'secondary' | undefined;

type ButtonProps = {
    type?: ButtonType;
    disabled?: boolean;
    onClick?: any;
};

const Button: React.FC<ButtonProps> = ({ type, disabled, onClick, children }) => {
    return (
        <StyledButton disabled={disabled} onClick={onClick} buttonType={type}>
            {children}
        </StyledButton>
    );
};

const StyledButton = styled.button<{ buttonType: ButtonType }>`
    background: ${(props) =>
        props.buttonType === 'secondary'
            ? props.theme.button.background.secondary
            : props.theme.button.background.primary};
    padding: 2px 20px;
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

export default Button;
