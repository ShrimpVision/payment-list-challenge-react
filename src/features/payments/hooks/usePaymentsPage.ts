import { useState } from "react";
import { I18N } from "../../../constants/i18n";
import type { Payment } from "../../../types/payment";
import { isInternalServerError, isNotFoundError } from "../utils/errors";
import { formatPaymentIdSearch, isValidPaymentIdSearch } from "../utils/search";
import { useGetPayments } from "./usePayments";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 5;
const EMPTY_PAYMENTS: Payment[] = [];

export const usePaymentsPage = () => {
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
  const requestError = error
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

  return {
    currencyValue: currencyInput,
    hasActiveFilters: Boolean(paymentIdSearch || currency),
    isLoading: isPending,
    onClearFilters: handleClearFilters,
    onCurrencyChange: handleCurrencyChange,
    onPageChange: setPage,
    onSearch: handleSearch,
    onSearchChange: handleSearchChange,
    pagination: data
      ? { page: data.page, pageSize: data.pageSize, total: data.total }
      : undefined,
    payments: data?.payments ?? EMPTY_PAYMENTS,
    requestError,
    searchValue: paymentIdInput,
    validationError: searchError,
  };
};
