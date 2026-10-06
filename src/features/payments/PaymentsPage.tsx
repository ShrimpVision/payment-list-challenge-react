import { Container, Title } from "../../components/components";
import { I18N } from "../../constants/i18n";
import { PaymentsPagination } from "./PaymentsPagination";
import { PaymentsTable } from "./PaymentsTable";
import { usePaymentsPage } from "./usePaymentsPage";

export const PaymentsPage = () => {
  const {
    currencyValue,
    hasActiveFilters,
    isLoading,
    onClearFilters,
    onCurrencyChange,
    onPageChange,
    onSearch,
    onSearchChange,
    pagination,
    payments,
    requestError,
    searchValue,
    validationError,
  } = usePaymentsPage();

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsTable
        currencyValue={currencyValue}
        hasActiveFilters={hasActiveFilters}
        isLoading={isLoading}
        onClearFilters={onClearFilters}
        onCurrencyChange={onCurrencyChange}
        onSearch={onSearch}
        onSearchChange={onSearchChange}
        payments={payments}
        pagination={
          pagination ? (
            <PaymentsPagination
              onPageChange={onPageChange}
              page={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
            />
          ) : undefined
        }
        requestError={requestError}
        searchValue={searchValue}
        validationError={validationError}
      />
    </Container>
  );
};
