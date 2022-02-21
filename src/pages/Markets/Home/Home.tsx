import React from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';

const Home: React.FC = () => {
    return (
        <ContentContainer>
            <Content>Thales: Exotic Positional Markets</Content>
            <Content>Coming soon...</Content>
        </ContentContainer>
    );
};

const ContentContainer = styled(FlexDivColumnCentered)`
    jusify-content: space-between;
    align-items: center;
    margin-bottom: 80px;
`;

const Content = styled.div`
    font-style: normal;
    font-weight: bold;
    font-size: 44px;
    line-height: 130%;
    color: ${(props) => props.theme.textColor};
`;

export default Home;
