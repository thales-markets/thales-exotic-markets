import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/rootReducer';
import { getNetworkId } from 'redux/modules/wallet';
import { FlexDivCentered } from 'styles/common';
import { useTranslation } from 'react-i18next';
import { getIsAppReady } from 'redux/modules/app';
import { DEFAULT_CURRENCY_DECIMALS, PAYMENT_CURRENCY } from 'constants/currency';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import Button from 'components/Button';
import useGetUsdDefaultAmountQuery from 'queries/wallet/useGetUsdDefaultAmountQuery';
import { toast } from 'react-toastify';
import { getSuccessToastOptions, getErrorToastOptions } from 'config/toast';
import networkConnector from 'utils/networkConnector';

const GetUsd: React.FC = () => {
    const { t } = useTranslation();
    const networkId = useSelector((state: RootState) => getNetworkId(state));
    const isAppReady = useSelector((state: RootState) => getIsAppReady(state));
    const [getUsdDefaultAmount, setGetUsdDefaultAmount] = useState<number | string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const getUsdDefaultAmountQuery = useGetUsdDefaultAmountQuery(networkId, {
        enabled: isAppReady,
    });

    useEffect(() => {
        if (getUsdDefaultAmountQuery.isSuccess) {
            setGetUsdDefaultAmount(Number(getUsdDefaultAmountQuery.data));
        }
    }, [getUsdDefaultAmountQuery.isSuccess, getUsdDefaultAmountQuery.data]);

    const formattedAmount = formatCurrencyWithKey(
        PAYMENT_CURRENCY,
        getUsdDefaultAmount,
        DEFAULT_CURRENCY_DECIMALS,
        true
    );

    const handleGet = async () => {
        const { exoticUsdContract, signer } = networkConnector;
        if (exoticUsdContract && signer) {
            const id = toast.loading(t('market.toast-messsage.transaction-pending'));
            setIsSubmitting(true);

            try {
                const exoticUsdContractWithSigner = exoticUsdContract.connect(signer);

                const tx = await exoticUsdContractWithSigner.mintForUser();
                const txResult = await tx.wait();

                if (txResult && txResult.transactionHash) {
                    toast.update(
                        id,
                        getSuccessToastOptions(t('market.toast-messsage.get-usd-success', { amount: formattedAmount }))
                    );
                    setIsSubmitting(false);
                }
            } catch (e) {
                console.log(e);
                toast.update(id, getErrorToastOptions(t('common.errors.unknown-error-try-again')));
                setIsSubmitting(false);
            }
        }
    };

    return (
        <Container>
            <Button type="secondary" onClick={handleGet} disabled={isSubmitting}>
                {isSubmitting
                    ? t('common.wallet.get-usd-progress', {
                          amount: formattedAmount,
                      })
                    : t('common.wallet.get-usd', {
                          amount: formattedAmount,
                      })}
            </Button>
        </Container>
    );
};

const Container = styled(FlexDivCentered)`
    position: relative;
    height: 28px;
    @media (max-width: 767px) {
        margin-bottom: 10px;
    }
    button {
        font-size: 18px;
        padding: 0 20px;
    }
`;

export default GetUsd;
