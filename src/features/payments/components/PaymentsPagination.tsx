import { PaginationButton, PaginationRow } from "../../../components/components";
import { I18N } from "../../../constants/i18n";

interface PaymentsPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const PaymentsPagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: PaymentsPaginationProps) => {
  const hasNextPage = page * pageSize < total;

  return (
    <PaginationRow aria-label="Pagination" role="navigation">
      <PaginationButton disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        {I18N.PREVIOUS_BUTTON}
      </PaginationButton>
      <div>{`${I18N.PAGE_LABEL} ${page}`}</div>
      <PaginationButton disabled={!hasNextPage} onClick={() => onPageChange(page + 1)}>
        {I18N.NEXT_BUTTON}
      </PaginationButton>
    </PaginationRow>
  );
};
