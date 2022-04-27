import SimpleLoader from 'components/SimpleLoader';
import useDisputesQuery from 'queries/markets/useDisputesQuery';
import useOracleCouncilMemberQuery from 'queries/oracleCouncil/useOracleCouncilMemberQuery';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import { Disputes as DisputeList, DisputeInfo } from 'types/markets';
import DisputeCard from '../DisputeCard';

type DisputesProps = {
    marketAddress: string;
    positions: string[];
    winningPosition: number;
};

const Disputes: React.FC<DisputesProps> = ({ marketAddress, positions, winningPosition }) => {
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [isOracleCouncilMember, setIsOracleCouncilMember] = useState<boolean>(false);
    const [disputes, setDisputes] = useState<DisputeList>([]);

    const disputesQuery = useDisputesQuery(marketAddress, networkId, { enabled: isAppReady });

    useEffect(() => {
        if (disputesQuery.isSuccess && disputesQuery.data) {
            setDisputes(disputesQuery.data);
        }
    }, [disputesQuery.isSuccess, disputesQuery.data]);

    const oracleCouncilMemberQuery = useOracleCouncilMemberQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (oracleCouncilMemberQuery.isSuccess && oracleCouncilMemberQuery.data !== undefined) {
            setIsOracleCouncilMember(oracleCouncilMemberQuery.data);
        }
    }, [oracleCouncilMemberQuery.isSuccess, oracleCouncilMemberQuery.data]);

    return (
        <Container>
            {disputesQuery.isLoading ? (
                <LoaderContainer>
                    <SimpleLoader />
                </LoaderContainer>
            ) : (
                disputes.map((dispute: DisputeInfo) => (
                    <DisputeCard
                        key={dispute.id}
                        disputeInfo={dispute}
                        isOracleCouncilMember={isOracleCouncilMember}
                        positions={positions}
                        winningPosition={winningPosition}
                    >
                        {dispute}
                    </DisputeCard>
                ))
            )}
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 40px;
    width: 100%;
`;

const LoaderContainer = styled(FlexDivColumn)`
    position: relative;
    min-height: 300px;
`;

export default Disputes;
