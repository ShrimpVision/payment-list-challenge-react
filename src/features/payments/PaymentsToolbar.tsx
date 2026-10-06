import type { FormEvent } from "react";
import {
  ClearButton,
  ErrorBox,
  FilterRow,
  SearchButton,
  SearchInput,
  Select,
} from "../../components/components";
import { CURRENCIES } from "../../constants";
import { I18N } from "../../constants/i18n";

interface PaymentsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  validationError?: string;
  feedbackMessage?: string;
  currencyValue?: string;
  onCurrencyChange?: (value: string) => void;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export const PaymentsToolbar = ({
  searchValue,
  onSearchChange,
  onSearch,
  validationError,
  feedbackMessage,
  currencyValue,
  onCurrencyChange,
  hasActiveFilters = false,
  onClearFilters,
}: PaymentsToolbarProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <FilterRow>
        <SearchInput
          aria-label={I18N.SEARCH_LABEL}
          aria-describedby={validationError ? "payment-id-search-error" : undefined}
          aria-invalid={Boolean(validationError)}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={I18N.SEARCH_PLACEHOLDER}
          type="search"
          value={searchValue}
        />
        {currencyValue !== undefined && onCurrencyChange && (
          <Select
            aria-label={I18N.CURRENCY_FILTER_LABEL}
            onChange={(event) => onCurrencyChange(event.target.value)}
            value={currencyValue}
          >
            <option value="">{I18N.CURRENCIES_OPTION}</option>
            {CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </Select>
        )}
        <SearchButton type="submit">{I18N.SEARCH_BUTTON}</SearchButton>
        {hasActiveFilters && onClearFilters && (
          <ClearButton onClick={onClearFilters} type="button">
            {I18N.CLEAR_FILTERS}
          </ClearButton>
        )}
      </FilterRow>
      {feedbackMessage && (
        <ErrorBox id="payment-id-search-error" role="alert">
          {feedbackMessage}
        </ErrorBox>
      )}
    </form>
  );
};
