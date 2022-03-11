import Button from 'components/Button';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAppReady } from 'redux/modules/app';
import { RootState } from 'redux/rootReducer';
import styled from 'styled-components';
import { FlexDivCentered, FlexDivColumn, FlexDivRow, FlexDivRowCentered, FlexDivEnd } from 'styles/common';
import MarketStatus from 'pages/Markets/components/MarketStatus';
import MarketTitle from 'pages/Markets/components/MarketTitle';
import OpenDisputeButton from 'pages/Markets/components/OpenDisputeButton';
import Tags from 'pages/Markets/components/Tags';
import { MarketDetails as MarketData } from 'types/markets';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { PAYMENT_CURRENCY, DEFAULT_CURRENCY_DECIMALS } from 'constants/currency';
import SPAAnchor from 'components/SPAAnchor';
import { buildOpenDisputeLink } from 'utils/routes';
import { getIsWalletConnected, getNetworkId, getWalletAddress } from 'redux/modules/wallet';
import { checkAllowance } from 'utils/network';
import { BigNumber, ethers } from 'ethers';
import networkConnector from 'utils/networkConnector';
import { MAX_GAS_LIMIT } from 'constants/network';
import ApprovalModal from 'components/ApprovalModal';
import ValidationMessage from 'components/ValidationMessage';
import marketContract from 'utils/contracts/exoticPositionalMarketContract';
import useThalesBalanceQuery from 'queries/wallet/useThalesBalanceQuery';
import onboardConnector from 'utils/onboardConnector';
import RadioButton from 'components/fields/RadioButton';

type MarketDetailsProps = {
    market: MarketData;
};

