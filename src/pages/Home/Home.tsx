import React from 'react';
import styled from 'styled-components';
import { FlexDivColumnCentered } from 'styles/common';
import Footer from './Footer';
import Header from './Header';

const Home: React.FC = () => {
    return (
        <>
            <Header />
            <ContentContainer>
                <Content>Thales: Exotic Positional Markets Homepage</Content>
                <Content>Coming soon...</Content>
            </ContentContainer>
            <Footer />
        </>
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
