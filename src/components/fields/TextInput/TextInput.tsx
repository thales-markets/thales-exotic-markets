import React from 'react';
import { FieldContainer, FieldLabel, Input } from '../common';

type TextInputProps = {
    value: string;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
};

const TextInput: React.FC<TextInputProps> = ({ value, label, placeholder, disabled, onChange, ...rest }) => {
    return (
        <FieldContainer>
            {label && <FieldLabel>{label}:</FieldLabel>}
            <Input
                {...rest}
                value={value}
                type="text"
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                disabled={disabled}
            />
        </FieldContainer>
    );
};

export default TextInput;
