import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import NumericInput from '../NumericInput';

type BidInputProps = {
    value: string | number;
    label?: string;
    disabled?: boolean;
    selected?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>, value: string) => void;
    showValidation?: boolean;
    validationMessage?: string;
    currencyLabel?: string;
};

const BidInput: React.FC<BidInputProps> = ({
    value,
    label,
    disabled,
    onChange,
    showValidation,
    validationMessage,
    currencyLabel,
    selected,
    ...rest
}) => {
    return (
        <Container selected={selected}>
            <NumericInput
                {...rest}
                value={value}
                onChange={onChange}
                label={label}
                disabled={disabled}
                showValidation={showValidation}
                validationMessage={validationMessage}
                currencyLabel={currencyLabel}
            />
        </Container>
    );
};

const Container = styled.div<{ selected?: boolean }>`
    input {
        height: 26px;
        padding: 4px 8px;
        border-radius: 8px;
        font-size: 16px;
        line-height: 16px;
        border-color: ${(props) =>
            props.selected ? props.theme.borderColor.tertiary : props.theme.borderColor.primary};
    }
    .field-container {
        flex-direction: row;
        align-items: center;
        margin-top: 15px;
        width: fit-content;
    }
    .field-label {
        font-size: 16px;
        line-height: 16px;
        margin-bottom: 0px;
        white-space: nowrap;
        margin-right: 4px;
        color: ${(props) => (props.selected ? props.theme.textColor.tertiary : props.theme.textColor.primary)};
    }
    .currency-label {
        font-size: 16px;
        line-height: 16px;
        padding: 0 10px 0 0;
    }
`;

export default BidInput;
