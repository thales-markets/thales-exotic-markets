import DatetimePicker from 'components/fields/DatetimePicker';
import TextInput from 'components/fields/TextInput';
import TextAreaInput from 'components/fields/TextAreaInput';
import Toggle from 'components/fields/Toggle';
import {
    DEFAULT_POSITIONING_DURATION,
    MarketType,
    MAXIMUM_INPUT_CHARACTERS,
    MAXIMUM_TAGS,
    TagFilterEnum,
} from 'constants/markets';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow } from 'styles/common';
import { Tag } from 'react-tag-autocomplete';
import TagsInput from 'components/fields/TagsInput';
import Header from './Header';
import Description from './Description';
import { convertLocalToUTCDate, convertUTCToLocalDate, setDateTimeToUtcNoon } from 'utils/formatters/date';
import Positions from 'components/fields/Positions/Positions';
import Button from 'components/Button';
import useMarketsParametersQuery from 'queries/markets/useMarketsParametersQuery';
import { useSelector } from 'react-redux';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import { MarketsParameters } from 'types/markets';
import { checkAllowance } from 'utils/network';
import networkConnector from 'utils/networkConnector';
import { BigNumber, ethers } from 'ethers';
import { MAX_GAS_LIMIT } from 'constants/network';
import onboardConnector from 'utils/onboardConnector';
import { CURRENCY_MAP } from 'constants/currency';

