import React from 'react';
import styled from 'styled-components';

type GlobalFilterProps = {
    disabled?: boolean;
    selected?: boolean;
    onClick?: (param: any) => void;
};

const GlobalFilter: React.FC<GlobalFilterProps> = ({ disabled, selected, onClick, children }) => {
    return (
        <Container className={`${disabled ? 'disabled' : ''} ${selected ? 'selected' : ''}`} onClick={onClick}>
            {children}
        </Container>
    );
};

const Container = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 15px;
    line-height: 102.6%;
    letter-spacing: 0.035em;
    text-transform: uppercase;
    cursor: pointer;
    border-bottom: 5px solid transparent;
    &.selected,
    &:hover {
        border-bottom: 5px solid ${(props) => props.theme.borderColor.secondary};
    }
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
`;

export default GlobalFilter;
