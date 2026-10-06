import { format } from "date-fns";

export const formatAmount = (amount: number) => amount.toFixed(2);

export const formatPaymentDate = (date: string) =>
  format(new Date(date), "dd/MM/yyyy, HH:mm:ss");
