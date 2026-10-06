export const formatPaymentIdSearch = (value: string) => value.trim().toLowerCase();

const PAYMENT_ID_PATTERN = /^pay_[a-z0-9_]*$/i;

export const isValidPaymentIdSearch = (value: string) => PAYMENT_ID_PATTERN.test(value);
