import { useState } from "react";
import { Container, Title } from "../../components/components";
import { I18N } from "../../constants/i18n";
import type { Payment } from "../../types/payment";
import { PaymentsTable } from "./PaymentsTable";
import { formatPaymentIdSearch, isValidPaymentIdSearch } from "./search";
import { useGetPayments } from "./usePayments";

const INITIAL_PAYMENTS_QUERY = { page: 1, pageSize: 5 };
const EMPTY_PAYMENTS: Payment[] = [];

export const PaymentsPage = () => {
  const [paymentIdInput, setPaymentIdInput] = useState("");
  const [paymentIdSearch, setPaymentIdSearch] = useState("");
  const [searchError, setSearchError] = useState<string>();
  const paymentsQuery = paymentIdSearch
    ? { search: paymentIdSearch }
    : INITIAL_PAYMENTS_QUERY;
  const { data, isPending } = useGetPayments(paymentsQuery);

  const handleSearch = () => {
    const formattedSearch = formatPaymentIdSearch(paymentIdInput);

    if (!isValidPaymentIdSearch(formattedSearch)) {
      setSearchError(I18N.INVALID_PAYMENT_ID);
      return;
    }

    setSearchError(undefined);
    setPaymentIdInput(formattedSearch);
    setPaymentIdSearch(formattedSearch);
  };

  const handleSearchChange = (value: string) => {
    setPaymentIdInput(value);
    setSearchError(undefined);
  };

  const handleClearFilters = () => {
    setPaymentIdInput("");
    setPaymentIdSearch("");
    setSearchError(undefined);
  };

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsTable
        hasActiveFilters={Boolean(paymentIdSearch)}
        isLoading={isPending}
        onClearFilters={handleClearFilters}
        onSearch={handleSearch}
        onSearchChange={handleSearchChange}
        payments={data?.payments ?? EMPTY_PAYMENTS}
        searchError={searchError}
        searchValue={paymentIdInput}
      />
    </Container>
  );
};
