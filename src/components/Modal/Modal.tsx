import React from 'react';
import styled from 'styled-components';
import { FlexDiv, FlexDivRow } from 'styles/common';
import ReactModal from 'react-modal';

type ModalProps = {
    title: string;
    onClose: () => void;
};

ReactModal.setAppElement('#root');

export const Modal: React.FC<ModalProps> = ({ title, onClose, children }) => {
    return (
        <ReactModal
            isOpen
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                },
                content: {
                    padding: '0px',
                    maxWidth: '500px',
                    width: '100%',
                    top: 'calc(50% - 250px)',
                    left: 'calc(50% - 250px)',
                    height: 'fit-content',
                    border: 'none',
                    background: 'transparent',
                },
            }}
        >
            <Container>
                <Header>
                    <Title>{title}</Title>
                    <FlexDivRow>{<CloseIcon onClick={onClose} />}</FlexDivRow>
                </Header>
                {children}
            </Container>
        </ReactModal>
    );
};

const Container = styled.div`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    background: ${(props) => props.theme.background.primary};
    padding: 25px 30px 35px 30px;
    overflow: auto;
    border-radius: 23px;
`;

const Header = styled(FlexDivRow)`
    margin-bottom: 20px;
`;

const Title = styled(FlexDiv)`
    font-style: normal;
    font-weight: bold;
    font-size: 25px;
    line-height: 100%;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

const CloseIcon = styled.i`
    font-size: 20px;
    cursor: pointer;
    &:before {
        font-family: Icons !important;
        content: '\\0076';
        color: ${(props) => props.theme.textColor.primary};
    }
`;

export default Modal;
