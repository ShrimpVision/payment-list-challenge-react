import { useState } from "react";
import { Container, Title } from "../../components/components";
import { I18N } from "../../constants/i18n";
import type { Payment } from "../../types/payment";
import { isInternalServerError, isNotFoundError } from "./errors";
import { PaymentsPagination } from "./PaymentsPagination";
import { PaymentsTable } from "./PaymentsTable";
import { formatPaymentIdSearch, isValidPaymentIdSearch } from "./search";
import { useGetPayments } from "./usePayments";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;
const EMPTY_PAYMENTS: Payment[] = [];

export const PaymentsPage = () => {
  const [paymentIdInput, setPaymentIdInput] = useState("");
  const [paymentIdSearch, setPaymentIdSearch] = useState("");
  const [currencyInput, setCurrencyInput] = useState("");
  const [currency, setCurrency] = useState("");
  const [searchError, setSearchError] = useState<string>();
  const [page, setPage] = useState(DEFAULT_PAGE);

  const paymentsQuery = {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    ...(paymentIdSearch && { search: paymentIdSearch }),
    ...(currency && { currency }),
  };

  const { data, error, isPending } = useGetPayments(paymentsQuery);
  
  const errorMessage = error
    ? isNotFoundError(error)
      ? I18N.PAYMENT_NOT_FOUND
      : isInternalServerError(error)
        ? I18N.INTERNAL_SERVER_ERROR
        : I18N.SOMETHING_WENT_WRONG
    : undefined;

  const handleSearch = () => {
    const formattedSearch = formatPaymentIdSearch(paymentIdInput);

    if (formattedSearch && !isValidPaymentIdSearch(formattedSearch)) {
      setSearchError(I18N.INVALID_PAYMENT_ID);
      return;
    }

    setSearchError(undefined);
    setPaymentIdInput(formattedSearch);
    setPaymentIdSearch(formattedSearch);
    setCurrency(currencyInput);
    setPage(DEFAULT_PAGE);
  };

  const handleSearchChange = (value: string) => {
    setPaymentIdInput(value);
    setSearchError(undefined);
  };

  const handleCurrencyChange = (value: string) => {
    setCurrencyInput(value);
  };

  const handleClearFilters = () => {
    setPaymentIdInput("");
    setPaymentIdSearch("");
    setCurrencyInput("");
    setCurrency("");
    setSearchError(undefined);
    setPage(DEFAULT_PAGE);
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsTable
        currencyValue={currencyInput}
        hasActiveFilters={Boolean(paymentIdSearch || currency)}
        isLoading={isPending}
        onClearFilters={handleClearFilters}
        onCurrencyChange={handleCurrencyChange}
        onSearch={handleSearch}
        onSearchChange={handleSearchChange}
        payments={data?.payments ?? EMPTY_PAYMENTS}
        pagination={
          data ? (
            <PaymentsPagination
              onPageChange={setPage}
              page={data.page}
              pageSize={data.pageSize}
              total={data.total}
            />
          ) : undefined
        }
        requestError={errorMessage}
        searchValue={paymentIdInput}
        validationError={searchError}
      />
    </Container>
  );
};
