import type { Key, KeyboardEvent, ReactNode } from "react";
import {
  EmptyBox,
  Table,
  TableBodyWrapper,
  TableCell,
  TableHeader,
  TableHeaderRow,
  TableHeaderWrapper,
  TableLoadingState,
  TableRow,
  TableWrapper,
  Spinner,
} from "./components";

export interface DataTableColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  data: readonly T[];
  columns: readonly DataTableColumn<T>[];
  getRowKey: (row: T) => Key;
  emptyMessage: ReactNode;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  toolbar?: ReactNode;
  footer?: ReactNode;
}

export const DataTable = <T,>({
  data,
  columns,
  getRowKey,
  emptyMessage,
  isLoading = false,
  onRowClick,
  toolbar,
  footer,
}: DataTableProps<T>) => {
  const handleRowKeyDown = (event: KeyboardEvent<HTMLTableRowElement>, row: T) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onRowClick?.(row);
    }
  };

  return (
    <>
      {toolbar}
      <TableWrapper>
        <Table>
          <TableHeaderWrapper>
            <TableHeaderRow>
              {columns.map((column) => (
                <TableHeader key={column.id} scope="col">
                  {column.header}
                </TableHeader>
              ))}
            </TableHeaderRow>
          </TableHeaderWrapper>
          <TableBodyWrapper>
            {!isLoading &&
              (data.length === 0 ? (
                <tr>
                  <TableCell colSpan={columns.length}>
                    <EmptyBox>{emptyMessage}</EmptyBox>
                  </TableCell>
                </tr>
              ) : (
                data.map((row) => (
                  <TableRow
                    key={getRowKey(row)}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={onRowClick ? (event) => handleRowKeyDown(event, row) : undefined}
                    role={onRowClick ? "button" : undefined}
                    tabIndex={onRowClick ? 0 : undefined}
                  >
                    {columns.map((column) => (
                      <TableCell key={column.id}>{column.cell(row)}</TableCell>
                    ))}
                  </TableRow>
                ))
              ))}
          </TableBodyWrapper>
        </Table>
        {isLoading && (
          <TableLoadingState>
            <Spinner aria-label="Loading" role="status" />
          </TableLoadingState>
        )}
        {footer}
      </TableWrapper>
    </>
  );
};
