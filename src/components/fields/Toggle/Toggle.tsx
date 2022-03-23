import React from 'react';
import styled from 'styled-components';
import { FlexDivStart } from 'styles/common';
import { FieldContainer, FieldLabel } from '../common';

type ToggleProps = {
    isLeftOptionSelected: boolean;
    label?: string;
    disabled?: boolean;
    onClick?: any;
    leftText?: string;
    rightText?: string;
};

const Toggle: React.FC<ToggleProps> = ({ isLeftOptionSelected, label, disabled, onClick, leftText, rightText }) => {
    return (
        <FieldContainer>
            {label && <FieldLabel>{label}:</FieldLabel>}
            <ToggleContainer
                onClick={() => {
                    if (disabled) {
                        return;
                    }
                    onClick();
                }}
                className={disabled ? 'disabled' : ''}
            >
                {leftText && <ToggleText>{leftText}</ToggleText>}
                <ToggleIcon isLeftOptionSelected={isLeftOptionSelected} />
                {rightText && <ToggleText>{rightText}</ToggleText>}
            </ToggleContainer>
        </FieldContainer>
    );
};

const ToggleContainer = styled(FlexDivStart)`
    font-style: normal;
    font-weight: bold;
    font-size: 20px;
    line-height: 27px;
    cursor: pointer;
    color: ${(props) => props.theme.textColor.primary};
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
    width: fit-content;
`;

const ToggleText = styled.span`
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none;
    :first-child {
        text-align: end;
    }
    width: calc(50% - 25px);
    white-space: nowrap;
    @media (max-width: 575px) {
        white-space: break-spaces;
    }
`;

const ToggleIcon = styled.i<{ isLeftOptionSelected: boolean }>`
    font-size: 48px;
    margin: 0 6px;
    &:before {
        font-family: SidebarIcons !important;
        content: ${(props) => (props.isLeftOptionSelected ? "'\\006C'" : "'\\006B'")};
        color: ${(props) => props.theme.textColor.primary};
    }
`;
export default Toggle;
