import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FieldContainer } from '../common';

type DatetimePickerProps = ReactDatePickerProps;

export const DatetimePicker: React.FC<DatetimePickerProps> = ({ ...rest }) => {
    const { t } = useTranslation();

    return (
        <FieldContainer style={{ width: 'fit-content' }}>
            <ReactDatePicker
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText={t('common.select-date')}
                autoComplete="off"
                {...rest}
            />
        </FieldContainer>
    );
};

export default DatetimePicker;
