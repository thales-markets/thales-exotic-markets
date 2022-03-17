import React from 'react';
import styled from 'styled-components';
import { FlexDivCentered } from 'styles/common';

type WarningMessageProps = {
    message: string;
};

export const WarningMessage: React.FC<WarningMessageProps> = ({ message }) => {
    return <Container>{message}</Container>;
};

const Container = styled(FlexDivCentered)`
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 0.5px;
    color: #ffcc00;
    margin-top: 15px;
`;

export default WarningMessage;
