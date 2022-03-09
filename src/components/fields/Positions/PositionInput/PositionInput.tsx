import { Input } from 'components/fields/common';
import React from 'react';
import styled from 'styled-components';
import { FlexDivStart } from 'styles/common';

type PositionInputProps = {
    value: string;
    placeholder?: string;
    disabled?: boolean;
    onChange: (event: string) => void;
    onRemove: () => void;
    showRemoveButton: boolean;
};

const PositionInput: React.FC<PositionInputProps> = ({
    value,
    placeholder,
    disabled,
    onChange,
    onRemove,
    showRemoveButton,
    ...rest
}) => {
    return (
        <Container className={disabled ? 'disabled' : ''}>
            <StyledInput
                {...rest}
                value={value}
                type="text"
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                disabled={disabled}
            />
            {showRemoveButton && <RemoveIcon onClick={onRemove} />}
        </Container>
    );
};

const Container = styled(FlexDivStart)`
    color: ${(props) => props.theme.textColor.primary};
    margin-bottom: 15px;
    align-items: center;
    &.disabled {
        opacity: 0.4;
        cursor: default;
        pointer-events: none;
    }
`;

const StyledInput = styled(Input)`
    height: 30px;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 18px;
    line-height: 18px;
`;

const RemoveIcon = styled.i`
    font-size: 18px;
    margin-left: 10px;
    margin-top: 2px;
    cursor: pointer;
    &:before {
        font-family: Icons !important;
        content: '\\0076';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default PositionInput;
