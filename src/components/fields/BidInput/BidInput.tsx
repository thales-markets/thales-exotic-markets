import Button from 'components/Button';
import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
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
    showWithdraw?: boolean;
    onWithdrawClick?: () => void;
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
    showWithdraw,
    onWithdrawClick,
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
            {showWithdraw && (
                <ButtonContainer selected={selected}>
                    <WithdrawButton onClick={onWithdrawClick}>Withdraw</WithdrawButton>
                </ButtonContainer>
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)<{ selected?: boolean }>`
    margin-top: 15px;
    margin-bottom: 15px;
    align-items: center;
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
        width: fit-content;
        margin-bottom: 0px;
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

const ButtonContainer = styled.div<{ selected?: boolean }>`
    margin-top: 6px;
    button {
        background: transparent;
        min-height: 26px;
        font-size: 15px;
        line-height: 15px;
        padding: 1px 10px 0px 10px;
        border: 2px solid
            ${(props) => (props.selected ? props.theme.borderColor.tertiary : props.theme.borderColor.primary)};
        color: ${(props) => (props.selected ? props.theme.textColor.tertiary : props.theme.textColor.primary)};
        &:hover {
            opacity: 1;
        }
    }
`;

const WithdrawButton = styled(Button)``;

export default BidInput;
