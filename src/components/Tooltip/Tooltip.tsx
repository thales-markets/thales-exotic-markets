import React from 'react';
import ReactTooltip from 'rc-tooltip';
import styled from 'styled-components';
import 'styles/tooltip.css';

type TooltipProps = {
    component?: any;
    overlay: any;
};

const Tooltip: React.FC<TooltipProps> = ({ component, overlay }) => {
    return (
        <Container>
            <ReactTooltip overlay={overlay} placement="top">
                {component ? component : <InfoIcon />}
            </ReactTooltip>
        </Container>
    );
};

const Container = styled.div`
    position: relative;
    width: fit-content;
`;

const InfoIcon = styled.i`
    font-size: 15px;
    cursor: pointer;
    position: relative;
    margin: 0px 2px;
    top: -1px;
    &:before {
        font-family: Thales !important;
        content: '\\0043';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default Tooltip;
