import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';

type TagButtonProps = {
    disabled?: boolean;
    selected?: boolean;
    onClick?: () => void;
    invertedColors?: boolean;
    readOnly?: boolean;
    className?: string;
};

const TagButton: React.FC<TagButtonProps> = ({
    disabled,
    selected,
    onClick,
    children,
    invertedColors,
    readOnly,
    className,
}) => {
    return (
        <Container
            className={`${className ? className : ''} ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
            onClick={() => {
                if (disabled) {
                    return;
                }
                onClick && onClick();
            }}
            invertedColors={invertedColors}
            readOnly={readOnly}
        >
            {children}
        </Container>
    );
};

const Container = styled(FlexDivCentered)<{ invertedColors?: boolean; readOnly?: boolean }>`
    border: 1px solid
        ${(props) =>
            props.readOnly
                ? 'transparent'
                : props.invertedColors
                ? props.theme.borderColor.tertiary
                : props.theme.borderColor.primary};
    border-radius: 30px;
    font-style: normal;
    font-size: 15px;
    line-height: 20px;
    padding: 4px 8px;
    margin-left: ${(props) => (props.readOnly || props.invertedColors ? 0 : 6)}px;
    height: 28px;
    color: ${(props) => (props.invertedColors ? props.theme.textColor.tertiary : props.theme.textColor.primary)};
    margin-bottom: ${(props) => (props.readOnly ? 0 : 4)}px;
    cursor: pointer;
    &.selected:not(.read-only) {
        background: ${(props) => props.theme.button.background.secondary};
        color: ${(props) => props.theme.button.textColor.primary};
    }
    &:hover:not(.disabled):not(.read-only) {
        background: ${(props) => (props.invertedColors ? '#e1d9e7' : props.theme.button.background.secondary)};
        color: ${(props) => props.theme.button.textColor.primary};
        opacity: ${(props) => (props.invertedColors ? 1 : 0.8)};
    }
    &.disabled {
        cursor: default;
        opacity: 0.4;
    }
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    white-space: nowrap;
    text-transform: ${(props) => (props.readOnly ? 'uppercase' : 'none')};
    font-weight: ${(props) => (props.readOnly || props.invertedColors ? 'bold' : 'normal')};
    margin-right: ${(props) => (props.readOnly ? 25 : 0)}px;
    @media (max-width: 500px) {
        font-size: ${(props) => (props.readOnly ? 13 : 15)}px;
        margin-right: ${(props) => (props.readOnly ? 15 : 0)}px;
        padding: ${(props) => (props.readOnly ? '4px 0px' : '4px 8px')};
    }
`;

export default TagButton;
