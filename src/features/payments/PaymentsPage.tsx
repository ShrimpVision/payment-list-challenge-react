import { Container, Title } from "../../components/components";
import { I18N } from "../../constants/i18n";
import { mockPayments134 } from "../../mocks/mockPaymentsData";
import { PaymentsTable } from "./PaymentsTable";

export const PaymentsPage = () => (
  <Container>
    <Title>{I18N.PAGE_TITLE}</Title>
    <PaymentsTable payments={mockPayments134} />
  </Container>
);
