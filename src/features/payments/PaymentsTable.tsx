import { DataTable, type DataTableColumn } from "../../components/DataTable";
import { ErrorBox, StatusBadge } from "../../components/components";
import { I18N } from "../../constants/i18n";
import type { Payment } from "../../types/payment";
import { formatAmount, formatPaymentDate } from "./formatters";
import { PaymentsToolbar } from "./PaymentsToolbar";

interface PaymentsTableProps {
  payments: Payment[];
  isLoading?: boolean;
  searchValue?: string;
  validationError?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
  currencyValue?: string;
  onCurrencyChange?: (value: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
  requestError?: string;
}

const paymentColumns: DataTableColumn<Payment>[] = [
  {
    id: "payment-id",
    header: I18N.TABLE_HEADER_PAYMENT_ID,
    cell: (payment) => payment.id,
  },
  {
    id: "date",
    header: I18N.TABLE_HEADER_DATE,
    cell: (payment) => formatPaymentDate(payment.date),
  },
  {
    id: "amount",
    header: I18N.TABLE_HEADER_AMOUNT,
    cell: (payment) => formatAmount(payment.amount),
  },
  {
    id: "customer",
    header: I18N.TABLE_HEADER_CUSTOMER,
    cell: (payment) => payment.customerName || I18N.EMPTY_CUSTOMER,
  },
  {
    id: "currency",
    header: I18N.TABLE_HEADER_CURRENCY,
    cell: (payment) => payment.currency || I18N.EMPTY_CURRENCY,
  },
  {
    id: "status",
    header: I18N.TABLE_HEADER_STATUS,
    cell: (payment) => (
      <StatusBadge $status={payment.status}>{payment.status}</StatusBadge>
    ),
  },
];

export const PaymentsTable = ({
  payments,
  isLoading,
  searchValue,
  validationError,
  onSearchChange,
  onSearch,
  currencyValue,
  onCurrencyChange,
  hasActiveFilters,
  onClearFilters,
  requestError,
}: PaymentsTableProps) => {
  const feedbackMessage = validationError ?? requestError;
  const toolbar =
    searchValue !== undefined && onSearchChange && onSearch ? (
      <PaymentsToolbar
        onSearch={onSearch}
        onSearchChange={onSearchChange}
        feedbackMessage={feedbackMessage}
        currencyValue={currencyValue}
        onCurrencyChange={onCurrencyChange}
        searchValue={searchValue}
        validationError={validationError}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
      />
    ) : undefined;

  if (requestError) {
    return toolbar ?? <ErrorBox role="alert">{requestError}</ErrorBox>;
  }

  return (
    <DataTable
      columns={paymentColumns}
      data={payments}
      emptyMessage={I18N.NO_PAYMENTS_FOUND}
      getRowKey={(payment) => payment.id}
      isLoading={isLoading}
      toolbar={toolbar}
    />
  );
};
