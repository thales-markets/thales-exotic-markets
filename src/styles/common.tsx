import styled from 'styled-components';

export const FlexDiv = styled.div`
    display: flex;
`;

export const FlexDivCentered = styled(FlexDiv)`
    align-items: center;
    justify-content: center;
`;

export const FlexDivEnd = styled(FlexDiv)`
    justify-content: end;
`;

export const FlexDivStart = styled(FlexDiv)`
    justify-content: start;
`;

export const FlexDivRow = styled(FlexDiv)`
    justify-content: space-between;
`;

export const FlexDivRowCentered = styled(FlexDivRow)`
    align-items: center;
`;

export const FlexDivColumn = styled(FlexDiv)`
    flex: 1;
    flex-direction: column;
`;

export const FlexDivColumnCentered = styled(FlexDivColumn)`
    justify-content: center;
`;

export const Colors = {
    PURPLE: '#6c438a',
    PURPLE_LIGHT: '#c4b3d0',
    PURPLE_DARK: '#3B235F',
    PURPLE_GRADIENT: 'linear-gradient(180deg, #5e2167 1.04%, #7760a8 100%)',
    PINK: '#ce348a',
    PINK_LIGHT: '#F7CAD7',
    PINK_GRADIENT: 'linear-gradient(180deg, #EE5782 0%, #B81B8F 100%)',
    WHITE: '#f6f6fe',
    GREEN: '#28d4b4',
};
