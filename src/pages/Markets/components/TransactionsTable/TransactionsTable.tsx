import React, { FC, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CellProps } from 'react-table';
import { formatCurrencyWithKey } from 'utils/formatters/number';
import { formatTxTimestamp } from 'utils/formatters/date';
import Table from 'components/Table';
import ViewEtherscanLink from 'components/ViewEtherscanLink';
import { MarketTransaction, MarketTransactions } from 'types/markets';
import { PAYMENT_CURRENCY } from 'constants/currency';
import styled from 'styled-components';
import { FlexDivColumn } from 'styles/common';
import Tooltip from 'components/Tooltip';

type TransactionsTableProps = {
    transactions: MarketTransactions;
    noResultsMessage?: React.ReactNode;
    isLoading: boolean;
};

export const TransactionsTable: FC<TransactionsTableProps> = memo(({ transactions, noResultsMessage, isLoading }) => {
    const { t } = useTranslation();
    return (
        <>
            <Table
                columns={[
                    {
                        Header: <>{t('market.table.date-time-col')}</>,
                        accessor: 'timestamp',
                        Cell: (cellProps: CellProps<MarketTransaction, MarketTransaction['timestamp']>) => (
                            <CellContent>{formatTxTimestamp(cellProps.cell.value)}</CellContent>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('market.table.type-col')}</>,
                        accessor: 'type',
                        Cell: (cellProps: CellProps<MarketTransaction, MarketTransaction['type']>) => (
                            <CellContent>{t(`market.table.type.${cellProps.cell.value}`)}</CellContent>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('market.table.position-col')}</>,
                        accessor: 'position',
                        Cell: (cellProps: CellProps<MarketTransaction, MarketTransaction['position']>) => (
                            <CellContent>{cellProps.cell.value}</CellContent>
                        ),
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('market.table.amount-col')}</>,
                        sortType: 'basic',
                        accessor: 'amount',
                        Cell: (cellProps: CellProps<MarketTransaction, MarketTransaction['amount']>) => {
                            return !cellProps.cell.row.original.isTicketType &&
                                (cellProps.cell.row.original.type === 'bid' ||
                                    cellProps.cell.row.original.type === 'updatePositions') ? (
                                <Tooltip
                                    component={
                                        <CellContent>
                                            {Number(cellProps.cell.value) > 0
                                                ? formatCurrencyWithKey(PAYMENT_CURRENCY, cellProps.cell.value)
                                                : '-'}
                                        </CellContent>
                                    }
                                    overlay={
                                        <PositionOverlayContainer>
                                            <div>{t('market.table.position-col-tooltip-title')}:</div>
                                            {cellProps.cell.row.original.positionLabels.map(
                                                (position: string, index: number) => {
                                                    if (cellProps.cell.row.original.positions[index] === 0) return;
                                                    return (
                                                        <span key={`position${index}`}>
                                                            -{' '}
                                                            {formatCurrencyWithKey(
                                                                PAYMENT_CURRENCY,
                                                                cellProps.cell.row.original.positions[index]
                                                            )}{' '}
                                                            on {position}
                                                        </span>
                                                    );
                                                }
                                            )}
                                        </PositionOverlayContainer>
                                    }
                                />
                            ) : (
                                <CellContent>
                                    {Number(cellProps.cell.value) > 0
                                        ? formatCurrencyWithKey(PAYMENT_CURRENCY, cellProps.cell.value)
                                        : '-'}
                                </CellContent>
                            );
                        },
                        width: 150,
                        sortable: true,
                    },
                    {
                        Header: <>{t('market.table.tx-status-col')}</>,
                        accessor: 'hash',
                        Cell: (cellProps: CellProps<MarketTransaction, MarketTransaction['hash']>) => (
                            <ViewEtherscanLink hash={cellProps.cell.value} />
                        ),
                        width: 150,
                    },
                ]}
                data={transactions}
                isLoading={isLoading}
                noResultsMessage={noResultsMessage}
            />
        </>
    );
});

const CellContent = styled.span`
    padding: 4px 0;
`;

const PositionOverlayContainer = styled(FlexDivColumn)`
    text-align: start;
    div {
        margin-bottom: 5px;
    }
`;

export default TransactionsTable;
