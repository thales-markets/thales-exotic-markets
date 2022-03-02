import React from 'react';
import { FieldContainer, FieldLabel } from '../common';
import { useTranslation } from 'react-i18next';
import { MAXIMUM_POSITIONS, MINIMUM_POSITIONS } from 'constants/markets';
import Button from 'components/Button';
import PositionInput from './PositionInput';

type PositionsProps = {
    positions: string[];
    label?: string;
    onPositionChange: (index: number, text: string) => void;
    onPositionRemove: (index: number) => void;
    onPositionAdd: () => void;
};

const Positions: React.FC<PositionsProps> = ({
    positions,
    label,
    onPositionChange,
    onPositionRemove,
    onPositionAdd,
}) => {
    const { t } = useTranslation();

    const enableRemovePosition = positions.length > MINIMUM_POSITIONS;
    const enableAddPosition = positions.length < MAXIMUM_POSITIONS;

    return (
        <FieldContainer>
            {label && <FieldLabel>{label}:</FieldLabel>}
            {positions.map((position: string, index: number) => {
                return (
                    <PositionInput
                        key={`position${index}`}
                        value={position}
                        onChange={(text: string) => onPositionChange(index, text)}
                        onRemove={() => onPositionRemove(index)}
                        showRemoveButton={enableRemovePosition}
                    />
                );
            })}
            {enableAddPosition && (
                <Button onClick={onPositionAdd}>{t('market.create-market.add-position-label')}</Button>
            )}
        </FieldContainer>
    );
};

export default Positions;
