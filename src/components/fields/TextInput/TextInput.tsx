import FieldValidationMessage from 'components/FieldValidationMessage';
import Tooltip from 'components/Tooltip';
import React from 'react';
import { FieldContainer, FieldLabel, FieldNote, Input, OverlayContainer } from '../common';

type TextInputProps = {
    value: string;
    label?: string;
    note?: string;
    placeholder?: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    showValidation?: boolean;
    validationMessage?: string;
    maximumCharacters?: number;
    tooltip?: string;
};

const TextInput: React.FC<TextInputProps> = ({
    value,
    label,
    note,
    placeholder,
    disabled,
    onChange,
    showValidation,
    validationMessage,
    maximumCharacters,
    tooltip,
    ...rest
}) => {
    return (
        <FieldContainer>
            {label && (
                <FieldLabel>
                    {label}
                    {tooltip && (
                        <Tooltip
                            overlay={<OverlayContainer>{tooltip}</OverlayContainer>}
                            iconFontSize={20}
                            marginLeft={4}
                            top={0}
                        />
                    )}
                </FieldLabel>
            )}
            <Input
                {...rest}
                value={value}
                type="text"
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

export default TextInput;
