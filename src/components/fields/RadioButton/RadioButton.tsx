import React, { ChangeEvent } from 'react';
import styled from 'styled-components';

type TextColor = 'primary' | 'secondary' | 'tertiary';

type RadioButtonProps = {
    value: string | number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    disabled?: boolean;
    checked: boolean;
    label?: string;
    isColumnDirection?: boolean;
    color?: TextColor;
};

const RadioButton: React.FC<RadioButtonProps> = ({
    value,
    onChange,
    className,
    disabled,
    checked,
    label,
    isColumnDirection,
    color = 'primary',
    ...rest
}) => {
    return (
        <Container className={disabled ? 'disabled' : ''} isColumnDirection={isColumnDirection} color={color}>
            {label}
            <Input
                {...rest}
                type="radio"
                checked={checked}
                value={value}
                onChange={onChange}
                className={className}
                disabled={disabled}
            />
            <Checkmark className="checkmark" isColumnDirection={isColumnDirection} />
        </Container>
    );
};

const Input = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
`;

const Container = styled.label<{ isColumnDirection?: boolean; color: TextColor }>`
    display: ${(props) => (props.isColumnDirection ? 'flex' : 'block')};
    position: relative;
    padding-top: ${(props) => (props.isColumnDirection ? 40 : 0)}px;
    padding-left: ${(props) => (props.isColumnDirection ? 0 : 45)}px;
    cursor: pointer;
    font-style: normal;
    font-weight: normal;
    font-size: ${(props) => (props.isColumnDirection ? 40 : 45)}px;
    line-height: ${(props) => (props.isColumnDirection ? 40 : 60)}px;
    color: ${(props) => props.theme.textColor[props.color]};
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    input:checked ~ .checkmark {
        background-color: transparent;
    }
    input:checked ~ .checkmark:after {
        display: block;
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
    align-self: center;
    justify-content: center;
`;

const Checkmark = styled.span<{ isColumnDirection?: boolean }>`
    position: absolute;
    top: 0;
    left: ${(props) => (props.isColumnDirection ? 'auto' : '0')};
    height: 36px;
    width: 36px;
    border: 5px solid ${(props) => props.theme.borderColor.primary};
    background-color: transparent;
    border-radius: 50%;
    margin-top: ${(props) => (props.isColumnDirection ? 0 : 10)}px;
    :after {
        content: '';
        position: absolute;
        display: none;
        left: 5px;
        top: 5px;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${(props) => props.theme.borderColor.primary};
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;

export default RadioButton;
