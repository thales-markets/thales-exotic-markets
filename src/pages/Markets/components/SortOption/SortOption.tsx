import { SortDirection } from 'constants/markets';
import React from 'react';
import styled from 'styled-components';
import { FlexDivRowCentered } from 'styles/common';

type SortOptionProps = {
    sortDirection: SortDirection;
    selected: boolean;
    disabled?: boolean;
    onClick?: (param: any) => void;
};

const SortOption: React.FC<SortOptionProps> = ({ sortDirection, selected, disabled, onClick, children }) => {
    return (
        <Container className={`${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`} onClick={onClick}>
            <SortText>{children}</SortText>
            <SortIcon selected={selected} sortDirection={sortDirection} />
        </Container>
    );
};

const Container = styled(FlexDivRowCentered)`
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 102.6%;
    letter-spacing: 0.035em;
    cursor: pointer;
    border-bottom: 5px solid transparent;
    &.disabled {
        cursor: default;
        opacity: 0.4;
    }
    color: ${(props) => props.theme.textColor.primary};
    margin-right: 40px;
    padding-bottom: 5px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    margin-bottom: 10px;
`;

const SortText = styled.span`
    text-transform: uppercase;
`;

const SortIcon = styled.i<{ selected: boolean; sortDirection: SortDirection }>`
    font-size: ${(props) => (props.selected && props.sortDirection !== SortDirection.NONE ? 12 : 15)}px;
    margin-left: 4px;
    &:before {
        font-family: Icons !important;
        content: ${(props) =>
            props.selected
                ? props.sortDirection === SortDirection.ASC
                    ? "'\\0068'"
                    : props.sortDirection === SortDirection.DESC
                    ? "'\\006B'"
                    : "'\\006A'"
                : "'\\006A'"};
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default SortOption;
