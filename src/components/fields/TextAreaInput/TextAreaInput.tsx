import FieldValidationMessage from 'components/FieldValidationMessage';
import React from 'react';
import { FieldContainer, FieldLabel, FieldNote, TextArea } from '../common';

type TextAreaInputProps = {
    value: string;
    label?: string;
    note?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    showValidation?: boolean;
    validationMessage?: string;
    maximumCharacters?: number;
};

const TextAreaInput: React.FC<TextAreaInputProps> = ({
    value,
    label,
    note,
    placeholder,
    disabled,
    onChange,
    showValidation,
    validationMessage,
    maximumCharacters,
    ...rest
}) => {
    return (
        <FieldContainer>
            {label && <FieldLabel>{label}:</FieldLabel>}
            <TextArea
                {...rest}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className={showValidation ? 'error' : ''}
                maxLength={maximumCharacters}
            />
            <FieldValidationMessage showValidation={showValidation} message={validationMessage} />
            {note && <FieldNote>{note}</FieldNote>}
        </FieldContainer>
    );
};

export default TextAreaInput;