const CreateMarket: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [question, setQuestion] = useState<string>('');
    const [dataSource, setDataSource] = useState<string>('');
    const [marketType, setMarketType] = useState<MarketType>(MarketType.TICKET);
    const [isWithdrawEnabled, setIsWithdrawEnabled] = useState<boolean>(true);
    const [positions, setPositions] = useState<string[]>(new Array(2).fill(''));
    const [positioningEndDateTime, setPositioningEndDateTime] = useState<Date>(
        setDateTimeToUtcNoon(new Date(new Date().getTime() + DEFAULT_POSITIONING_DURATION))
    );
    const [tags, setTags] = useState<Tag[]>([]);
    const [suggestions, setSuggestions] = useState<Tag[]>(
        Object.values(TagFilterEnum).map((filterItem, index) => ({
            id: index + 1,
            name: t(`market.filter-label.tag.${filterItem.toLowerCase()}`),
            disabled: false,
        }))
    );

    const marketsParametersQuery = useMarketsParametersQuery(networkId, {
        enabled: isAppReady,
    });

    const marketsParameters: MarketsParameters | undefined = useMemo(() => {
        if (marketsParametersQuery.isSuccess && marketsParametersQuery.data) {
            return marketsParametersQuery.data as MarketsParameters;
        }
        return undefined;
    }, [marketsParametersQuery.isSuccess, marketsParametersQuery.data]);

    const fixedBondAmount = marketsParameters ? marketsParameters.fixedBondAmount : 0;
    const isButtonDisabled =
        isSubmitting || !isWalletConnected || /*!isAmountEntered || insufficientBalance || */ !hasAllowance;

    useEffect(() => {
        const { thalesTokenContract, thalesBondsContract, signer } = networkConnector;
        if (thalesTokenContract && thalesBondsContract && signer) {
            const thalesTokenContractWithSigner = thalesTokenContract.connect(signer);
            const addressToApprove = thalesBondsContract.address;
            const getAllowance = async () => {
                try {
                    const parsedStakeAmount = ethers.utils.parseEther(Number(fixedBondAmount).toString());
                    const allowance = await checkAllowance(
                        parsedStakeAmount,
                        thalesTokenContractWithSigner,
                        walletAddress,
                        addressToApprove
                    );
                    setAllowance(allowance);
                } catch (e) {
                    console.log(e);
                }
            };
            if (isWalletConnected) {
                getAllowance();
            }
        }
    }, [walletAddress, isWalletConnected, hasAllowance, fixedBondAmount, isAllowing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { thalesTokenContract, thalesBondsContract, signer } = networkConnector;
        if (thalesTokenContract && thalesBondsContract && signer) {
            const thalesTokenContractWithSigner = thalesTokenContract.connect(signer);
            const addressToApprove = thalesBondsContract.address;
            try {
                setIsAllowing(true);
                const tx = (await thalesTokenContractWithSigner.approve(addressToApprove, approveAmount, {
                    gasLimit: MAX_GAS_LIMIT,
                })) as ethers.ContractTransaction;
                // setOpenApprovalModal(false);
                const txResult = await tx.wait();
                if (txResult && txResult.transactionHash) {
                    setIsAllowing(false);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsAllowing(false);
            }
        }
    };

    const handleSubmit = async () => {
        const { marketManagerContract, signer } = networkConnector;
        if (marketManagerContract && signer) {
            setTxErrorMessage(null);
            setIsSubmitting(true);

            try {
                const marketManagerContractWithSigner = marketManagerContract.connect(signer);

                const formattedPositioningEnd = Math.round((positioningEndDateTime as Date).getTime() / 1000);
                const parsedTicketPrice = ethers.utils.parseEther('30');
                const formmatedTags: BigNumber[] = [];

                const tx = await marketManagerContractWithSigner.createExoticMarket(
                    question,
                    dataSource,
                    formattedPositioningEnd,
                    parsedTicketPrice,
                    isWithdrawEnabled,
                    formmatedTags,
                    positions.length,
                    positions
                );
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    // dispatchMarketNotification(t('migration.migrate-button.confirmation-message'));
                    setIsSubmitting(false);
                    // setAmount('');
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsSubmitting(false);
            }
        }
    };

    const getSubmitButton = () => {
        if (!isWalletConnected) {
            return (
                <CreateMarketButton onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </CreateMarketButton>
            );
        }
        // if (insufficientBalance) {
        //     return <CreateMarketButton disabled={true}>{t(`common.errors.insufficient-balance`)}</CreateMarketButton>;
        // }
        // if (!isAmountEntered) {
        //     return <CreateMarketButton disabled={true}>{t(`common.errors.enter-amount`)}</CreateMarketButton>;
        // }
        if (!hasAllowance) {
            return (
                <CreateMarketButton
                    disabled={isAllowing}
                    onClick={() => {
                        handleAllowance(ethers.constants.MaxUint256);
                        // setOpenApprovalModal(true);
                    }}
                >
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: CURRENCY_MAP.THALES })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: CURRENCY_MAP.THALES,
                          })}
                </CreateMarketButton>
            );
        }
        return (
            <CreateMarketButton disabled={isButtonDisabled} onClick={handleSubmit}>
                {!isSubmitting
                    ? t('market.create-market.button.create-market-label')
                    : t('market.create-market.button.create-market-progress-label')}
            </CreateMarketButton>
        );
    };

    const addPosition = () => {
        setPositions([...positions, '']);
    };

    const removePosition = (index: number) => {
        const newPostions = [...positions];
        newPostions.splice(index, 1);
        setPositions(newPostions);
    };

    const setPositionText = (index: number, text: string) => {
        const newPostions = [...positions];
        newPostions[index] = text;
        setPositions(newPostions);
    };

    const addTag = (tag: Tag) => {
        const tagIndex = tags.findIndex((tagItem: Tag) => tag.id === tagItem.id);
        if (tagIndex === -1 && tags.length < MAXIMUM_TAGS) {
            const suggestionsTagIndex = suggestions.findIndex((tagItem: Tag) => tag.id === tagItem.id);
            const newSuggestions = [...suggestions];
            newSuggestions[suggestionsTagIndex].disabled = true;
            setSuggestions(suggestions);

            setTags([...tags, tag]);
        }
    };

    const removeTag = (index: number) => {
        const tagId = tags[index].id;
        const tagIndex = suggestions.findIndex((tagItem: Tag) => tagId === tagItem.id);
        const newSuggestions = [...suggestions];
        newSuggestions[tagIndex].disabled = false;
        setSuggestions(suggestions);

        const newTags = [...tags];
        newTags.splice(index, 1);
        setTags(newTags);
    };

    return (
        <Container>
            <Header />
            <ContentWrapper>
                <Form>
                    <TextAreaInput
                        value={question}
                        onChange={setQuestion}
                        label={t('market.create-market.question-label')}
                        note={t('common.max-input-characters-note', { max: MAXIMUM_INPUT_CHARACTERS })}
                    />
                    <TextInput
                        value={dataSource}
                        onChange={setDataSource}
                        label={t('market.create-market.data-source-label')}
                        note={t('common.max-input-characters-note', { max: MAXIMUM_INPUT_CHARACTERS })}
                    />
                    <Positions
                        positions={positions}
                        onPositionAdd={addPosition}
                        onPositionRemove={removePosition}
                        onPositionChange={setPositionText}
                        label={t('market.create-market.positions-label')}
                    />
                    <DatetimePicker
                        selected={convertUTCToLocalDate(positioningEndDateTime)}
                        onChange={(date: Date) => setPositioningEndDateTime(convertLocalToUTCDate(date))}
                        label={t('market.create-market.positioning-end-label')}
                    />
                    <Toggle
                        isLeftOptionSelected={marketType === MarketType.TICKET}
                        onClick={() => {
                            setMarketType(marketType === MarketType.TICKET ? MarketType.OPEN_BID : MarketType.TICKET);
                        }}
                        label={t('market.create-market.type-label')}
                        leftText={t('market.create-market.type-options.ticket')}
                        rightText={t('market.create-market.type-options.open-bid')}
                    />
                    <Toggle
                        isLeftOptionSelected={isWithdrawEnabled}
                        onClick={() => {
                            setIsWithdrawEnabled(!isWithdrawEnabled);
                        }}
                        label={t('market.create-market.withdraw-label')}
                        leftText={t('market.create-market.withdraw-options.enabled')}
                        rightText={t('market.create-market.withdraw-options.disabled')}
                    />
                    <TagsInput
                        tags={tags}
                        suggestions={suggestions}
                        onTagAdd={addTag}
                        onTagRemove={removeTag}
                        label={t('market.create-market.tags-label', { max: MAXIMUM_TAGS })}
                    />
                    <ButtonContainer>{getSubmitButton()}</ButtonContainer>
                    {txErrorMessage && <FlexDivCentered>{txErrorMessage}</FlexDivCentered>}
                </Form>
                <Description />
            </ContentWrapper>
        </Container>
    );
};

const Container = styled(FlexDivColumn)`
    margin-top: 50px;
    align-items: center;
`;

const ContentWrapper = styled(FlexDivRow)`
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

const Form = styled(FlexDivColumn)`
    border: 1px solid ${(props) => props.theme.borderColor.primary};
    border-radius: 25px;
    padding: 20px;
    height: fit-content;
`;

const CreateMarketButton = styled(Button)`
    height: 32px;
`;

const ButtonContainer = styled(FlexDivCentered)`
    margin: 40px 0 30px 0;
`;

export default CreateMarket;
