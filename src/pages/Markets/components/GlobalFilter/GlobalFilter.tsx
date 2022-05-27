import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivStart } from 'styles/common';

type GlobalFilterProps = {
    disabled?: boolean;
    selected?: boolean;
    count?: number;
    onClick?: (param: any) => void;
    readOnly?: boolean;
};

const GlobalFilter: React.FC<GlobalFilterProps> = ({ disabled, selected, onClick, children, count, readOnly }) => {
    return (
        <Container
            className={`${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
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
    cursor: ${(props) => (props.readOnly ? 'default' : 'pointer')};
    height: 34px;
    &.disabled {
        cursor: default;
        opacity: 0.4;
    }
    align-items: center;
    :hover {
        background: ${(props) => (props.readOnly ? 'transparent' : '#e1d9e7')};
    }
    padding: 0 10px;
    border-radius: 10px;
    flex-direction: ${(props) => (props.readOnly ? 'row-reverse' : 'row')};
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
        props.readOnly ? props.theme.button.background.secondary : props.theme.button.textColor.primary};
    color: ${(props) =>
        props.readOnly ? props.theme.button.textColor.primary : props.theme.button.background.secondary};
    border-radius: 15px;
    padding-left: 4px;
    padding-right: 4px;
    margin-right: ${(props) => (props.readOnly ? 30 : 6)}px;
    margin-left: ${(props) => (props.readOnly ? 6 : 0)}px;
`;

export default GlobalFilter;
