import { DisputeStatus } from 'constants/markets';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivRow } from 'styles/common';
import { DisputeInfo } from 'types/markets';

type DisputeHeaderProps = {
    disputeInfo: DisputeInfo;
    status?: string;
    onClick: () => void;
    canDisputorClaimbackBondFromUnclosedDispute: boolean;
    disabled: boolean;
};

const DisputeHeader: React.FC<DisputeHeaderProps> = ({
    disputeInfo,
    status,
    onClick,
    canDisputorClaimbackBondFromUnclosedDispute,
    disabled,
}) => {
    const { t } = useTranslation();

    return (
        <Container className={disabled ? 'disabled' : ''} onClick={onClick}>
            <Info>
                {t('market.dispute.disputer-label')}: {disputeInfo.disputer}
            </Info>
            <Info>
                {status
                    ? t(
                          `market.dispute.status.${
                              status === DisputeStatus.Cancelled && canDisputorClaimbackBondFromUnclosedDispute
                                  ? 'cancelled-refund-available'
                                  : status
                          }`
                      )
                    : ''}
            </Info>
            <ArrowDownIcon />
        </Container>
    );
};

const Container = styled(FlexDivRow)`
    border: 2px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 15px;
    font-style: normal;
    font-weight: normal;
    padding: 20px 65px 20px 30px;
    margin-bottom: 20px;
    color: ${(props) => props.theme.textColor.primary};
    position: relative;
    word-wrap: break-word;
    white-space: break-spaces;
    cursor: pointer;
    @media (max-width: 991px) {
        flex-direction: column;
    }
    @media (max-width: 575px) {
        padding: 20px 20px;
    }
    &.disabled {
        opacity: 0.4;
    }
`;

const Info = styled.span`
    font-weight: bold;
    font-size: 18px;
    line-height: 100%;
    @media (max-width: 991px) {
        :first-child {
            margin-bottom: 10px;
        }
    }
`;

const ArrowDownIcon = styled.i`
    font-size: 25px;
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    margin: 24px 30px 0 0;
    &:before {
        font-family: ExoticIcons !important;
        content: '\\004D';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default DisputeHeader;
