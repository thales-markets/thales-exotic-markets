import { SortDirection } from 'constants/markets';
import React from 'react';
import styled from 'styled-components';
import { FlexDivStart } from 'styles/common';

type SortOptionProps = {
    sortDirection: SortDirection;
    selected: boolean;
    disabled?: boolean;
    onClick?: (param: any) => void;
    readOnly?: boolean;
};

const SortOption: React.FC<SortOptionProps> = ({ sortDirection, selected, disabled, onClick, children, readOnly }) => {
    return (
        <Container
            className={`${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`}
            onClick={onClick}
            readOnly={readOnly}
        >
            <SortText>{children}</SortText>
            <SortIcon selected={selected} sortDirection={sortDirection} readOnly={readOnly} />
        </Container>
    );
};

const Container = styled(FlexDivStart)<{ readOnly?: boolean }>`
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 102.6%;
    letter-spacing: 0.035em;
    cursor: pointer;
    &.disabled {
        cursor: default;
        opacity: 0.4;
    }
    :hover {
        background: ${(props) => (props.readOnly ? 'transparent' : '#e1d9e7')};
    }
    height: 34px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    padding: ${(props) => (props.readOnly ? '0 4px' : '0 10px')};
    border-radius: 10px;
    align-items: center;
    @media (max-width: 500px) {
        font-size: ${(props) => (props.readOnly ? 13 : 15)}px;
    }
`;

const SortText = styled.span`
    text-transform: uppercase;
    white-space: nowrap;
`;

const SortIcon = styled.i<{ selected: boolean; sortDirection: SortDirection; readOnly?: boolean }>`
    font-size: ${(props) => (props.selected && props.sortDirection !== SortDirection.NONE ? 22 : 18)}px;
    margin-bottom: 2px;
    &:before {
        font-family: ExoticIcons !important;
        content: ${(props) =>
            props.selected
                ? props.sortDirection === SortDirection.ASC
                    ? "'\\0046'"
                    : props.sortDirection === SortDirection.DESC
                    ? "'\\0047'"
                    : "'\\0045'"
                : "'\\0045'"};
    }
`;

export default SortOption;
