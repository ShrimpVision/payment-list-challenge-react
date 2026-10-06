import { Container, Title } from "../../components/components";
import { I18N } from "../../constants/i18n";
import type { Payment } from "../../types/payment";
import { PaymentsTable } from "./PaymentsTable";
import { useGetPayments } from "./usePayments";

const INITIAL_PAYMENTS_QUERY = { page: 1, pageSize: 5 };
const EMPTY_PAYMENTS: Payment[] = [];

export const PaymentsPage = () => {
  const { data, isPending } = useGetPayments(INITIAL_PAYMENTS_QUERY);

  return (
    <Container>
      <Title>{I18N.PAGE_TITLE}</Title>
      <PaymentsTable isLoading={isPending} payments={data?.payments ?? EMPTY_PAYMENTS} />
    </Container>
  );
};
