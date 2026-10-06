import { useEffect, useRef } from "react";
import {
  DialogCloseButton,
  DialogContent,
  DialogBody,
  DialogDetails,
  DialogHeader,
  DialogOverlay,
} from "../../components/components";
import { I18N } from "../../constants/i18n";
import type { Payment } from "../../types/payment";
import { formatAmount, formatPaymentDate } from "./formatters";

interface PaymentDetailsDialogProps {
  payment: Payment;
  onClose: () => void;
}

export const PaymentDetailsDialog = ({ payment, onClose }: PaymentDetailsDialogProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const paymentDetails: Array<{ label: string; value?: string }> = [
    { label: I18N.TABLE_HEADER_PAYMENT_ID, value: payment.id },
    { label: I18N.TABLE_HEADER_DATE, value: formatPaymentDate(payment.date) },
    { label: I18N.TABLE_HEADER_AMOUNT, value: formatAmount(payment.amount) },
    { label: I18N.TABLE_HEADER_CUSTOMER, value: payment.customerName || I18N.EMPTY_CUSTOMER },
    { label: I18N.TABLE_HEADER_CURRENCY, value: payment.currency || I18N.EMPTY_CURRENCY },
    { label: I18N.TABLE_HEADER_STATUS, value: payment.status },
    { label: I18N.CUSTOMER_ADDRESS, value: payment.customerAddress },
    { label: I18N.DESCRIPTION, value: payment.description },
    { label: I18N.CLIENT_ID, value: payment.clientId },
  ];
  const availablePaymentDetails = paymentDetails.filter(
    (detail): detail is { label: string; value: string } => Boolean(detail.value),
  );

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocusedElement?.focus();
    };
  }, [onClose]);

  return (
    <DialogOverlay onClick={onClose}>
      <DialogContent
        aria-labelledby="payment-details-title"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <DialogHeader>
          <h3 id="payment-details-title">{`${I18N.PAYMENT_DETAILS_TITLE}: ${payment.id}`}</h3>
          <DialogCloseButton aria-label={I18N.CLOSE} onClick={onClose} ref={closeButtonRef}>
            {I18N.CLOSE}
          </DialogCloseButton>
        </DialogHeader>
        <DialogBody>
          <DialogDetails>
            {availablePaymentDetails.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </DialogDetails>
        </DialogBody>
      </DialogContent>
    </DialogOverlay>
  );
};
