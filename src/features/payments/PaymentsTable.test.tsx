import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { format } from "date-fns";
import { describe, expect, test } from "vitest";
import { I18N } from "../../constants/i18n";
import { mockPayments134 } from "../../mocks/mockPaymentsData";
import type { Payment } from "../../types/payment";
import { PaymentsTable } from "./PaymentsTable";

describe("PaymentsTable", () => {
  test("renders payment values with their payment-specific formatting", () => {
    const payment = mockPayments134[0];
    render(<PaymentsTable payments={[payment]} />);

    expect(screen.getByRole("columnheader", { name: I18N.TABLE_HEADER_PAYMENT_ID })).toBeInTheDocument();
    expect(screen.getByText(payment.id)).toBeInTheDocument();
    expect(screen.getByText(format(new Date(payment.date), "dd/MM/yyyy, HH:mm:ss"))).toBeInTheDocument();
    expect(screen.getByText("250.00")).toBeInTheDocument();
    expect(screen.getByText(payment.customerName!)).toBeInTheDocument();
    expect(screen.getByText(payment.currency!)).toBeInTheDocument();
    expect(screen.getByText(payment.status)).toBeInTheDocument();
  });

  test("uses payment fallbacks for missing optional fields", () => {
    const payment: Payment = {
      ...mockPayments134[0],
      customerName: undefined,
      currency: undefined,
    };
    render(<PaymentsTable payments={[payment]} />);

    expect(screen.getAllByText(I18N.EMPTY_CUSTOMER)).toHaveLength(2);
  });

  test("shows the table loading state while payment data is pending", () => {
    render(<PaymentsTable isLoading payments={[]} />);

    expect(screen.getByRole("columnheader", { name: I18N.TABLE_HEADER_PAYMENT_ID })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument();
  });
});
