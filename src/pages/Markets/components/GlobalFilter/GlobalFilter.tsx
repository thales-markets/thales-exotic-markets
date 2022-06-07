import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivStart } from 'styles/common';

type GlobalFilterProps = {
    disabled?: boolean;
    selected?: boolean;
    count?: number;
    onClick?: (param: any) => void;
    readOnly?: boolean;
    className?: string;
};

const GlobalFilter: React.FC<GlobalFilterProps> = ({
    disabled,
    selected,
    onClick,
    children,
    count,
    readOnly,
    className,
}) => {
    return (
        <Container
            className={`${className ? className : ''} ${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
            onClick={onClick}
            readOnly={readOnly}
        >
            {count !== undefined && <Count readOnly={readOnly}>{count}</Count>}
            <Label>{children}</Label>
        </Container>
    );
};

const Container = styled(FlexDivStart)<{ readOnly?: boolean }>`
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 102.6%;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    cursor: pointer;
    height: ${(props) => (props.readOnly ? 42 : 34)}px;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    &.disabled {
        cursor: default;
        opacity: 0.4;
    }
    align-items: center;
    .selected,
    :hover {
        background: ${(props) => (props.readOnly ? 'transparent' : '#e1d9e7')};
    }
    &.selected,
    &:hover {
        border-bottom: 5px solid ${(props) => (props.readOnly ? props.theme.borderColor.secondary : 'transparent')};
    }
    padding: ${(props) => (props.readOnly ? '0 0' : '0 10px')};
    border-radius: ${(props) => (props.readOnly ? 0 : 10)}px;
    flex-direction: ${(props) => (props.readOnly ? 'row-reverse' : 'row')};
    margin-right: ${(props) => (props.readOnly ? 15 : 0)}px;
    :last-child {
        margin-right: ${(props) => (props.readOnly ? 25 : 0)}px;
    }
    @media (max-width: 500px) {
        &.selected,
        &:hover {
            border-bottom: 5px solid transparent;
        }
    }
    @media (max-width: 500px) {
        font-size: ${(props) => (props.readOnly ? 13 : 15)}px;
        :last-child {
            margin-right: ${(props) => (props.readOnly ? 15 : 0)}px;
        }
    }
`;

const Label = styled.div`
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    white-space: nowrap;
`;

const Count = styled(FlexDivCentered)<{ readOnly?: boolean }>`
    min-width: 26px;
    height: 26px;
    background: ${(props) =>
        props.readOnly ? props.theme.button.background.secondary : props.theme.button.background.tertiary};
    color: ${(props) =>
        props.readOnly ? props.theme.button.textColor.primary : props.theme.button.textColor.secondary};
    border-radius: 15px;
    padding-left: 4px;
    padding-right: 4px;
    margin-right: ${(props) => (props.readOnly ? 0 : 6)}px;
    margin-left: ${(props) => (props.readOnly ? 6 : 0)}px;
    @media (max-width: 500px) {
        min-width: 22px;
        height: 22px;
        margin-left: ${(props) => (props.readOnly ? 4 : 0)}px;
    }
`;

export default GlobalFilter;
