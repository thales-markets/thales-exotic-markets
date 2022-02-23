import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivStart } from 'styles/common';

type SearchProps = {
    text: string;
    handleChange: (event: any) => void;
};

const Search: React.FC<SearchProps> = ({ text, handleChange }) => {
    const { t } = useTranslation();

    return (
        <Wrapper>
            <Input
                type="text"
                placeholder={t('market.search-placeholder')}
                defaultValue={text}
                onChange={(event) => handleChange(event.target.value)}
            />
            <IconWrapper>
                <Icon />
            </IconWrapper>
        </Wrapper>
    );
};

const Wrapper = styled(FlexDivStart)`
    position: relative;
    width: fit-content;
`;

const Input = styled.input`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    background: transparent;
    border-radius: 30px;
    color: ${(props) => props.theme.textColor.primary};
    width: 230px;
    height: 28px;
    padding-left: 30px;
    padding-right: 10px;
    font-size: 18px;
    outline: none;
`;

const IconWrapper = styled.div`
    border-radius: 30px;
    background: ${(props) => props.theme.button.background.secondary};
    position: absolute;
    width: 22px;
    height: 22px;
    top: 3px;
    left: 3px;
`;

const Icon = styled.i`
    font-size: 19px;
    position: absolute;
    left: 2px;
    &:before {
        font-family: SidebarIcons !important;
        content: '\\0066';
        color: ${(props) => props.theme.button.textColor.primary};
    }
`;

export default Search;
