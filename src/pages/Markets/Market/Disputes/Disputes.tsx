import useDisputesQuery from 'queries/markets/useDisputesQuery';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getNetworkId } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { Disputes as DisputeList, DisputeInfo } from 'types/markets';
import DisputeCard from '../DisputeCard';

type DisputesProps = {
    marketAddress: string;
};

const Disputes: React.FC<DisputesProps> = ({ marketAddress }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    // const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    // const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));

    const disputesQuery = useDisputesQuery(marketAddress, networkId, { enabled: isAppReady });

    const disputes: DisputeList = useMemo(() => {
        if (disputesQuery.isSuccess && disputesQuery.data) {
            return disputesQuery.data as DisputeList;
        }
        return [];
    }, [disputesQuery.isSuccess, disputesQuery.data]);

    return (
        <Container>
            {disputes.map((dispute: DisputeInfo) => (
                <DisputeCard key={dispute.id} dispute={dispute}>
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
