import type { FormEvent } from "react";
import {
  ClearButton,
  ErrorBox,
  FilterRow,
  SearchButton,
  SearchInput,
} from "../../components/components";
import { I18N } from "../../constants/i18n";

interface PaymentsToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  searchError?: string;
  hasActiveFilters?: boolean;
  onClearFilters?: () => void;
}

export const PaymentsToolbar = ({
  searchValue,
  onSearchChange,
  onSearch,
  searchError,
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
          aria-describedby={searchError ? "payment-id-search-error" : undefined}
          aria-invalid={Boolean(searchError)}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={I18N.SEARCH_PLACEHOLDER}
          type="search"
          value={searchValue}
        />
        <SearchButton type="submit">{I18N.SEARCH_BUTTON}</SearchButton>
        {hasActiveFilters && onClearFilters && (
          <ClearButton onClick={onClearFilters} type="button">
            {I18N.CLEAR_FILTERS}
          </ClearButton>
        )}
      </FilterRow>
      {searchError && (
        <ErrorBox id="payment-id-search-error" role="alert">
          {searchError}
        </ErrorBox>
      )}
    </form>
  );
};