const MarketDetails: React.FC<MarketDetailsProps> = ({ market }) => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const walletAddress = useSelector((state: RootState) => getWalletAddress(state)) || '';
    const isWalletConnected = useSelector((state: RootState) => getIsWalletConnected(state));
    const [hasAllowance, setAllowance] = useState<boolean>(false);
    const [isAllowing, setIsAllowing] = useState<boolean>(false);
    const [txErrorMessage, setTxErrorMessage] = useState<string | null>(null);
    const [isBuying, setIsBuying] = useState<boolean>(false);
    const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);
    const [openApprovalModal, setOpenApprovalModal] = useState<boolean>(false);
    const [thalesBalance, setThalesBalance] = useState<number | string>('');
    const [currentPositionOnContract, setCurrentPositionOnContract] = useState<number>(market.position);
    const [selectedPosition, setSelectedPosition] = useState<number>(market.position);

    const thalesBalanceQuery = useThalesBalanceQuery(walletAddress, networkId, {
        enabled: isAppReady && isWalletConnected,
    });

    useEffect(() => {
        if (thalesBalanceQuery.isSuccess && thalesBalanceQuery.data) {
            setThalesBalance(thalesBalanceQuery.data);
        }
    }, [thalesBalanceQuery.isSuccess, thalesBalanceQuery.data]);

    const showTicketBuy = market.isOpen && market.isTicketType && !market.hasPosition;
    const showTicketWithdraw = market.isOpen && market.isTicketType && market.isWithdrawalAllowed && market.hasPosition;
    const showTicketInfo = market.isOpen && market.isTicketType;

    const insufficientBalance = Number(thalesBalance) < Number(market.ticketPrice) || Number(thalesBalance) === 0;
    const isPositionSelected = selectedPosition > 0;

    const isBuyButtonDisabled =
        isBuying || isWithdrawing || !isWalletConnected || !hasAllowance || insufficientBalance || !isPositionSelected;
    const isWithdrawButtonDisabled = isBuying || isWithdrawing || !isWalletConnected;

    useEffect(() => {
        const { paymentTokenContract, signer } = networkConnector;
        if (paymentTokenContract && signer) {
            const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
            const addressToApprove = market.address;
            const getAllowance = async () => {
                try {
                    const parsedTicketPrice = ethers.utils.parseEther(Number(market.ticketPrice).toString());
                    const allowance = await checkAllowance(
                        parsedTicketPrice,
                        paymentTokenContractWithSigner,
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
    }, [walletAddress, isWalletConnected, hasAllowance, market.ticketPrice, isAllowing]);

    const handleAllowance = async (approveAmount: BigNumber) => {
        const { paymentTokenContract, signer } = networkConnector;
        if (paymentTokenContract && signer) {
            const paymentTokenContractWithSigner = paymentTokenContract.connect(signer);
            const addressToApprove = market.address;
            try {
                setIsAllowing(true);
                const tx = (await paymentTokenContractWithSigner.approve(addressToApprove, approveAmount, {
                    gasLimit: MAX_GAS_LIMIT,
                })) as ethers.ContractTransaction;
                setOpenApprovalModal(false);
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

    const handleBuy = async () => {
        const { signer } = networkConnector;
        if (signer) {
            setTxErrorMessage(null);
            setIsBuying(true);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const tx = await marketContractWithSigner.takeAPosition(selectedPosition);
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    // dispatchMarketNotification(t('migration.migrate-button.confirmation-message'));
                    setIsBuying(false);
                    setCurrentPositionOnContract(selectedPosition);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsBuying(false);
            }
        }
    };

    const handleWithdraw = async () => {
        const { signer } = networkConnector;
        if (signer) {
            setTxErrorMessage(null);
            setIsWithdrawing(true);

            try {
                const marketContractWithSigner = new ethers.Contract(market.address, marketContract.abi, signer);

                const tx = await marketContractWithSigner.withdraw();
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    // dispatchMarketNotification(t('migration.migrate-button.confirmation-message'));
                    setIsWithdrawing(false);
                    setSelectedPosition(0);
                }
            } catch (e) {
                console.log(e);
                setTxErrorMessage(t('common.errors.unknown-error-try-again'));
                setIsWithdrawing(false);
            }
        }
    };

    const getButtons = () => {
        if (!isWalletConnected) {
            return (
                <MarketButton type="secondary" onClick={() => onboardConnector.connectWallet()}>
                    {t('common.wallet.connect-your-wallet')}
                </MarketButton>
            );
        }
        if (insufficientBalance) {
            return (
                <MarketButton type="secondary" disabled={true}>
                    {t(`common.errors.insufficient-balance`)}
                </MarketButton>
            );
        }
        if (!isPositionSelected) {
            return (
                <MarketButton type="secondary" disabled={true}>
                    {t(`common.errors.select-position`)}
                </MarketButton>
            );
        }
        if (!hasAllowance) {
            return (
                <MarketButton type="secondary" disabled={isAllowing} onClick={() => setOpenApprovalModal(true)}>
                    {!isAllowing
                        ? t('common.enable-wallet-access.approve-label', { currencyKey: PAYMENT_CURRENCY })
                        : t('common.enable-wallet-access.approve-progress-label', {
                              currencyKey: PAYMENT_CURRENCY,
                          })}
                </MarketButton>
            );
        }

        if (showTicketBuy) {
            return (
                <MarketButton type="secondary" disabled={isBuyButtonDisabled} onClick={handleBuy}>
                    {!isBuying ? t('market.button.buy-label') : t('market.button.buy-progress-label')}
                </MarketButton>
            );
        }
        return (
            <>
                {currentPositionOnContract !== selectedPosition && (
                    <MarketButton type="secondary" disabled={isBuyButtonDisabled} onClick={handleBuy}>
                        {!isBuying
                            ? t('market.button.change-position-label')
                            : t('market.button.change-position-progress-label')}
                    </MarketButton>
                )}
                {showTicketWithdraw && (
                    <MarketButton type="secondary" disabled={isWithdrawButtonDisabled} onClick={handleWithdraw}>
                        {!isWithdrawing
                            ? t('market.button.withdraw-label')
                            : t('market.button.withdraw-progress-label')}
                    </MarketButton>
                )}
            </>
        );
    };

    return (
        <MarketContainer>
            <MarketTitle fontSize={40}>{market.question}</MarketTitle>
            <Positions>
                {market.isOpen ? (
                    market.positions.map((position: string, index: number) => (
                        <Position key={position}>
                            <RadioButton
                                checked={index + 1 === selectedPosition}
                                value={index + 1}
                                onChange={() => setSelectedPosition(index + 1)}
                                label={position}
                            />
                            <Info>
                                <InfoLabel>{t('market.pool-size-label')}:</InfoLabel>
                                <InfoContent>
                                    {formatCurrencyWithKey(
                                        PAYMENT_CURRENCY,
                                        market.poolSizePerPosition[index],
                                        DEFAULT_CURRENCY_DECIMALS,
                                        true
                                    )}
                                </InfoContent>
                            </Info>
                            {/* <Info>
                                            <InfoLabel>{t('market.roi-label')}:</InfoLabel>
                                            <InfoContent>{formatPercentage(TEMP_ROI)}</InfoContent>
                                        </Info> */}
                        </Position>
                    ))
                ) : (
                    <Position>
                        <MainInfo>{market.positions[0]}</MainInfo>{' '}
                        {/* <Info>
                                        <InfoLabel>{t('market.pool-size-label')}:</InfoLabel>
                                        <InfoContent>
                                            {formatCurrencyWithKey(
                                                PAYMENT_CURRENCY,
                                                TEMP_POOL_SIZE,
                                                DEFAULT_CURRENCY_DECIMALS,
                                                true
                                            )}
                                        </InfoContent>
                                    </Info>
                                    <Info>
                                        <InfoLabel>{t('market.roi-label')}:</InfoLabel>
                                        <InfoContent>{formatPercentage(TEMP_ROI)}</InfoContent>
                                    </Info> */}
                    </Position>
                )}
            </Positions>
            {showTicketInfo && (
                <MainInfo>
                    {t('market.ticket-price-label')}{' '}
                    {formatCurrencyWithKey(PAYMENT_CURRENCY, market.ticketPrice, DEFAULT_CURRENCY_DECIMALS, true)}
                </MainInfo>
            )}
            {/* {market.isClaimAvailable && (
                            <MainInfo>
                                {t('market.claim-winnings-label')}{' '}
                                {formatCurrencyWithKey(PAYMENT_CURRENCY, TEMP_CLAIM_WINNINGS)}
                            </MainInfo>
                        )}
                        {market.isOpen && (
                            <Info fontSize={20}>
                                <InfoLabel>{t('market.return-label')}:</InfoLabel>
                                <InfoContent>
                                    {formatCurrencyWithKey(
                                        PAYMENT_CURRENCY,
                                        TEMP_MAX_RETURN,
                                        DEFAULT_CURRENCY_DECIMALS,
                                        true
                                    )}
                                </InfoContent>
                            </Info>
                        )} */}
            <ButtonContainer>
                {getButtons()}
                {market.isClaimAvailable && <ClaimButton>{t('market.button.claim-label')}</ClaimButton>}
                <ValidationMessage
                    showValidation={txErrorMessage !== null}
                    message={txErrorMessage}
                    onDismiss={() => setTxErrorMessage(null)}
                />
            </ButtonContainer>
            {market.isOpen && <MarketStatus market={market} fontSize={40} labelFontSize={20} fontWeight={700} />}
            <Footer>
                <Tags tags={market.tags} labelFontSize={20} />
                <Info fontSize={20}>
                    <InfoLabel>{t('market.total-pool-size-label')}:</InfoLabel>
                    <InfoContent>
                        {formatCurrencyWithKey(PAYMENT_CURRENCY, market.poolSize, DEFAULT_CURRENCY_DECIMALS, true)}
                    </InfoContent>
                </Info>
                <FooterButtonsContainer>
                    <SPAAnchor href={buildOpenDisputeLink(market.address)}>
                        <OpenDisputeButton numberOfOpenedDisputes={0}>
                            {t('market.button.open-dispute-label')}
                        </OpenDisputeButton>
                    </SPAAnchor>
                </FooterButtonsContainer>
            </Footer>
            {openApprovalModal && (
                <ApprovalModal
                    defaultAmount={market.ticketPrice}
                    tokenSymbol={PAYMENT_CURRENCY}
                    isAllowing={isAllowing}
                    onSubmit={handleAllowance}
                    onClose={() => setOpenApprovalModal(false)}
                />
            )}
        </MarketContainer>
    );
};

const MarketContainer = styled(FlexDivColumn)`
    margin-top: 40px;
    box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.35);
    border-radius: 25px;
    width: 100%;
    padding: 40px 40px 30px 40px;
    background: ${(props) => props.theme.background.secondary};
    flex: initial;
`;

const Positions = styled(FlexDivRowCentered)`
    margin-top: 0px;
    margin-bottom: 20px;
    flex-wrap: wrap;
`;

const Position = styled(FlexDivColumn)<{ fontSize?: number }>`
    margin-bottom: 20px;
`;

const Info = styled(FlexDivCentered)<{ fontSize?: number }>`
    font-style: normal;
    font-weight: 300;
    font-size: ${(props) => props.fontSize || 25}px;
    line-height: 100%;
    color: ${(props) => props.theme.textColor.primary};
    white-space: nowrap;
`;

const InfoLabel = styled.span`
    margin-right: 6px;
`;

const InfoContent = styled.span`
    font-weight: 700;
`;

const MainInfo = styled.span`
    font-style: normal;
    font-weight: bold;
    font-size: 40px;
    line-height: 55px;
    text-align: center;
    color: ${(props) => props.theme.textColor.primary};
`;

const ButtonContainer = styled(FlexDivColumn)`
    margin-top: 40px;
    margin-bottom: 40px;
    align-items: center;
`;

const MarketButton = styled(Button)`
    height: 32px;
    font-size: 22px;
    padding-top: 2px;
    :not(button:last-of-type) {
        margin-bottom: 10px;
    }
`;

const ClaimButton = styled(MarketButton)`
    margin-top: 15px;
    margin-bottom: 20px;
`;

const Footer = styled(FlexDivRow)`
    margin-top: 10px;
    > div {
        width: 33%;
    }
    @media (max-width: 767px) {
        > div {
            width: 100%;
            margin-top: 10px;
            justify-content: center;
        }
        flex-direction: column;
    }
`;

const FooterButtonsContainer = styled(FlexDivEnd)`
    align-items: center;
    @media (max-width: 767px) {
        justify-content: center;
    }
`;

export default MarketDetails;