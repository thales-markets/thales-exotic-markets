import React from 'react';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { Disputes as DisputeList, DisputeInfo } from 'types/markets';
import DisputeCard from '../DisputeCard';

type DisputesProps = {
    disputes: DisputeList;
};

const Disputes: React.FC<DisputesProps> = ({ disputes }) => {
    return (
        <Container>
            {disputes.map((dispute: DisputeInfo, index: number) => (
                <DisputeCard key={`${dispute.address}${index}`} dispute={dispute}>
                    {dispute}
                </DisputeCard>
            ))}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 40px;
`;

export default Disputes;
