import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn } from 'styles/common';

export const BondInfo = styled(FlexDivColumn)`
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 20px;
    text-align: center;
    text-align: justify;
    max-width: 500px;
    ul {
        list-style: initial;
    }
    li {
        line-height: 16px;
        margin-bottom: 8px;
    }
`;

export const Info = styled(FlexDivCentered)<{ fontSize?: number; marginTop?: number; marginBottom?: number }>`
    font-style: normal;
    font-weight: 300;
    font-size: ${(props) => props.fontSize || 15}px;
    line-height: 120%;
    white-space: nowrap;
    margin-top: ${(props) => props.marginTop || 0}px;
    margin-bottom: ${(props) => props.marginBottom || 0}px;
`;

export const InfoLabel = styled.span`
    margin-right: 4px;
`;

export const InfoContent = styled.span`
    font-weight: 700;
`;

export const MainInfo = styled(Info)`
    font-weight: bold;
    font-size: 20px;
    line-height: 25px;
`;

export const Positions = styled(FlexDivCentered)`
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

export const PositionContainer = styled(FlexDivColumn)`
    margin: 10px;
    cursor: pointer;
    align-items: center;
    color: ${(props) => props.theme.textColor.tertiary};
    border: 1px solid ${(props) => props.theme.borderColor.tertiary};
    padding: 10px 20px;
    border-radius: 15px;
    max-width: 350px;
    min-width: 350px;
    i {
        :before {
            color: ${(props) => props.theme.textColor.tertiary};
        }
    }
    :hover:not(.disabled):not(.maturity) {
        transform: scale(1.05);
    }
    &.disabled {
        opacity: 0.4;
        cursor: default;
    }
    &.selected {
        color: ${(props) => props.theme.textColor.primary};
        background: ${(props) => props.theme.background.secondary};
        border-color: transparent;
        background-origin: border-box;
        i {
            :before {
                color: ${(props) => props.theme.textColor.primary};
            }
        }
        div {
            color: ${(props) => props.theme.textColor.primary};
        }
    }
    &.maturity:not(.disabled) {
        cursor: default;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.3);
    }
    @media (max-width: 575px) {
        max-width: 100%;
        min-width: 100%;
    }
`;

export const PositionOpenBidContainer = styled(PositionContainer)`
    cursor: default;
    :hover:not(.disabled):not(.maturity) {
        transform: none;
    }
    max-width: 250px;
    min-width: 250px;
    border: none;
`;

export const Position = styled.span`
    align-self: center;
    display: block;
    position: relative;
`;

export const PositionLabel = styled.span<{ hasPaddingLeft?: boolean }>`
    font-style: normal;
    font-weight: bold;
    font-size: 21px;
    line-height: 30px;
    text-align: center;
    padding-left: ${(props) => (props.hasPaddingLeft ? 35 : 0)}px;
`;

export const Checkmark = styled.span`
    :after {
        content: '';
        position: absolute;
        left: 10px;
        top: 12px;
        width: 8px;
        height: 22px;
        border: solid ${(props) => props.theme.borderColor.primary};
        border-width: 0 4px 4px 0;
        -webkit-transform: rotate(45deg);
        -ms-transform: rotate(45deg);
        transform: rotate(45deg);
    }
`;
