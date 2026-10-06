import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { describe, expect, test, vi } from "vitest";
import { CURRENCIES } from "../../constants";
import { I18N } from "../../constants/i18n";
import { PaymentsToolbar } from "./PaymentsToolbar";

describe("PaymentsToolbar", () => {
  test("renders an accessible payment search form and submits it", () => {
    const onSearchChange = vi.fn();
    const onSearch = vi.fn();
    render(
      <PaymentsToolbar
        onSearch={onSearch}
        onSearchChange={onSearchChange}
        searchValue=""
      />,
    );

    const input = screen.getByRole("searchbox", { name: I18N.SEARCH_LABEL });
    fireEvent.change(input, { target: { value: "pay_134_1" } });
    fireEvent.click(screen.getByRole("button", { name: I18N.SEARCH_BUTTON }));

    expect(onSearchChange).toHaveBeenCalledWith("pay_134_1");
    expect(onSearch).toHaveBeenCalledOnce();
  });

  test("shows Clear Filters only when filters are active", () => {
    const onClearFilters = vi.fn();
    const { rerender } = render(
      <PaymentsToolbar
        hasActiveFilters={false}
        onClearFilters={onClearFilters}
        onSearch={vi.fn()}
        onSearchChange={vi.fn()}
        searchValue=""
      />,
    );

    expect(screen.queryByRole("button", { name: I18N.CLEAR_FILTERS })).not.toBeInTheDocument();

    rerender(
      <PaymentsToolbar
        hasActiveFilters
        onClearFilters={onClearFilters}
        onSearch={vi.fn()}
        onSearchChange={vi.fn()}
        searchValue="pay_134_1"
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: I18N.CLEAR_FILTERS }));

    expect(onClearFilters).toHaveBeenCalledOnce();
  });

  test("renders an accessible currency filter with every available currency", () => {
    const onCurrencyChange = vi.fn();
    render(
      <PaymentsToolbar
        currencyValue=""
        onCurrencyChange={onCurrencyChange}
        onSearch={vi.fn()}
        onSearchChange={vi.fn()}
        searchValue=""
      />,
    );

    const currencySelect = screen.getByRole("combobox", {
      name: I18N.CURRENCY_FILTER_LABEL,
    });
    fireEvent.change(currencySelect, { target: { value: "USD" } });

    expect(onCurrencyChange).toHaveBeenCalledWith("USD");
    expect(screen.getAllByRole("option")).toHaveLength(CURRENCIES.length + 1);
  });
});
