import Button from 'components/Button';
import { PAYMENT_CURRENCY } from 'constants/currency';
import { BID_INPUT_STEP } from 'constants/markets';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import NumericInput from '../NumericInput';

type BidInputProps = {
    value: string | number;
    label?: string;
    disabled?: boolean;
    selected?: boolean;
    onChange: (e: any, value: any) => void;
    showValidation?: boolean;
    validationMessage?: string;
    currencyLabel?: string;
    showWithdraw?: boolean;
    onWithdrawClick?: () => void;
    initialValue?: string | number;
    isWithdrawing?: boolean;
    withdrawDisabled?: boolean;
    inputDisabled?: boolean;
    simpleInput?: boolean;
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
    initialValue,
    isWithdrawing,
    withdrawDisabled,
    inputDisabled,
    simpleInput,
    ...rest
}) => {
    const { t } = useTranslation();

    return (
        <Container selected={selected} inputDisabled={inputDisabled} simpleInput={simpleInput}>
            <NumericInput
                {...rest}
                value={value}
                onChange={onChange}
                label={simpleInput ? undefined : label}
                disabled={disabled}
                showValidation={showValidation}
                validationMessage={validationMessage}
                currencyLabel={currencyLabel}
                selectOnFocus
            />
            {showWithdraw && (
                <ButtonContainer selected={selected} disabled={!!withdrawDisabled}>
                    <WithdrawButton onClick={onWithdrawClick} disabled={disabled || withdrawDisabled}>
                        {t(`market.button.withdraw-amount-${isWithdrawing ? 'progress-' : ''}label`, {
                            amount: formatCurrencyWithKey(PAYMENT_CURRENCY, initialValue ? initialValue : 0),
                        })}
                    </WithdrawButton>
                </ButtonContainer>
            )}
            {simpleInput && (
                <>
                    <Minus
                        onClick={(e) =>
                            onChange(e, Number(value) < BID_INPUT_STEP ? 0 : Number(value) - BID_INPUT_STEP)
                        }
                    >
                        -
                    </Minus>
                    <Plus onClick={(e) => onChange(e, Number(value) + BID_INPUT_STEP)}>+</Plus>
                </>
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)<{ selected?: boolean; inputDisabled?: boolean; simpleInput?: boolean }>`
    margin-top: 10px;
    margin-bottom: 10px;
    align-items: center;
    position: relative;
    input {
        height: ${(props) => (props.simpleInput ? 28 : 40)}px;
        width: 200px;
        padding: ${(props) => (props.simpleInput ? '6px 85px 4px 40px' : '16px 8px 2px 8px')};
        border-radius: 8px;
        font-size: 16px;
        line-height: 16px;
        border-color: ${(props) =>
            props.selected ? props.theme.borderColor.primary : props.theme.borderColor.tertiary};
        &:disabled {
            opacity: ${(props) => (props.inputDisabled ? 0.4 : 1)};
        }
    }
    .field-container {
        flex-direction: row;
        align-items: center;
        width: fit-content;
        margin-bottom: 0px;
    }
    .field-label {
        position: absolute;
        font-size: 12px;
        line-height: 12px;
        top: 4px;
        left: 10px;
        white-space: nowrap;
        color: ${(props) => props.theme.textColor.tertiary};
    }
    .currency-label {
        font-size: 16px;
        line-height: 16px;
        padding: ${(props) => (props.simpleInput ? '2px 40px 0 0' : '12px 10px 0 0')};
        &.disabled {
            opacity: ${(props) => (props.inputDisabled ? 0.4 : 1)};
        }
    }
`;

const ButtonContainer = styled.div<{ selected?: boolean; disabled: boolean }>`
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
            opacity: ${(props) => (props.disabled ? 0.6 : 1)};
        }
        &:disabled {
            opacity: ${(props) => (props.disabled ? 0.6 : 1)};
        }
    }
`;

const Minus = styled(FlexDivCentered)`
    font-weight: bold;
    position: absolute;
    font-size: 27px;
    top: 0px;
    left: 2px;
    width: 30px;
    height: 26px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
`;

const Plus = styled(Minus)`
    left: auto;
    right: 0px;
`;

const WithdrawButton = styled(Button)``;

export default BidInput;
