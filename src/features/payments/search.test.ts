import { describe, expect, test } from "vitest";
import { formatPaymentIdSearch, isValidPaymentIdSearch } from "./search";

describe("payment ID search validation", () => {
  test.each(["pay_", "pay_123", "pay_abc", "pay_abc_123", "PAY_134_1"])(
    "accepts %s as a payment ID",
    (paymentId) => {
      expect(isValidPaymentIdSearch(paymentId)).toBe(true);
    },
  );

  test.each(["f", "pay", "payment_123", "pay-123"])(
    "rejects %s as a payment ID",
    (paymentId) => {
      expect(isValidPaymentIdSearch(paymentId)).toBe(false);
    },
  );

  test("trims and lowercases a submitted payment ID", () => {
    expect(formatPaymentIdSearch("  PAY_ABC_123  ")).toBe("pay_abc_123");
  });
});
