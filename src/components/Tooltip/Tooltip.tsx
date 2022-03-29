import React from 'react';
import ReactTooltip from 'rc-tooltip';
import styled from 'styled-components';
import 'styles/tooltip.css';

type TooltipProps = {
    component?: any;
    overlay: any;
    iconFontSize?: number;
    marginLeft?: number;
};

const Tooltip: React.FC<TooltipProps> = ({ component, overlay, iconFontSize, marginLeft }) => {
    return (
        <Container>
            <ReactTooltip overlay={overlay} placement="top">
                {component ? component : <InfoIcon iconFontSize={iconFontSize} marginLeft={marginLeft} />}
            </ReactTooltip>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    width: fit-content;
`;

const InfoIcon = styled.i<{ iconFontSize?: number; marginLeft?: number }>`
    font-size: ${(props) => props.iconFontSize || 15}px;
    font-weight: normal;
    cursor: pointer;
    position: relative;
    margin-left: ${(props) => props.marginLeft || 2}px;
    top: -1px;
    &:before {
        font-family: Thales !important;
        content: '\\0043';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default Tooltip;
